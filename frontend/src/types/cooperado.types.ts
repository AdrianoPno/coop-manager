export interface ICooperado {
  createdAt: string | Date;
  id: string;
  ID_COOPERADO: string;
  nome: string;
  email: string; // Adicione se não estiver no seu tipo, pois está no schema
  cpf: string;
  matricula: string; // Alterado de ReactNode para string
  dataNascimento: string;
  sexo: "Masculino" | "Feminino" | "Outro";
  etnia: string;
  escolaridade: string;
  cargo: string;
  tipoVinculo: "COOP" | "RPA";
  status: "ATIVO" | "INATIVO" | "PENDENTE";
  telefone?: string;
  dataEntrada: string;
  dataSaida?: string | null;
  unidadeId: string;
  criadoEm: string | Date;
  atualizadoEm: string | Date;
}
