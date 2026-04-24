import { db } from "../../config/firebase";
import { AppError } from "../../utils/AppError";
import { getAuth } from "firebase-admin/auth";
import { IUser, ICreateUserDTO, IUpdateUserDTO } from "./usuario.types";

export class UsersService {
  private collection = db.collection("users");

  /**
   * Busca usuário pelo ID (UID do Firebase)
   */
  async getById(uid: string): Promise<IUser> {
    const doc = await this.collection.doc(uid).get();

    if (!doc.exists) {
      throw new AppError("Usuário não encontrado no sistema.", 404);
    }

    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate
        ? data.createdAt.toDate()
        : data?.createdAt,
    } as IUser;
  }

  /**
   * Lista usuários filtrando obrigatoriamente pela unidade do Admin logado
   */
  async listByUnidade(unidadeId: string): Promise<IUser[]> {
    const snapshot = await this.collection
      .where("unidadeId", "==", unidadeId)
      .get();

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

  /**
   * Cria o perfil do usuário no Firestore usando o UID gerado pelo Auth
   */
  async create(data: ICreateUserDTO, unidadeId: string): Promise<void> {
    const userRef = this.collection.doc(data.uid);
    const doc = await userRef.get();

    if (doc.exists) {
      throw new AppError("Este usuário já possui um perfil cadastrado.", 400);
    }

    const newUser: Omit<IUser, "id"> = {
      ...data,
      unidadeId,
      ativo: true,
      createdAt: new Date(),
    };

    await userRef.set(newUser);
  }

  /**
   * Atualiza dados do usuário com trava de segurança por unidade
   */
  async update(
    uid: string,
    data: IUpdateUserDTO,
    adminUnidadeId: string,
  ): Promise<void> {
    const userRef = this.collection.doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    // Validação Sênior: Admin só edita usuários da sua unidade
    if (doc.data()?.unidadeId !== adminUnidadeId) {
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

  /**
   * Exclui um usuário do Firestore e do Firebase Authentication.
   */
  async delete(uid: string, adminUnidadeId: string): Promise<void> {
    const userRef = this.collection.doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    // Validação Sênior: Admin só exclui usuários da sua unidade
    if (doc.data()?.unidadeId !== adminUnidadeId) {
      throw new AppError(
        "Acesso negado: usuário pertence a outra unidade.",
        403,
      );
    }

    // Exclui do Firestore
    await userRef.delete();

    // Exclui do Firebase Authentication
    try {
      await getAuth().deleteUser(uid);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        console.warn(
          `Usuário com UID ${uid} já havia sido removido do Firebase Auth.`,
        );
      } else {
        throw new AppError("Falha ao remover o usuário da autenticação.", 500);
      }
    }
  }
}
