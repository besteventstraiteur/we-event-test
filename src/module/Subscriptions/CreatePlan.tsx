import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import InputGroup from "../../components/ui-main/InputGroup";
import Button from "../../components/ui/Button";
import CustomSelect from "../../components/ui-main/selectBox";
import { useToast } from "../../utils/toast";
import {
  getRequest,
  patchRequest,
  postRequest,
} from "../../utils/http-client/axiosClient";
import { ADMIN, PROVIDER } from "../../utils/endPoints";
import { Plus, Trash2 } from "lucide-react";

interface Option {
  label: string;
  value: number;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Le nom du plan est requis"),
  description: Yup.string(),
  isActive: Yup.boolean().default(true),
  features: Yup.object().required(),
  commitments: Yup.array().of(
    Yup.object().shape({
      durationMonths: Yup.number().required("La durée est requise"),
      isActive: Yup.boolean().default(true),
      paymentOptions: Yup.array().of(
        Yup.object().shape({
          paymentType: Yup.string().required("Le type de paiement est requis"),
          trialDays: Yup.number().min(0),
          extraDays: Yup.number().min(0),
          isActive: Yup.boolean().default(true),
          currencies: Yup.array().of(
            Yup.object().shape({
              currency: Yup.string().required("La devise est requise"),
              price: Yup.number().required("Le prix est requis"),
            }),
          ),
        }),
      ),
    }),
  ),
});

const paymentTypeOptions = [
  { label: "Mensuel", value: "monthly" },
  { label: "Paiement intégral", value: "full_upfront" },
];

// const currencyOptions = [
//   { label: "EUR", value: "eur" },
//   { label: "USD", value: "usd" },
// ];

const currencyOptions = [{ label: "EUR", value: "eur" }];

const fixedFeatures = {
  creation_of_showcase: "Création de vitrine",
  presence_on_the_platform: "Présence sur la plateforme",
  standard_visibility: "Visibilité standard",
  full_access_to_the_platform: "Accès complet à la plateforme",
  priority_visibility_in_searches: "Visibilité prioritaire dans les recherches",
  unlimited_customer_recommendations: "Recommandations clients illimitées",
  access_to_the_sponsorship_program: "Accès au programme de parrainage",
  badges_et_best_awards: "Badges et meilleurs prix",
  advanced_statistics: "Statistiques avancées",
  priority_support: "Support prioritaire",
};

const PARTNER_FEATURES = {
  sales_crm: "Gestion des ventes et de la relation client",
  messaging: "Messagerie et communication",
  calendar: "Calendrier et disponibilités",
  logistics: "Logistique",
  inventory: "Gestion des stocks",
  food_orders: "Commandes de repas (traiteurs)",
  accounting: "Comptabilité et trésorerie",
  dashboard_kpi: "Tableau de bord et indicateurs clés de performance (KPI)",
  event_sheets: "Fiches techniques de l'événement",
  multi_accounts: "Comptes multiples et rôles",
  api_webhooks: "API publique et webhooks",
  budgets_analytics: "Budgets et analyses",
  storefront: "Présence en magasin et en ligne",
  training: "Formation et communauté",
  community: "Système communautaire et de recommandation",
  gamification: "Gamification et reconnaissance",
  referral: "Programme de parrainage",
  profession_specific: "Caractéristiques propres à la profession",
  marketplace: "Marché",
  tasks: "Gestion des tâches et des listes de choses à faire",
  talkshow: "Talk-show et podcast",
  landing_pages: "Mini-site de la page d'accueil",
  commercial_ai: "IA commerciale avancée",
  hr: "RH – Pointage et personnel temporaire",
  webinars: "Webinaires",
  marketing: "Commercialisation",
  ticketing: "Billetterie en ligne",
};

const CLIENT_FEATURES = {
  analytics: "Analytique",
  max_events: "Nombre maximal d'événements : 50",
  priority_support: "Soutien prioritaire",
};

