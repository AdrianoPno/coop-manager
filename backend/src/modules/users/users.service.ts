import { db } from "../../config/firebase";
import { AppError } from "../../utils/AppError";
import { getAuth } from "firebase-admin/auth";
import { IUser, ICreateUserDTO, IUpdateUserDTO } from "./usuario.types";
import logger from "../../config/logger";

interface AuthUser {
  role: "SUPER" | "ADMIN" | "USER";
  unidadeId?: string;
}

export class UsersService {
  private collection = db.collection("users");
  private unidadesCollection = db.collection("unidades");

  async list(user: AuthUser): Promise<IUser[]> {
    let query: FirebaseFirestore.Query = this.collection;

    if (user.role === "ADMIN") {
      if (!user.unidadeId)
        throw new AppError("Admin sem unidade vinculada.", 400);
      query = query.where("unidadeId", "==", user.unidadeId);
    }

    const snapshot = await query.orderBy("nome", "asc").get();

    // Para evitar N+1 queries, buscamos todas as unidades de uma vez
    const unidadesSnapshot = await this.unidadesCollection.get();
    const unidadesMap = new Map(
      unidadesSnapshot.docs.map((doc) => [doc.id, doc.data().nome]),
    );

    const users = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        unidadeNome: unidadesMap.get(data.unidadeId) || data.unidadeId, // Enriquecimento
        createdAt: data?.createdAt?.toDate
          ? data.createdAt.toDate()
          : data?.createdAt,
      } as IUser;
    });

    return users;
  }

  async getById(id: string, user: AuthUser): Promise<IUser> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const userData = doc.data() as IUser;

    // Trava Multi-tenant: SUPER ignora, ADMIN só pode ver se for da mesma unidade
    if (user.role === "ADMIN" && userData.unidadeId !== user.unidadeId) {
      throw new AppError(
        "Acesso negado: este usuário pertence a outra unidade.",
        403,
      );
    }

    // Garante que o nome da unidade seja populado
    if (userData.unidadeId && !userData.unidadeNome) {
      const unidadeDoc = await this.unidadesCollection
        .doc(userData.unidadeId)
        .get();
      if (unidadeDoc.exists) {
        userData.unidadeNome = unidadeDoc.data()?.nome;
      }
    }

    return { id: doc.id, ...userData } as IUser;
  }

  async create(data: ICreateUserDTO, user: AuthUser): Promise<string> {
    const { email, password, nome, role } = data;

    // 1. Regra de Negócio: Hierarquia
    if (user.role === "ADMIN" && role !== "USER") {
      throw new AppError("ADMINs só podem criar usuários nível USER.", 403);
    }

    // 2. Determinação da Unidade
    const finalUnidadeId =
      user.role === "SUPER" ? data.unidadeId : user.unidadeId;
    if (!finalUnidadeId) {
      throw new AppError("Unidade de destino não identificada.", 400);
    }

    // 3. Operação Atômica: Auth First
    let authRecord;
    try {
      authRecord = await getAuth().createUser({
        email,
        password,
        displayName: nome,
      });
    } catch (error: any) {
      if (error.code === "auth/email-already-exists") {
        throw new AppError("Este e-mail já está em uso.", 409);
      }
      throw new AppError("Erro ao criar credenciais de acesso.", 500);
    }

    // 4. Firestore Second + Rollback
    try {
      const newUser: Omit<IUser, "id"> = {
        uid: authRecord.uid,
        nome,
        email,
        role,
        unidadeId: finalUnidadeId,
        ativo: true,
        createdAt: new Date(),
      };

      await this.collection.doc(authRecord.uid).set(newUser);
      return authRecord.uid;
    } catch (dbError) {
      // ROLLBACK: Limpa o Auth se o banco falhar
      await getAuth().deleteUser(authRecord.uid);
      logger.error(
        { uid: authRecord.uid, err: dbError },
        "🔥 Falha no Firestore. Rollback no Auth executado.",
      );
      throw new AppError(
        "Erro ao salvar perfil. O cadastro foi cancelado.",
        500,
      );
    }
  }

  async update(
    uid: string,
    data: IUpdateUserDTO,
    user: AuthUser,
  ): Promise<void> {
    const userRef = this.collection.doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) throw new AppError("Usuário não encontrado.", 404);

    const currentData = doc.data();

    // Trava Multi-tenant: SUPER ignora, ADMIN só edita se for da mesma unidade
    if (user.role === "ADMIN" && currentData?.unidadeId !== user.unidadeId) {
      throw new AppError(
        "Acesso negado: este usuário pertence a outra unidade.",
        403,
      );
    }

    await userRef.update({
      ...data,
      updatedAt: new Date(),
    });
  }

  async delete(uid: string, user: AuthUser): Promise<void> {
    const userRef = this.collection.doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) throw new AppError("Usuário não encontrado.", 404);

    // Trava de segurança para exclusão
    if (user.role === "ADMIN" && doc.data()?.unidadeId !== user.unidadeId) {
      throw new AppError("Acesso negado.", 403);
    }

    // Deleta do Firestore
    await userRef.delete();

    // Deleta do Firebase Auth (Tenta, se falhar porque já não existe, ignora)
    try {
      await getAuth().deleteUser(uid);
    } catch (error: any) {
      if (error.code !== "auth/user-not-found") {
        throw new AppError("Falha ao remover o usuário da autenticação.", 500);
      }
    }
  }
}
