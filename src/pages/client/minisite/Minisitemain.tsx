import {
  Eye,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import InputGroup from "../../../components/ui-main/InputGroup";
import Button from "../../../components/ui/Button";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRequest,
  postRequest,
  patchRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import { useToast } from "../../../utils/toast";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../../../utils/uploadfile";
import Autocomplete from "react-google-autocomplete";
import { Controller } from "react-hook-form";
import CustomDatePicker from "../../../components/DatePicker";
const GOOGLE_API_KEY = import.meta.env.VITE_PLACE_API;

interface ProgramStep {
  time: Date | null;
  stage: string;
}

interface FormValues {
  siteTitle: string;
  message: string;
  siteAddress: string;
  address: string;
  link: string;
  moneyPoolLink: string;
  program: ProgramStep[];
}

const schema = yup.object().shape({
  siteTitle: yup.string().required("Le titre du site est obligatoire"),
  message: yup
    .string()
    .required("Le message est obligatoire")
    .max(500, "Le message ne peut pas dépasser 500 caractères"),

  moneyPoolLink: yup.string(),
  siteAddress: yup
    .string()
    .required("L’adresse du site web est obligatoire")
    .matches(/^[a-zA-Z0-9-_]+$/, "Aucun espace ni caractère spécial autorisé"),
  address: yup.string().required("L’adresse est obligatoire"),
  link: yup.string(),
  program: yup
    .array()
    .of(
      yup.object().shape({
        time: yup.date().nullable().required("L’heure est obligatoire"),
        stage: yup.string().required("Le nom de l’étape est obligatoire"),
      })
    )
    .min(1, "Au moins une étape du programme est requise"),
});
const timeStringToDate = (time?: string) => {
  if (!time) return null;

  const today = new Date();
  const parsed = new Date(`${today.toDateString()} ${time}`);

  return isNaN(parsed.getTime()) ? null : parsed;
};

const MiniSiteMain = () => {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [siteData, setSiteData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverImageKey, setCoverImageKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [checkingName, setCheckingName] = useState(false);
  const [isNameAvailable, setIsNameAvailable] = useState<boolean | null>(null);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [locationText, setLocationText] = useState("");
  const [isSavingGuestbook, setIsSavingGuestbook] = useState(false);

  const previewUrlRef = useRef<string | null>(null);
  const inputRef = useRef<any>(null);

  const [toggles, setToggles] = useState({
    publish: false,
    guestbook: false,
    gallery: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      siteTitle: "",
      message: "",
      siteAddress: "",
      address: "",
      link: "",
      program: [{ time: null, stage: "" }],
    },
  });

  const checkSiteNameAvailability = async (name: string) => {
    const cleaned = name.trim().toLowerCase();
    if (!cleaned) return;

    if (siteData?.name && siteData.name.toLowerCase() === cleaned) {
      setIsNameAvailable(true);
      return;
    }

    setCheckingName(true);
    try {
      const res = await getRequest(`${PROVIDER.SITE_CHECK}?name=${cleaned}`);
      const available = res?.data?.data?.available ?? false;
      setIsNameAvailable(available);
      if (!available) {
        toast.error("Le nom du site existe déjà, veuillez en choisir un autre");
      }
    } catch {
      setIsNameAvailable(false);
      toast.error("Échec de la vérification du nom du site");
    } finally {
      setCheckingName(false);
    }
  };
  const saveSettings = async (updatedSettings: {
    publish: boolean;
    guestbook: boolean;
    gallery: boolean;
  }) => {
    const payload = {
      eventId: Number(id),
      pageData: {
        ...siteData.version.pageData,
        settings: {
          ...updatedSettings,
          eventId: Number(id),
        },
      },
      action: "save",
    };

    await patchRequest(`${PROVIDER.SITE}`, payload);
  };

  const handleToggle = async (key: keyof typeof toggles) => {
    if (key === "publish") {
      try {
        setIsPublishing(true);

        await patchRequest(`${PROVIDER.SITE}`, {
          eventId: Number(id),
          action: "save",
          pageData: {
            ...siteData.version.pageData,
            settings: {
              ...siteData.version.pageData.settings,
              publish: true,
              eventId: Number(id),
            },
          },
        });

        await patchRequest(`${PROVIDER.SITE}`, {
          eventId: Number(id),
          action: "publish",
        });

        toast.success("Site publié avec succès");

        await fetchSite();
      } catch {
        toast.error("Échec de la publication du site");
      } finally {
        setIsPublishing(false);
      }

      return;
    }

    if (key === "guestbook") {
      const newValue = !toggles.guestbook;
      setToggles((prev) => ({ ...prev, guestbook: newValue }));

      try {
        setIsSavingGuestbook(true);
        await patchRequest(`${PROVIDER.SITE}`, {
          eventId: Number(id),
          action: "publish",
        });

        await saveSettings({
          publish: true,
          guestbook: newValue,
          gallery: toggles.gallery,
        });

        toast.success(
          newValue ? "Guestbook activated" : "Guestbook deactivated"
        );

        await fetchSite();
      } catch {
        toast.error("Échec de la mise à jour du livre d’or");
        setToggles((prev) => ({ ...prev, guestbook: !newValue }));
      } finally {
        setIsSavingGuestbook(false);
      }
    }
  };

  const addProgramStep = () => {
    const program = watch("program");
    setValue("program", [...program, { time: null, stage: "" }]);
  };

  const removeProgramStep = (index: number) => {
    const program = watch("program");
    if (program.length === 1) return toast.error("Au moins une étape est requise");
    setValue(
      "program",
      program.filter((_, i) => i !== index)
    );
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    try {
      setUploading(true);
      const previewUrl = URL.createObjectURL(file);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = previewUrl;
      setCoverImage(previewUrl);

      const result = await uploadFile(file);
      setCoverImage(result.url);
      setCoverImageKey(result.file);
      toast.success("Image de couverture téléversée avec succès");
    } catch {
      toast.error("Échec du téléversement de l’image");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const fetchSite = async () => {
    try {
      setLoading(true);
      const res = await getRequest(`${PROVIDER.SITE}?eventId=${id}`);
      const data = res?.data?.data?.[0] ?? null;
      if (data) {
        setSiteData(data);
        const version = data.version;
        const page = version?.pageData;

        let aboutContent =
          page?.sections?.find((s) => s.type === "about")?.content || "";
        let parsedAddress = "";
        try {
          const obj = JSON.parse(aboutContent);
          parsedAddress = obj?.address || "";
        } catch {
          parsedAddress = aboutContent || "";
        }
        const programFromApi =
          page?.sections?.find((s) => s.type === "program")?.content || [];

        reset({
          siteTitle: page?.title || "",
          message:
            page?.sections?.find((s) => s.type === "hero")?.content || "",
          siteAddress: data.name || "",
          address: parsedAddress,
          moneyPoolLink: page?.moneyPoolLink || "",
          link: page?.link || "",
          program: programFromApi.length
            ? programFromApi.map((p: any) => ({
                stage: p.stage || "",
                time: timeStringToDate(p.time), // ✅ FIX HERE
              }))
            : [{ time: null, stage: "" }],
        });

        setCoverImage(page?.coverImage || null);
        setCoverImageKey(page?.coverImageKey || null);
        setToggles({
          publish: page?.settings?.publish ?? false,
          guestbook: page?.settings?.guestbook || false,
          gallery: page?.settings?.gallery || false,
        });
        setLocationText(parsedAddress);
      } else {
        setSiteData(null);
        reset();
        setCoverImage(null);
        setCoverImageKey(null);
      }
    } catch {
      // toast.error("Failed to fetch site data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSite();
  }, [id]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const locationData = placeDetails
        ? {
            address: placeDetails.formatted_address,
            lat: placeDetails.geometry?.location?.lat(),
            lng: placeDetails.geometry?.location?.lng(),
          }
        : { address: values.address };

      const payload = {
        eventId: Number(id),
        name: values.siteAddress.trim().toLowerCase(),
        pageData: {
          title: values.siteTitle,
          link: values.link,
          moneyPoolLink: values.moneyPoolLink,
          coverImage: coverImage || "",
          coverImageKey: coverImageKey || "",
          settings: {
            publish: false,
            guestbook: toggles.guestbook,
            gallery: toggles.gallery,
            eventId: Number(id),
          },
          sections: [
            { type: "hero", content: values.message },
            { type: "about", content: JSON.stringify(locationData) },
            {
              type: "program",
              content: values.program.map((p) => ({
                ...p,
                time: p.time
                  ? new Date(p.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "",
              })),
            },
          ],
        },
        action: "save",
      };

      if (siteData) {
        await patchRequest(`${PROVIDER.SITE}`, payload);
        toast.success("Site mis à jour avec succès");
      } else {
        await postRequest(`${PROVIDER.SITE}`, payload);
        toast.success("Site créé avec succès");
      }
      setToggles((prev) => ({
        ...prev,
        publish: false,
      }));
      fetchSite();
    } catch {
      toast.error("Échec de l’enregistrement du site");
    } finally {
      setIsSubmitting(false);
    }
  };
  const removeCoverImage = () => {
    setCoverImage(null);
    setCoverImageKey(null);
  };
  return (
    <>
      <div className="mb-6 space-y-4">
        <Button
          variant="outline"
          size="small"
          type="button"
          onClick={() => navigate(-1)}
          data-no-translate
          className="gap-2 mb-3"
        >
          Retour 
        </Button>
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">Mini-Site</h1>

        <p className="text-gray-600 dark:text-neutral-300">
          Personnalisez le site web de votre événement
        </p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={120} borderRadius={12} />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-10">
            {/* LEFT */}
            <div className="space-y-6">
              {/* General Info */}
              <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                <span className="text-xl heading-font font-semibold capitalize mb-4 block dark:text-neutral-300">
                 Informations générales
                </span>
                 
                <div>
                <InputGroup
                  type="text"
                  label="Titre du site"
                  placeholder="Titre du site (ex. : Mariage de Marie & Thomas)"
                  inputProps={register("siteTitle")}
                  error={errors.siteTitle}
                />
                </div> 
<div>
                <InputGroup
                  type="textarea"
                  label="Message"
                  placeholder="Message de bienvenue"
                  inputProps={register("message")}
                  error={errors.message}
                />
                </div>

                <div>
                <InputGroup
                  type="text"
                  label="Lien de la cagnotte"
                  placeholder="Saisir l’URL"
                  inputProps={register("moneyPoolLink")}
                  error={errors.moneyPoolLink}
                />
                </div>

                {/* Website address with live check + icons */}
                <div className="relative">
                  <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                    Adresse de votre site web
                  </label>
                  <div className="relative">
                    <span className="w-[120px] absolute rounded-l-lg top-1/2 -translate-y-1/2 h-[48px] left-[1px] content-center px-3 bg-gray-100 dark:bg-gray-800 text-gray-600">
                      we-event.eu/
                    </span>
                    <input
                      type="text"
                      {...register("siteAddress")}
                      placeholder="Votre URL personnalisée"
                      disabled={isNameAvailable === true}
                      onBlur={(e) => checkSiteNameAvailability(e.target.value)}
                      className={`w-full border rounded-lg pl-[140px] pr-10 py-3 focus:border-secondary outline-none text-sm sm:text-base ${
                        isNameAvailable === false
                          ? "border-red-500"
                          : isNameAvailable === true
                          ? "border-green-500"
                          : "border-inputborder"
                      }`}
                    />
                    {checkingName ? (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin w-5 h-5" />
                    ) : isNameAvailable === true ? (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                    ) : isNameAvailable === false ? (
                      <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
                    ) : null}
                  </div>
                  {errors.siteAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.siteAddress.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Program */}
              <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                <span className="text-xl heading-font font-semibold capitalize mb-4 block dark:text-neutral-300">
                 Programme de la journée
                </span>

                {watch("program").map((step, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row w-full gap-3"
                  >
                    <div className="w-full">
                      <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                        Heure
                      </label>

                      <Controller
                        control={control}
                        name={`program.${index}.time`}
                        render={({ field }) => (
                          <CustomDatePicker
                            selected={field.value}
                            onChange={field.onChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            placeholderText="Sélectionnez l’heure"
                          />
                        )}
                      />

                      {errors.program?.[index]?.time && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.program[index]?.time?.message as string}
                        </p>
                      )}
                    </div>

                    <div className="w-full">
                      <InputGroup
                        type="text"
                        label="Étape"
                        placeholder="Nom de l’étape (ex. : Cérémonie)"
                        inputProps={register(`program.${index}.stage` as const)}
                      />
                      {errors.program?.[index]?.stage && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.program[index]?.stage?.message as string}
                        </p>
                      )}
                    </div>

                    <div className="pt-0 sm:pt-9">
                      <button
                        type="button"
                        onClick={() => removeProgramStep(index)}
                        className="p-2 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="small"
                  type="button"
                  onClick={addProgramStep}
                >
                  <Plus size={16} /> Ajouter une étape
                </Button>
              </div>

              {/* Address (Google autocomplete only) */}
              <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                <span className="text-xl heading-font font-semibold capitalize mb-4 block dark:text-neutral-300">
                  Informations pratiques
                </span>

                <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                 Rechercher une adresse
                </label>
                <Autocomplete
                  apiKey={GOOGLE_API_KEY}
                  onPlaceSelected={(place) => {
                    setPlaceDetails(place || null);
                    const text = place?.formatted_address || place?.name || "";
                    setLocationText(text);
                    setValue("address", text);
                    // setValue("link", text);
                  }}
                  value={locationText}
                  onChange={(e) => {
                    setLocationText(e.target.value);
                    setPlaceDetails(null);
                    setValue("address", e.target.value);
                  }}
                  ref={inputRef}
                  className="bg-white w-full py-3 text-sm sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder rounded-lg focus:border-secondary px-3"
                  placeholder="Search for location"
                />

                <InputGroup
                  type="text"
                  label="Lien"
                  placeholder="Lien vers la liste de Mariage"
                  inputProps={register("link")}
                  error={errors.link}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                <span className="text-xl heading-font font-semibold capitalize mb-3 block dark:text-neutral-300">
                  Paramètres
                </span>

                {(["publish", "guestbook"] as const).map((key) => {
                  if (key === "publish" && !siteData) return null;
                  return (
                    <div
                      key={key}
                      className="flex justify-between items-center gap-3 dark:text-neutral-300"
                    >
                      <span className="capitalize">
                        {key === "publish"
                          ? "Publier le site"
                          : "Activer le livre d’or"}
                      </span>

                      <div
                        onClick={() =>
                          key === "publish"
                            ? !isPublishing && handleToggle("publish")
                            : handleToggle("guestbook")
                        }
                        className={`relative w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          toggles[key] ? "bg-green-500" : "bg-gray-300"
                        } ${
                          key === "publish" && isPublishing
                            ? "cursor-not-allowed opacity-70"
                            : ""
                        }`}
                      >
                        {(key === "publish" && isPublishing) ||
                        (key === "guestbook" && isSavingGuestbook) ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="text-white w-4 h-4 animate-spin" />
                          </div>
                        ) : (
                          <span
                            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                              toggles[key] ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}

                <Button
                  onClick={() =>
                    window.open(
                      `/client/mini-site/guest-book/${id}`,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  size="medium"
                  type="button"
                >
                  <Eye size={18} /> Voir le livre d’or
                </Button>
              </div>

              {/* Cover Image */}
              <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                <div className="mb-2">
                  <span className="text-xl heading-font font-semibold capitalize mb-2 block dark:text-neutral-300">
                   Image de couverture
                  </span>
                  <p className="text-sm text-gray-600 dark:text-neutral-400  mb-2">
                    Taille recommandée (1920 px × 600 px)
                  </p>
                  <p className="text-gray-600 dark:text-neutral-400 mb-4">
                    La première chose que vos invités verront.
                  </p>

                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${
                      isDragActive
                        ? "border-primary bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <UploadCloud className="h-6 w-6 mx-auto text-gray-500" />
                    <p className="text-gray-700 dark:text-neutral-400">
                      Glissez-déposez ou cliquez pour téléverser
                    </p>

                    {coverImage && (
                      <div className="relative mt-3 flex flex-col items-center">
                        <img
                          src={coverImage}
                          alt="preview"
                          className="h-32 w-32 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={removeCoverImage}
                          className="mt-2 text-red-500 text-sm hover:underline"
                        >
                          Supprimer l’image
                        </button>
                      </div>
                    )}
                  </div>

                  {uploading && (
                    <p className="text-gray-500 dark:text-neutral-300 text-sm text-center mt-2">
                      Téléversement de l’image…
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {siteData && (
              <Button
                onClick={() =>
                  window.open(
                    `/${siteData.name}?type=draft`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                variant="outline"
                size="medium"
                type="button"
              >
                <Eye size={18} /> Preview
              </Button>
            )}
            <Button size="medium" type="submit" disabled={isSubmitting}>
              <Save size={18} /> {siteData ? "Mettre à jour le site" : "Enregistrer le site"}
            </Button>
          </div>
          {siteData?.version?.pageData?.settings?.publish === false && (
            <p className="bg-green-300 p-2 w-full md:max-w-96 rounded px-3 text-sm">
              Modifications enregistrées. Activez la publication pour les mettre en ligne.
            </p>
          )}
        </form>
      )}
    </>
  );
};

export default MiniSiteMain;
