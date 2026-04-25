import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cooperadoService } from "../services/cooperado.service";
import { CooperadoFormData } from "../schemas/cooperado.schema";

export const useCreateCooperado = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CooperadoFormData) => cooperadoService.create(data),
    onSuccess: () => {
      // Quando a mutation for bem-sucedida, invalide a query de 'cooperados'.
      // Isso fará com que o React Query busque os dados novamente, atualizando a lista.
      queryClient.invalidateQueries({ queryKey: ["cooperados"] });
    },
    // onError pode ser tratado diretamente no componente para exibir feedbacks
    // específicos (ex: com react-hot-toast).
  });
};
