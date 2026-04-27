import { useQuery } from "@tanstack/react-query";
import { unidadesService } from "../services/unidadesService";

export const useUnidades = () => {
  return useQuery({
    queryKey: ["unidades"],
    queryFn: unidadesService.getAll,
  });
};
