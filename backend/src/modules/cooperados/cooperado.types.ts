export type TipoVinculo = "COOP" | "RPA";
export type StatusCooperado = "ATIVO" | "INATIVO";
export type Sexo = "Masculino" | "Feminino" | "Outro";

export interface ICooperado {
  id?: string; // ID gerado pelo Firestore
  ID_COOPERADO: string; // Matrícula ou ID interno operacional
  nome: string;
  cpf: string;
  dataNascimento: string; // Formato ISO (YYYY-MM-DD)
  sexo: Sexo;
  etnia: string;
  escolaridade: string;
  cargo: string;
  tipoVinculo: TipoVinculo;
  dataEntrada: string; // Formato ISO
  dataSaida?: string | null;
  status: StatusCooperado;
  unidadeId: string; // Chave de isolamento (Multi-tenant)
  criadoEm: Date;
  atualizadoEm: Date;
}

// Helper para criação (campos que o front envia)
export type ICreateCooperadoDTO = Omit<
  ICooperado,
  "id" | "criadoEm" | "atualizadoEm"
>;

// Helper para atualização (campos parciais)
export type IUpdateCooperadoDTO = Partial<ICreateCooperadoDTO>;
