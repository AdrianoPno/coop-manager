import { useQuery } from "@tanstack/react-query";
import { cooperadoService } from "../services/cooperado.service";
import { ICooperado } from "../types/cooperado.types";

export const useCooperados = () => {
  return useQuery<ICooperado[]>({
    queryKey: ["cooperados"],
    queryFn: cooperadoService.getAll,
  });
};
