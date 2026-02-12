import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "../components/ui/Button";
import CustomSelect from "../components/ui-main/selectBox";
import InputGroup from "../components/ui-main/InputGroup";

import { getRequest, postRequest } from "../utils/http-client/axiosClient";
import { PROVIDER } from "../utils/endPoints";
import { RESPONSE_CODE } from "../utils/constants";
import { useToast } from "../utils/toast";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
  eventId: yup.number().required("Veuillez sélectionner un événement"),
  message: yup.string().required("Le message est obligatoire"),
  partnerCategoryIds: yup
    .array()
    .of(yup.number())
    .min(1, "Veuillez sélectionner au moins une catégorie")
    .required(),
  budget: yup
    .number()
    .typeError("Le budget doit être un nombre")
    .positive("Le budget doit être positif")
    .required("Le budget est obligatoire"),
  customerAuthorized: yup
    .boolean()
    .oneOf([true], "Vous devez autoriser le partenaire")
    .required("Ce champ est obligatoire"),
});

function RequestForm({ setActive, events, profile }) {
  
  const { id: businessId } = useParams();
  const login = useSelector((state) => state?.login);
  const toast = useToast();
  
  const [loading, setLoading] = React.useState(false);
  const [budgetLoading, setBudgetLoading] = React.useState(false);
  const [budgetAmount, setBudgetAmount] = React.useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      eventId: "",
      partnerCategoryIds: [],
      message: "",
      budget: "",
      customerAuthorized: false,
    },
  });
  const categoryOptions =
    profile?.services?.map((s) => ({
      value: Number(s.serviceId),
      label: s.service?.name || s.serviceName || "Category",
    })) || [];

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      userId: Number(login?.user?.id),
      businessId: Number(businessId),
      eventId: Number(data.eventId),
      message: data.message,
      partnerCategoryIds: data.partnerCategoryIds,
      status: "pending",
      budget: Number(data.budget),
      customerAuthorized: data.customerAuthorized,
    };

    try {
      const response = await postRequest(`${PROVIDER.REQUEST_QUOTE}`, payload);

      if (response.status === RESPONSE_CODE[200]) {
        reset();
        toast.success("Devis envoyé avec succès");
        setActive(false);
      }
    } catch (error) {
      
      toast.error(
        `${error?.response?.data?.message}` || "Une erreur est survenue"
      );
    }
    setLoading(false);
  };
  const fetchCategoryBudget = async (
    eventId: number,
    categoryId: number,
    setValue: (name: "budget", value: number | string) => void
  ) => {
    try {
      if (!eventId || !categoryId) return;

      setBudgetLoading(true);

      const res = await getRequest(
        `${PROVIDER.CREATE_EVENT}/expense/category-budget/${eventId}/${categoryId}`
      );

      if (res?.data?.success) {
        const amount = res.data.data.amount;
        setBudgetAmount(amount);
        setValue("budget", amount);
      }
    } catch (error) {
      
      toast.error("Échec de la récupération du budget de la catégorie");
    } finally {
      setBudgetLoading(false);
    }
  };
  useEffect(() => {
    const eventId = control._formValues.eventId;
    const categories = control._formValues.partnerCategoryIds;

    if (eventId && categories?.length > 0) {
      fetchCategoryBudget(Number(eventId), Number(categories[0]), setValue);
    }
  }, [control._formValues.eventId]);
  
  return (
    <form className="space-y-6 mt-8" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Controller
          name="eventId"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label="Sélectionnez un événemen"
              placeholder="Choisissez votre événement"
              options={events?.map((e) => ({
                value: e.eventId,
                label: e.name,
              }))}
              value={
                events?.find((e) => e.eventId === field.value)
                  ? {
                      value: field.value,
                      label: events?.find((e) => e.eventId === field.value)
                        .name,
                    }
                  : null
              }
              onChange={(val) => field.onChange(val?.value)}
              error={errors.eventId?.message}
            />
          )}
        />
      </div>
      <div>
      <Controller
        name="partnerCategoryIds"
        control={control}
        render={({ field }) => (
          <CustomSelect
            label="Catégories"
            placeholder="Sélectionnez des catégories"
            isMulti
            options={categoryOptions}
            value={categoryOptions.filter((opt) =>
              field.value?.includes(opt.value)
            )}
            onChange={(selected) => {
              const values = Array.isArray(selected)
                ? selected.map((s) => s.value)
                : [];

              field.onChange(values);

              if (values.length > 0) {
                const selectedEventId = control._formValues.eventId;

                if (selectedEventId) {
                  fetchCategoryBudget(
                    Number(selectedEventId),
                    Number(values[0]),
                    setValue
                  );
                } else {
                  toast.error("Veuillez d’abord sélectionner un événement");
                  setBudgetAmount(null);
                  setValue("budget", "");
                }
              }
            }}
            error={errors.partnerCategoryIds?.message}
          />
        )}
      />
      </div>
      <div>
      <Controller
        name="budget"
        control={control}
        render={({ field }) => (
          <InputGroup
            label="Budget estimé"
            type="number"
            placeholder={
              budgetLoading ? "Récupération du budget..." : "Entrez votre budget"
            }
            inputProps={{
              ...field,
              disabled: budgetLoading,
            }}
            rightElement={
              budgetLoading ? (
                <span className="text-xs text-gray-500">Chargement...</span>
              ) : null
            }
            error={errors.budget}
          />
        )}
      />

      </div>

      <div>
      <Controller
        name="message"
        control={control}
        render={({ field }) => (
          <InputGroup
            label="Message"
            type="textarea"
            placeholder="Écrivez votre message"
            inputProps={{
              ...field,
              value: field.value || "",
              onChange: field.onChange,
            }}
            error={errors.message}
          />
        )}
      />
      </div>

      <div>

      <Controller
        name="customerAuthorized"
        control={control}
        render={({ field }) => (
          <>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="mt-1"
            />
            <label className="text-sm text-gray-700">
              J’autorise le partenaire à m’ajouter comme contact.
            </label>
          </div>
           {errors.customerAuthorized && (
        <p className="text-sm text-red-500 mt-1">
          {errors.customerAuthorized.message}
        </p>
      )}
      </>
        )}
      />
      </div>
      <div>

     
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between mt-10">
        <Button
          type="button"
          variant="outline"
          size="medium"
          className="flex-1"
          onClick={() => setActive(false)}
        >
          Annuler
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="medium"
          loading={loading}
          className="flex-1"
        >
          Envoyer la demande
        </Button>
      </div>
    </form>
  );
}

export default RequestForm;
