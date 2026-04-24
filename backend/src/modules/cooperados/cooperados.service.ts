import { db } from "../../config/firebase.js";
import { AppError } from "../../utils/AppError.js";
import {
  ICooperado,
  ICreateCooperadoDTO,
  IUpdateCooperadoDTO,
} from "./cooperado.types.js";

export class CooperadosService {
  private collection = db.collection("cooperados");

  async listByUnidade(unidadeId: string): Promise<ICooperado[]> {
    const snapshot = await this.collection
      .where("unidadeId", "==", unidadeId)
      .orderBy("nome", "asc")
      .get();

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as ICooperado,
    );
  }

  async create(data: ICreateCooperadoDTO, unidadeId: string): Promise<string> {
    // Regra Sênior: Garantir que o unidadeId venha do usuário logado, não do body
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
    unidadeId: string,
  ): Promise<void> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    // 1. Validar existência
    if (!doc.exists) {
      throw new AppError("Cooperado não encontrado.", 404);
    }

    // 2. Validar Isolamento (Multi-tenant)
    if (doc.data()?.unidadeId !== unidadeId) {
      throw new AppError(
        "Acesso negado: este registro pertence a outra unidade.",
        403,
      );
    }

    // 3. Persistir atualização
    await docRef.update({
      ...data,
      atualizadoEm: new Date(),
    });
  }

  async getById(id: string, unidadeId: string): Promise<ICooperado> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists || doc.data()?.unidadeId !== unidadeId) {
      throw new AppError("Cooperado não encontrado nesta unidade.", 404);
    }

    return { id: doc.id, ...doc.data() } as ICooperado;
  }
}
