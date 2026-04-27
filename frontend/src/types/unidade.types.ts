export type UnidadeStatus = "ATIVO" | "INATIVO";

export interface IUnidade {
  id: string;
  nome: string;
  sigla: string;
  status: UnidadeStatus;
  createdAt: string; // Datas via JSON são strings
  updatedAt: string;
}

export interface ICreateUnidadeDTO {
  nome: string;
  sigla: string;
  status?: UnidadeStatus;
}

export type IUpdateUnidadeDTO = Partial<ICreateUnidadeDTO>;
