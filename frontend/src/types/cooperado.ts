export interface ICooperado {
  id: string;
  ID_COOPERADO: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: "Masculino" | "Feminino" | "Outro";
  etnia: string;
  escolaridade: string;
  cargo: string;
  tipoVinculo: "COOP" | "RPA";
  dataEntrada: string;
  dataSaida?: string | null;
  status: "ATIVO" | "INATIVO";
  unidadeId: string;
  criadoEm: string | Date;
  atualizadoEm: string | Date;
}
