import { useEffect, useRef, useState } from "react";
import OuterModal from "../../components/Custommodal/OuterModal";
import InputGroup from "../../components/ui-main/InputGroup";
import CustomSelect from "../../components/ui-main/selectBox";
import Button from "../../components/ui/Button";
import CustomDatePicker from "../../components/DatePicker";
import { PROVIDER, ADMIN } from "../../utils/endPoints";
import { getRequest, postRequest } from "../../utils/http-client/axiosClient";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Funnel, List, Share2, User, X } from "lucide-react";
import { useToast } from "../../utils/toast";

const schema = yup.object({
  clientName: yup.string().required("Le nom est requis"),
  clientEmail: yup.string().email().required("L’adresse e-mail est requise"),
  shareType: yup.string().required(),
  consent: yup.boolean().oneOf([true], "Consent required"),
});

const RecommendationModal = ({ active, setActive }: any) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [priorityValue, setPriorityValue] = useState<any>(null); // CATEGORY
  const searchRef = useRef<any>(null);
  const partnerRef = useRef<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [providerLoading, setProviderLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      shareType: "single_partner",
    },
  });

  const mode = watch("shareType");

  // ---------- CONTACT SEARCH ----------
  const fetchContacts = async (q = "") => {
    if (!q) return setContacts([]);
    const res = await getRequest(`${PROVIDER.GET_CONTACTS}?search=${q}`);
    setContacts(res?.data?.data?.records || []);
  };

  // ---------- PROVIDERS ----------
  const fetchProviders = async (q = "") => {
    setProviderLoading(true);

    const res = await getRequest(`${ADMIN.USERS}?role=partner&search=${q}`);

    const fetched = (res?.data?.data?.data || []).map((p: any) => ({
      label: `${p.firstName} ${p.lastName} (${p.email})`,
      value: p.id,
    }));

    setProviders((prev) => {
      if (
        selectedProvider &&
        !fetched.find((p) => p.value === selectedProvider.value)
      ) {
        return [selectedProvider, ...fetched];
      }
      return fetched;
    });

    setProviderLoading(false);
  };

  // ---------- LIST ----------
  const fetchLists = async () => {
    const res = await getRequest(PROVIDER.RECOMENDATION_LIST);
    setLists(
      (res?.data?.data?.list || []).map((l: any) => ({
        label: l.name,
        value: l.id,
        items: l.items,
      }))
    );
  };

  const fetchCategories = async () => {
    const res = await getRequest(PROVIDER.GET_ALL_SERVICES);
    setCategories(
      (res?.data?.data?.services || []).map((s: any) => ({
        label: s.name,
        value: s.id,
      }))
    );
  };

  useEffect(() => {
    if (!active) return;
    fetchProviders();
    fetchLists();
    fetchCategories();
    setSelectedProvider(null);
  }, [active]);

  const onSelectContact = (c: any) => {
    setValue("clientName", c.name);
    setValue("clientEmail", c.email);
    setValue("clientPhone", c.phone || "");
    setValue("budget", c.budget || "");
    setValue("eventDate", c.eventDate ? new Date(c.eventDate) : null);
    setValue("description", c.note || "");
    setContacts([]);
  };

  // ---------- SUBMIT ----------
  const toast = useToast();

  const submit = async (data: any) => {
    setBtnLoading(true);
    try {
      const payload: any = {
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone || "",
        budget: Number(data.budget) || null,
        eventDate: data.eventDate || null,
        description: data.description || "",
        note: data.description || "",
        shareType: data.shareType,
      };

      if (data.shareType === "single_partner") {
        payload.partnerList = [Number(data.targetProvider?.value)];
      }

      if (data.shareType === "by_list") {
        payload.partnerList = data.selectedList?.items.map(Number) || [];
      }

      if (data.shareType === "by_category") {
        // payload.partnerList = [Number(data.targetProvider?.value)];
        payload.serviceCategoryId = Number(data.serviceCategory?.value);
        payload.radius = Number(data.radius || 0);
      }

      await postRequest(PROVIDER.RECOMENDATION_SEND, payload);
      reset();
      setActive(false);
      toast.success(
        "Recommandation envoyée",
        "Votre recommandation a été envoyée avec succès."
      );
    } catch (error: any) {
      console.error("SEND RECOMMENDATION ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Une erreur est survenue. Veuillez réessayer.";

      toast.error("Échec de l’envoi de la recommandation", message);
    }
    setBtnLoading(false);
  };

  return (
    <OuterModal active={active} setActive={setActive}>
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#1E1E1E] p-5 md:p-8 rounded-xl shadow-lg mt-10 relative">
        <X
          className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
          onClick={() => setActive(false)}
        />

        <div className="mb-6 space-y-4">
          <h2 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
            Recommandation de nouveau partenaire
          </h2>
          <p className="text-gray-600 dark:text-neutral-300">Recommander un client à un collègue</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit(submit)}>
          <div className="border-b border-gray-200 dark:border-neutral-700 pb-1 mb-4">
            <span className="text-lg heading-font font-semibold capitalize dark:text-neutral-100 flex gap-2">
              <User size={20} />
              Informations client
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {/* CONTACT SEARCH */}
            <div className="flex-1">
              <InputGroup
                label="Rechercher un contact existant"
                placeholder="Rechercher dans mes contacts"
                onChange={(e) => {
                  clearTimeout(searchRef.current);
                  const v = e.target.value;
                  searchRef.current = setTimeout(() => fetchContacts(v), 400);
                }}
              />

              {contacts.length > 0 && (
                <div className="border rounded bg-white mt-2">
                  {contacts.map((c) => (
                    <div
                      key={c.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => onSelectContact(c)}
                    >
                      {c.name} — {c.email}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => (
                    <InputGroup
                      label="Nom du client *"
                      placeholder="Saisir le nom du client"
                      inputProps={{ ...field }}
                      error={errors.clientName}
                    />
                  )}
                />
              </div>
              <div className="flex-1">
                <div>
                  <Controller
                    name="clientEmail"
                    control={control}
                    render={({ field }) => (
                      <InputGroup
                        label="Courriel du client *"
                        placeholder="Saisir l’E-mail du client"
                        type="email"
                        inputProps={{ ...field }}
                        error={errors.clientEmail}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Controller
                  name="clientPhone"
                  control={control}
                  render={({ field }) => (
                    <InputGroup
                      label="Téléphone du client"
                      placeholder="Saisir le téléphone du client"
                      inputProps={{ ...field }}
                    />
                  )}
                />
              </div>

              <div className="flex-1">
                <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                 Date de l'événement
                </label>
                <Controller
                  name="eventDate"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                    placeholderText="Sélectionner une date"
                      selected={field.value}
                      onChange={field.onChange}
                      className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex-1">
              <Controller
                name="budget"
                control={control}
                render={({ field }) => (
                  <InputGroup
                    label="Budget (€)"
                    placeholder="Saisir le budget"
                    type="number"
                    inputProps={{ ...field }}
                  />
                )}
              />
            </div>

            <div className="flex-1">
              {" "}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <InputGroup
                    label="Détails de la demande"
                    placeholder="Décrivez les besoins du client…"
                    type="textarea"
                    inputProps={{ ...field }}
                  />
                )}
              />
            </div>

            {/* MODE */}
            <div className="border-b border-gray-200 dark:border-neutral-700 pb-1">
              <span className="text-lg heading-font font-semibold capitalize dark:text-neutral-100 flex gap-2">
                <Share2 size={20} />
                Mode de recommandation
              </span>
            </div>
            <Controller
              name="shareType"
              control={control}
              render={({ field }) => (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input
                        {...field}
                        type="radio"
                        value="single_partner"
                        id="single-provider"
                        className="peer hidden"
                      />
                      <label
                        htmlFor="single-provider"
                        className="h-full flex flex-col items-center gap-1 border border-inputborder dark:border-neutral-700 py-4 px-3 rounded-lg text-sm cursor-pointer capitalize text-center
     transition-all duration-300 peer-checked:bg-secondary peer-checked:text-white dark:text-neutral-300"
                      >
                        <span>
                          <User />
                        </span>
                        <span className="text-sm">Fournisseur de services unique</span>
                        <span className="text-xs">
                          Recommander à un prestataire de services spécifique
                        </span>
                      </label>
                    </div>

                    <div>
                      <input
                        {...field}
                        type="radio"
                        value="by_category"
                        id="category"
                        className="peer hidden"
                      />
                      <label
                        htmlFor="category"
                        className="h-full flex flex-col items-center gap-1 border border-inputborder dark:border-neutral-700 py-4 px-3 rounded-lg text-sm cursor-pointer capitalize text-center
     transition-all duration-300 peer-checked:bg-secondary peer-checked:text-white dark:text-neutral-300"
                      >
                        <span>
                          <Funnel />
                        </span>
                        <span className="text-sm">Catégorie + Zone</span>
                        <span className="text-xs">
                          Ciblage par profession et par lieu
                        </span>
                      </label>
                    </div>

                    <div>
                      <input
                        {...field}
                        type="radio"
                        value="by_list"
                        id="favorites"
                        className="peer hidden"
                      />
                      <label
                        htmlFor="favorites"
                        className="h-full flex flex-col items-center gap-1 border border-inputborder dark:border-neutral-700 py-4 px-3 rounded-lg text-sm cursor-pointer capitalize text-center
     transition-all duration-300 peer-checked:bg-secondary peer-checked:text-white dark:text-neutral-300"
                      >
                        <span>
                          <List />
                        </span>
                        <span className="text-sm">Ma liste</span>
                        <span className="text-xs">Utilisez une liste personnalisée</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            />

            {/* CATEGORY MODE */}

            {mode === "by_category" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Controller
                    name="serviceCategory"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        label="Catégorie"
                        placeholder="Sélectionner"
                        options={categories}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="radius"
                    control={control}
                    render={({ field }) => (
                      <InputGroup
                        label="Distance max. (km)"
                        placeholder="50"
                        type="number"
                        inputProps={{ ...field }}
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {/* SINGLE PROVIDER MODE */}
            {mode === "single_partner" && (
              <Controller
                name="targetProvider"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Prestataire cible"
                    isLoading={providerLoading}
                    placeholder="Rechercher un prestataire…"
                    options={providers}
                    value={selectedProvider || null}
                    onChange={(val) => {
                      setSelectedProvider(val);
                      field.onChange(val);
                    }}
                    onInputChange={(value, { action }) => {
                      if (action !== "input-change") return;

                      clearTimeout(partnerRef.current);
                      partnerRef.current = setTimeout(() => {
                        fetchProviders(value);
                      }, 400);
                    }}
                  />
                )}
              />
            )}

            {/* LIST */}
            {mode === "by_list" && (
              <Controller
                name="selectedList"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Sélectionner une liste"
                    placeholder="Sélectionner"
                    options={lists}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            )}

            {/* GDPR */}
            <div className="flex items-start gap-2">
              <Controller
                name="consent"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    {...field}
                    checked={field.value || false}
                  />
                )}
              />
              <label className="text-sm dark:text-neutral-300 leading-3.5">
                J'atteste avoir le consentement du client
              </label>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-between">
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={() => setActive(false)}
            >
              Annuler
            </Button>
            <Button
              loading={btnLoading}
              className="w-full"
              size="medium"
              type="submit"
            >
              Envoyer des recommandations
            </Button>
          </div>
        </form>
      </div>
    </OuterModal>
  );
};

export default RecommendationModal;
