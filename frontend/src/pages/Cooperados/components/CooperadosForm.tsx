import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInHours } from "date-fns";
import { Loader2 } from "lucide-react";

import { cooperadoSchema } from "../../../schemas/cooperado.schema";
import { cooperadoService } from "../../../services/cooperado.service";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";

interface CooperadoFormProps {
  onSuccess: () => void;
  initialId?: string;
}

export const CooperadoForm: React.FC<CooperadoFormProps> = ({
  onSuccess,
  initialId,
}) => {
  const isEdit = !!initialId;
  const [isLocked, setIsLocked] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(cooperadoSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      ID_COOPERADO: "",
      cargo: "",
      tipoVinculo: "COOP",
      status: "ATIVO",
      dataEntrada: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (isEdit) {
      loadCooperado();
    }
  }, [initialId]);

  const loadCooperado = async () => {
    try {
      setFetchingData(true);
      const data = await cooperadoService.getById(initialId!);

      reset({
        nome: data.nome,
        cpf: data.cpf,
        ID_COOPERADO: data.ID_COOPERADO,
        cargo: data.cargo,
        tipoVinculo: data.tipoVinculo,
        status: data.status,
        dataEntrada: data.dataEntrada,
        dataSaida: data.dataSaida || "",
      });

      // Regra de bloqueio de 48h (Exceto Cargo, Vínculo e Status)
      if (data.createdAt || data.criadoEm) {
        const rawDate = data.createdAt || data.criadoEm;
        const createdAt =
          typeof rawDate === "object" &&
          rawDate !== null &&
          "seconds" in rawDate
            ? new Date((rawDate as any).seconds * 1000)
            : new Date(rawDate);

        const hours = differenceInHours(new Date(), createdAt);
        if (hours >= 48) setIsLocked(true);
      }
    } catch (error) {
      console.error("Erro ao carregar dados", error);
      onSuccess();
    } finally {
      setFetchingData(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (isEdit) {
        await cooperadoService.update(initialId!, data);
      } else {
        await cooperadoService.create(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar", error);
      alert("Erro ao salvar os dados do cooperado.");
    }
  };

  if (fetchingData) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nome Completo"
        {...register("nome")}
        error={errors.nome?.message as string}
        disabled={isLocked || isSubmitting}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="CPF"
          {...register("cpf")}
          error={errors.cpf?.message as string}
          disabled={isLocked || isSubmitting}
        />
        <Input
          label="Matrícula"
          {...register("ID_COOPERADO")}
          error={errors.ID_COOPERADO?.message as string}
          disabled={isLocked || isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Função (Cargo)"
          {...register("cargo")}
          error={errors.cargo?.message as string}
          disabled={isSubmitting}
        />
        <Select
          label="Vínculo"
          {...register("tipoVinculo")}
          error={errors.tipoVinculo?.message as string}
          disabled={isSubmitting}
        >
          <option value="COOP">COOP</option>
          <option value="RPA">RPA</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Data de Entrada"
          type="date"
          {...register("dataEntrada")}
          error={errors.dataEntrada?.message as string}
          disabled={isLocked || isSubmitting}
        />
        <Select
          label="Status"
          {...register("status")}
          error={errors.status?.message as string}
          disabled={isSubmitting}
        >
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
          <option value="PENDENTE">Pendente</option>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onSuccess}
          className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-300 transition-colors flex items-center"
        >
          {isSubmitting && <Loader2 className="animate-spin mr-2" size={18} />}
          {isEdit ? "Atualizar Dados" : "Salvar Cooperado"}
        </button>
      </div>
    </form>
  );
};
