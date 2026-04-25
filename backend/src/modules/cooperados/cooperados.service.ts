import { db } from "../../config/firebase";
import { AppError } from "../../utils/AppError";
import {
  ICooperado,
  ICreateCooperadoDTO,
  IUpdateCooperadoDTO,
} from "./cooperado.types";

// Alinhado com o que discutimos para o Auth
interface AuthUser {
  role?: "SUPER" | "ADMIN" | "USER";
  unidadeId?: string;
}

export class CooperadosService {
  private collection = db.collection("cooperados");

  async list(user: AuthUser): Promise<ICooperado[]> {
    let query: FirebaseFirestore.Query = this.collection;

    // Multi-tenant: ADMIN vê apenas o seu. SUPER vê tudo.
    if (user.role === "ADMIN") {
      if (!user.unidadeId) {
        throw new AppError("Usuário admin sem unidade associada.", 400);
      }
      query = query.where("unidadeId", "==", user.unidadeId);
    }

    const snapshot = await query.orderBy("nome", "asc").get();

    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as ICooperado,
    );
  }

  async create(data: ICreateCooperadoDTO, user: AuthUser): Promise<string> {
    if (!user.unidadeId && user.role !== "SUPER") {
      throw new AppError("Unidade não identificada para criação.", 400);
    }

    // Regra: Se for ADMIN, usa a unidade dele.
    // Se for SUPER, usa a unidade vinda do body (data.unidadeId)
    const unidadeId =
      user.role === "SUPER" ? (data as any).unidadeId : user.unidadeId;

    const newDoc: Omit<ICooperado, "id"> = {
      ...data,
      unidadeId,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    const docRef = await this.collection.add(newDoc);
    return docRef.id;
  }

  async update(
    id: string,
    data: IUpdateCooperadoDTO,
    user: AuthUser,
  ): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) throw new AppError("Cooperado não encontrado.", 404);

    // Bloqueio Multi-tenant
    if (user.role === "ADMIN" && doc.data()?.unidadeId !== user.unidadeId) {
      throw new AppError("Acesso negado: registro de outra unidade.", 403);
    }

    await docRef.update({
      ...data,
      atualizadoEm: new Date(),
    });
  }

  async getById(id: string, user: AuthUser): Promise<ICooperado> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) throw new AppError("Cooperado não encontrado.", 404);

    const cooperadoData = doc.data();

    if (user.role === "ADMIN" && cooperadoData?.unidadeId !== user.unidadeId) {
      throw new AppError("Cooperado não encontrado nesta unidade.", 404);
    }

    return { id: doc.id, ...cooperadoData } as ICooperado;
  }

  async delete(id: string, user: AuthUser): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) throw new AppError("Cooperado não encontrado.", 404);

    if (user.role === "ADMIN" && doc.data()?.unidadeId !== user.unidadeId) {
      throw new AppError("Acesso negado.", 403);
    }

    await docRef.delete();
  }
}
