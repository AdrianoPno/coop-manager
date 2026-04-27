import { useQuery } from "@tanstack/react-query";
import { usuariosService } from "../services/usuariosService";

export const useUsuarios = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: usuariosService.getAll,
  });
};
