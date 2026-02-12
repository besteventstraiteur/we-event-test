// src/pages/Recommendations/CreateListModal.tsx

import { useEffect, useRef, useState } from "react";
import OuterModal from "../../components/Custommodal/OuterModal";
import InputGroup from "../../components/ui-main/InputGroup";
import Button from "../../components/ui/Button";
import CustomSelect from "../../components/ui-main/selectBox";
import Skeleton from "react-loading-skeleton";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ADMIN, PROVIDER } from "../../utils/endPoints";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { X } from "lucide-react";

const schema = yup.object({
  name: yup.string().required("Le nom est obligatoire"),
  description: yup.string(),
  providers: yup.array().min(1, "Veuillez sélectionner au moins un partenaire"),
});

const CreateListModal = ({ active, setActive }: any) => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<any>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchPartners = async (search = "") => {
    const res = await getRequest(
      `${ADMIN.USERS}?role=partner&search=${search}`
    );
    setProviders(
      res?.data?.data?.data.map((p: any) => ({
        label: `${p.firstName} ${p.lastName}`,
        value: p.id,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    if (active) fetchPartners();
  }, [active]);

  const submit = async (data: any) => {
    await postRequest(PROVIDER.RECOMENDATION_CREATE_LIST, {
      name: data.name,
      description: data.description,
      providers: data.providers.map((p: any) => p.value),
    });
    reset();
    setActive(false);
  };

  return (
    <OuterModal active={active} setActive={setActive}>
      <div className="max-w-xl mx-auto bg-white dark:bg-[#1E1E1E] p-5 md:p-8 rounded-xl relative">
        <X
          className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
          onClick={() => setActive(false)}
        />
        <div className="mb-6 space-y-4">
          <h2 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
            Créez une liste de prestataires de services
          </h2>
          <p className="text-gray-600 dark:text-neutral-300">
            Créez une liste personnalisée pour recommander vos clients à vos
            partenaires privilégiés.
          </p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <div>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <InputGroup
                  {...field}
                  label="Nom de la liste"
                  error={errors.name?.message}
                  placeholder="Exemple : Mes photographes de confiance"
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="Description"
              control={control}
              render={({ field }) => (
                <InputGroup
                  {...field}
                  type="textarea"
                  label="Description"
                  placeholder="Décrivez l’objectif de cette liste…"
                />
              )}
            />
          </div>

          <div>
            {loading ? (
              <Skeleton height={50} />
            ) : (
              <Controller
                name="providers"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    isMulti
                    label="Prestataires"
                    placeholder="Sélectionner…"
                    options={providers}
                    error={errors.providers?.message}
                    onInputChange={(v) => {
                      clearTimeout(debounceRef.current);
                      debounceRef.current = setTimeout(
                        () => fetchPartners(v),
                        400
                      );
                    }}
                  />
                )}
              />
            )}
          </div>
          <div className="mt-10 flex justify-between flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setActive(false)}
              className="w-full"
            >
              Annuler
            </Button>
            <Button type="submit" className="w-full">
              Créer
            </Button>
          </div>
        </form>
      </div>
    </OuterModal>
  );
};

export default CreateListModal;
