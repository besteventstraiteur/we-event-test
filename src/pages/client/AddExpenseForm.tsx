import { useEffect, useMemo, useState } from "react";
import InputGroup from "../../components/ui-main/InputGroup";
import Button from "../../components/ui/Button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "../../utils/toast";
import { postRequest, patchRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import CustomSelect from "../../components/ui-main/selectBox";

type FormValues = {
  title: string;
  categoryId: string;
  amount: number;
  used_amount: number;
  markPaid: boolean;
};

function AddExpenseForm({
  budgetId,
  fetchAll,
  setActive,
  initialData = null,
  isEdit = false,
  categories = [],
}: any) {
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const schema = useMemo(
    () =>
      yup.object().shape({
        title: yup.string().required("Le titre est requis."),
        categoryId: yup.string().required("La catégorie est obligatoire"),
        amount: yup
          .number()
          .typeError("Le montant doit être un nombre")
          .positive("Le montant doit être positif")
          .required("Le coût estimé est obligatoire"),

        used_amount: yup
          .number()
          .typeError("Le coût réel doit être un nombre")
          .min(0, "Le coût réel doit être égal ou supérieur à 0")
          .required("Le coût réel est obligatoire"),

        markPaid: yup.boolean(),
      }),
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      const selected = categories.find(
        (c: any) => String(c.value) === String(initialData.categoryId),
      );

      setSelectedCategory(selected || null);

      reset({
        title: initialData.title,
        categoryId: initialData.categoryId?.toString(),
        amount: initialData.amount,
        used_amount: initialData.used_amount,
        markPaid: initialData.status === "paid",
      });
    } else {
      setSelectedCategory(null);
      reset({
        title: "",
        categoryId: "",
        amount: undefined,
        used_amount: undefined,
        markPaid: false,
      });
    }
  }, [initialData, reset, categories]);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    const payload = {
      budgetId: Number(budgetId),
      title: data.title,
      categoryId: Number(data.categoryId),
      amount: Number(data.amount),
      used_amount: Number(data.used_amount),
      status: data.markPaid ? "paid" : "pending",
    };

    try {
      let res;
      if (isEdit && initialData?.id) {
        res = await patchRequest(
          `${PROVIDER.UPDATE_EXPENSE}/${initialData.id}`,
          payload,
        );
      } else {
        res = await postRequest(PROVIDER.ADD_EXPENSE, payload);
      }

      if (res.status === 201 || res.status === 200) {
        toast.success(isEdit ? "Dépense mise à jour" : "Dépense ajoutée");
        fetchAll();
        setActive(false);
      }
    } catch (err: any) {
      toast.error("Failed: " + (err?.response?.data?.message || ""));
    }

    setLoading(false);
  };

  return (
    <div className="event-create">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <InputGroup
            label="Nom"
            placeholder="Nom (par ex., réservation du lieu)"
            inputProps={register("title")}
            error={errors.title}
          />
        </div>

        <div>
          <CustomSelect
            label="Catégorie"
            name="categoryId"
            options={categories}
            value={selectedCategory}
            placeholder="Sélectionner la catégorie"
            onChange={(option: any) => {
              setSelectedCategory(option);
              setValue("categoryId", option?.value || "", {
                shouldValidate: true,
              });
            }}
            error={errors.categoryId?.message}
          />
        </div>

        <div>
          <InputGroup
            type="number"
            label="Coût estimé"
            placeholder="coût estimé"
            inputProps={{
              ...register("amount", { valueAsNumber: true }),
              step: "0.01",
            }}
            error={errors.amount}
          />
        </div>
        <div>
          <InputGroup
            type="number"
            label="Coût réel"
            placeholder="coût réel"
            inputProps={{
              ...register("used_amount", { valueAsNumber: true }),
              step: "0.01",
            }}
            error={errors.used_amount}
          />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("markPaid")} />
          <span className="text-sm dark:text-neutral-300">
            Marquer comme payé
          </span>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          variant="primary"
          size="medium"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enregistrement
              en cours...
            </>
          ) : isEdit ? (
            "Mettre à jour la dépense"
          ) : (
            "Enregistrer la dépense"
          )}
        </Button>
      </form>
    </div>
  );
}

export default AddExpenseForm;
