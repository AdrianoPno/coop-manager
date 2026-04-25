import { db } from "../../config/firebase";
import { AppError } from "../../utils/AppError";
import { getAuth } from "firebase-admin/auth";
import { IUser, ICreateUserDTO, IUpdateUserDTO } from "./usuario.types";

interface AuthUser {
  role: "SUPER" | "ADMIN" | "USER";
  unidadeId?: string;
}

export class UsersService {
  private collection = db.collection("users");

  async getById(uid: string, user: AuthUser): Promise<IUser> {
    const doc = await this.collection.doc(uid).get();

    if (!doc.exists) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const data = doc.data();

    // Multi-tenant: ADMIN só vê usuários da própria unidade
    if (user.role === "ADMIN" && data?.unidadeId !== user.unidadeId) {
      throw new AppError("Acesso negado: usuário de outra unidade.", 403);
    }

    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate
        ? data.createdAt.toDate()
        : data?.createdAt,
    } as IUser;
  }

  async list(user: AuthUser): Promise<IUser[]> {
    let query: FirebaseFirestore.Query = this.collection;

    // Se for ADMIN, filtra. Se for SUPER, não entra aqui e traz tudo.
    if (user.role === "ADMIN") {
      if (!user.unidadeId)
        throw new AppError("Admin sem unidade vinculada.", 400);
      query = query.where("unidadeId", "==", user.unidadeId);
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate
          ? data.createdAt.toDate()
          : data?.createdAt,
      } as IUser;
    });
  }

  async create(data: ICreateUserDTO, user: AuthUser): Promise<void> {
    const userRef = this.collection.doc(data.uid);
    const doc = await userRef.get();

    if (doc.exists) {
      throw new AppError("Este usuário já possui um perfil.", 400);
    }

    // Define a unidade: ADMIN força a dele, SUPER usa a que vier no body (data)
    const finalUnidadeId =
      user.role === "SUPER" ? data.unidadeId : user.unidadeId;

    if (!finalUnidadeId) {
      throw new AppError("unidadeId é obrigatório para o cadastro.", 400);
    }

    const newUser: Omit<IUser, "id"> = {
      ...data,
      unidadeId: finalUnidadeId,
      ativo: true,
      createdAt: new Date(),
    };

    await userRef.set(newUser);
  }

  async update(
    uid: string,
    data: IUpdateUserDTO,
    user: AuthUser,
  ): Promise<void> {
    const userRef = this.collection.doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) throw new AppError("Usuário não encontrado.", 404);

    // Trava de segurança: SUPER ignora, ADMIN só edita a própria unidade
    if (user.role === "ADMIN" && doc.data()?.unidadeId !== user.unidadeId) {
      throw new AppError(
        "Acesso negado: usuário pertence a outra unidade.",
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

    // Trava de segurança
    if (user.role === "ADMIN" && doc.data()?.unidadeId !== user.unidadeId) {
      throw new AppError("Acesso negado.", 403);
    }

    await userRef.delete();

    try {
      await getAuth().deleteUser(uid);
    } catch (error: any) {
      if (error.code !== "auth/user-not-found") {
        throw new AppError("Falha ao remover do Firebase Auth.", 500);
      }
    }
  }
}