const normalizeFeatures = (
  subscriberType: "client" | "partner",
  apiFeatures: any,
) => {
  const SOURCE =
    subscriberType === "client" ? CLIENT_FEATURES : PARTNER_FEATURES;

  return Object.fromEntries(
    Object.entries(SOURCE).map(([key, label]) => {
      const found = Array.isArray(apiFeatures)
        ? apiFeatures.find((f: any) => f.key === key)
        : apiFeatures?.[key];

      return [
        key,
        {
          label,
          isActive: Boolean(
            Array.isArray(apiFeatures) ? found?.isActive : found,
          ),
        },
      ];
    }),
  );
};

const defaultValues = {
  name: "",
  description: "",
  isActive: true,
  features: Object.fromEntries(
    Object.entries(PARTNER_FEATURES).map(([key, label]) => [
      key,
      { isActive: false, label },
    ]),
  ),
  commitments: [
    {
      durationMonths: 12,
      isActive: true,
      paymentOptions: [
        {
          paymentType: "monthly",
          trialDays: 0,
          extraDays: 0,
          isActive: true,
          currencies: [{ currency: "eur", price: 0 }],
        },
      ],
    },
  ],
};

export default function CreatePlan({ setActive, fetchPlans, editData }) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    fields: commitmentFields,
    append: addCommitment,
    remove: removeCommitment,
  } = useFieldArray({ control, name: "commitments" });

  const handleSubscriberChange = (type: "client" | "partner") => {
    setSubscriberType(type);

    if (editData) return;

    setValue(
      "features",
      Object.fromEntries(
        Object.entries(
          type === "client" ? CLIENT_FEATURES : PARTNER_FEATURES,
        ).map(([key, label]) => [key, { label, isActive: false }]),
      ),
    );
  };

  const features = watch("features");
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [isGlobal, setIsGlobal] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState<Option[]>([]);
  const [selectedServices, setSelectedServices] = useState<Option[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [subscriberType, setSubscriberType] = useState<"client" | "partner">(
    "partner",
  );

  useEffect(() => {
    if (!editData) {
      reset(defaultValues);
      return;
    }

    setSubscriberType(editData.subscriberType);
    setIsGlobal(editData.isGlobal === true || editData.isGlobal === "true");

    const normalizedFeatures = normalizeFeatures(
      editData.subscriberType,
      editData.features,
    );

    reset({
      name: editData.name || "",
      description: editData.description || "",
      isActive: editData.isActive ?? true,
      features: normalizedFeatures,
      commitments:
        editData.commitments?.map((c) => ({
          durationMonths: c.durationMonths || 12,
          isActive: c.isActive ?? true,
          paymentOptions:
            c.payments?.map((p) => ({
              paymentType: p.paymentType || "monthly",
              trialDays: p.trialDays || 0,
              extraDays: p.extraDays || 0,
              isActive: p.isActive ?? true,
              currencies: [
                {
                  currency: "eur",
                  price: Number(p.currencies?.[0]?.price) || 0,
                },
              ],
            })) || [],
        })) || [],
    });
  }, [editData, reset]);

  useEffect(() => {
    if (editData) {
      const globalValue =
        editData.isGlobal === true || editData.isGlobal === "true";

      setIsGlobal(globalValue);

      if (globalValue) {
        setSelectedServices([]);
      }
    } else {
      setIsGlobal(false);
      setSelectedServices([]);
    }
  }, [editData]);

  useEffect(() => {
    if (
      editData &&
      !editData.isGlobal &&
      categoriesLoaded &&
      Array.isArray(editData.serviceIds)
    ) {
      const mapped = categoriesOptions.filter((opt) =>
        editData.serviceIds.some(
          (id: string | number) => Number(id) === Number(opt.value),
        ),
      );

      setSelectedServices(mapped);
    }
  }, [editData, categoriesLoaded, categoriesOptions]);
  const onSubmit = async (data) => {
    setLoading(true);
    let featuresPayload;

    if (subscriberType === "client") {
      featuresPayload = Object.entries(data.features).map(([key, value]) => ({
        key,
        label: value.label,
        isActive: value.isActive,
      }));
    } else {
      featuresPayload = Object.entries(data.features).map(([key, value]) => ({
        key,
        label: value.label,
        isActive: value.isActive,
      }));
    }

    const transformedFeatures = Object.entries(data.features).map(
      ([key, value]) => ({
        key,
        label: value.label,
        isActive: value.isActive,
      }),
    );

    const finalPayload = {
      ...data,
      subscriberType,
      features:
        subscriberType === "client"
          ? JSON.stringify(featuresPayload)
          : JSON.stringify(featuresPayload),
      serviceIds: isGlobal ? [] : selectedServices.map((s) => Number(s.value)),
      isGlobal: selectedServices?.length === 0 ? true : false,
      commitments: data.commitments.map((c) => ({
        durationMonths: c.durationMonths,
        isActive: c.isActive,
        paymentOptions: c.paymentOptions.map((p) => ({
          paymentType: p.paymentType,
          trialDays: p.trialDays,
          extraDays: p.extraDays,
          isActive: p.isActive,
          currencies: [
            {
              currency: "eur",
              price: p.currencies[0].price,
            },
          ],
        })),
      })),
    };

    try {
      let res;
      if (editData) {
        res = await patchRequest(
          `${ADMIN.CREATE_PLAN}/${editData.id}`,
          finalPayload,
        );
        if (res.status === 200 || res.status === 201) {
          toast.success("Forfait mis à jour avec succès");
        }
      } else {
        res = await postRequest(ADMIN.CREATE_PLAN, finalPayload);
        if (res.status === 201) {
          toast.success("Forfait créé avec succès");
        }
      }

      await fetchPlans();

      reset(defaultValues);

      setActive(false);
    } catch (error) {
      console.error("Error submitting plan:", error);
      toast.error("Échec de l’enregistrement du forfait, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getRequest(
          `${PROVIDER.GET_ALL_SERVICES}?page=1&limit=100`,
        );

        const services = res?.data?.data?.services || [];

        setCategoriesOptions(
          services.map((s: any) => ({
            value: s.id,
            label: s.name,
          })),
        );

        setCategoriesLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-0 dark:text-neutral-100">
          {editData
            ? "Modifier le forfait d’abonnement"
            : "Créer un forfait d’abonnement"}
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <InputGroup
            label="Nom du forfait"
            placeholder="Saisir le nom du forfait"
            error={errors.name}
            inputProps={register("name")}
          />
        </div>

        <div>
          <InputGroup
            label="Description"
            type="textarea"
            placeholder="Saisir la description"
            error={errors.description}
            inputProps={register("description")}
          />
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 dark:text-neutral-300">
            <input
              type="radio"
              checked={subscriberType === "partner"}
              onChange={() => handleSubscriberChange("partner")}
            />
            Forfait partenaire
          </label>

          <label className="flex items-center gap-2 dark:text-neutral-300">
            <input
              type="radio"
              checked={subscriberType === "client"}
              onChange={() => handleSubscriberChange("client")}
            />
            Forfait client
          </label>
        </div>
        {subscriberType === "partner" && (
          <>
            <div>
              <input
                type="checkbox"
                id="isGlobal"
                checked={isGlobal}
                onChange={(e) => {
                  setIsGlobal(e.target.checked);
                  if (e.target.checked) {
                    setSelectedServices([]);
                  }
                }}
                className="w-4 h-4 accent-secondary"
              />

              <label
                htmlFor="isGlobal"
                className=" ml-2 gap-2 text-sm font-medium dark:text-neutral-300"
              >
                Appliquer aux catégories sélectionnées
              </label>
            </div>
            <div>
              {!isGlobal && (
                <CustomSelect
                  label="Catégories"
                  name="serviceIds"
                  isMulti
                  options={categoriesOptions}
                  value={selectedServices}
                  onChange={(val) => setSelectedServices(val as Option[])}
                  placeholder="Sélectionner des services"
                />
              )}
            </div>
          </>
        )}

        <div>
          <label className="block mb-2 font-medium dark:text-neutral-300">
            Caractéristiques du plan
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(subscriberType === "partner"
              ? Object.entries(PARTNER_FEATURES)
              : Object.entries(CLIENT_FEATURES)
            ).map(([key, label]) => (
              <>
                <div className="relative group">
                  <input
                    id={key}
                    type="checkbox"
                    className="peer hidden"
                    checked={features?.[key]?.isActive || false}
                    onChange={(e) =>
                      setValue(`features.${key}.isActive`, e.target.checked)
                    }
                  />
                  <label
                    htmlFor={key}
                    key={key}
                    className="flex items-center gap-1 border border-borderlight px-2 py-3 rounded-lg text-sm cursor-pointer
           transition-all duration-300 peer-checked:bg-secondary peer-checked:text-white
           before:content-['✔'] before:inline-block before:text-white
           peer-checked:before:inline-block dark:text-neutral-300"
                  >
                    {label}
                  </label>
                </div>
              </>
            ))}
          </div>
        </div>

        <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
          Engagements
        </label>

        {commitmentFields.map((commitment, cIndex) => (
          <div
            key={commitment.id}
            className="border border-inputborder rounded-lg p-4"
          >
            <InputGroup
              label="Durée (mois)"
              type="number"
              error={errors.commitments?.[cIndex]?.durationMonths}
              inputProps={register(`commitments.${cIndex}.durationMonths`, {
                valueAsNumber: true,
              })}
            />

            <Controller
              name={`commitments.${cIndex}.paymentOptions`}
              control={control}
              render={({ field }) => (
                <div className="mt-4">
                  {field.value.map((payment, pIndex) => (
                    <div key={pIndex} className="mt-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="w-full">
                          <Controller
                            name={`commitments.${cIndex}.paymentOptions.${pIndex}.paymentType`}
                            control={control}
                            render={({ field: selectField }) => (
                              <CustomSelect
                                label="Type de paiement"
                                options={paymentTypeOptions}
                                value={paymentTypeOptions.find(
                                  (opt) => opt.value === selectField.value,
                                )}
                                onChange={(option) =>
                                  selectField.onChange(option?.value)
                                }
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        {currencyOptions.map((cur, curIndex) => (
                          <div className="w-full" key={cur.value}>
                            <label className="block mb-1 font-medium dark:text-neutral-300">
                              Prix €
                            </label>
                            <input
                              type="number"
                              placeholder={`Enter ${cur.label} price`}
                              {...register(
                                `commitments.${cIndex}.paymentOptions.${pIndex}.currencies.${curIndex}.price`,
                                { valueAsNumber: true },
                              )}
                              className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder dark:border-neutral-700 bg-inputbg rounded-lg focus:border-secondary dark:bg-neutral-800 dark:text-neutral-300"
                            />
                            <input
                              type="hidden"
                              value={cur.value}
                              {...register(
                                `commitments.${cIndex}.paymentOptions.${pIndex}.currencies.${curIndex}.currency`,
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            />

            <Button
              type="button"
              variant="destructive"
              className="text-sm !p-0 mt-4 dark:text-neutral-300"
              onClick={() => removeCommitment(cIndex)}
            >
              <Trash2 size={16} /> Supprimer
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="small"
          onClick={() =>
            addCommitment({
              durationMonths: 12,
              isActive: true,
              paymentOptions: [
                {
                  paymentType: "monthly",
                  trialDays: 0,
                  extraDays: 0,
                  isActive: true,
                  currencies: [
                    { currency: "eur", price: 0 },
                    { currency: "usd", price: 0 },
                  ],
                },
              ],
            })
          }
        >
          <Plus size={18} /> Ajouter plus d’engagement
        </Button>

        <div className="pt-5">
          <Button
            loading={loading}
            type="submit"
            variant="primary"
            size="large"
            className="w-full"
          >
            {editData ? "Mettre à jour le forfait" : "Créer un forfait"}
          </Button>
        </div>
      </form>
    </>
  );
}
