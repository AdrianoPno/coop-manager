import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cooperadoService } from "../services/cooperado.service";
import { CooperadoFormData } from "../schemas/cooperado.schema";

export const useUpdateCooperado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CooperadoFormData>;
    }) => cooperadoService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalida a lista de cooperados para forçar a atualização
      queryClient.invalidateQueries({ queryKey: ["cooperados"] });
      // Invalida os detalhes do cooperado específico para dados frescos na próxima edição
      queryClient.invalidateQueries({ queryKey: ["cooperado", variables.id] });
    },
  });
};
