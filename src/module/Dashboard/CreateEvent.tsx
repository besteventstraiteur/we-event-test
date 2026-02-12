import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import InputGroup from "../../components/ui-main/InputGroup";
import Button from "../../components/ui/Button";
import { Loader2, UploadCloud, X } from "lucide-react";
import Logo from "../../components/Logo";
import lightmode from "../../assets/images/Login-Screen.jpg";
import darkmode from "../../assets/images/dashboard-dark.jpg";
import CustomSelect from "../../components/ui-main/selectBox";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getRequest,
  postRequest,
  patchRequest,
} from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { uploadFile } from "../../utils/uploadfile";
import { useDropzone } from "react-dropzone";
import CustomDatePicker from "../../components/DatePicker";
import { useToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

interface Option {
  value: string;
  label: string;
}

type FormValues = {
  eventName: string;
  startDateTime: Date | null;
  endDateTime: Date | null;
  description: string;
  address: string;
  categoryName: string | null;
  budget: number | null;
  status: "active" | "inactive";
  thumbnail: File | string | null;
};

interface CreateEventProps {
  active: boolean;
  setActive: (v: boolean) => void;
  fetchAll: () => void;
  mode?: "create" | "edit";
  selectedEvent?: any;
  setMode?: (v: "create" | "edit") => void;
  setSelectedEvent?: (v: any) => void;
  canCreateEvent: () => boolean;
}

function CreateEvent({
  active,
  setActive,
  fetchAll,
  mode = "create",
  selectedEvent,
  setMode,
  setSelectedEvent,
  canCreateEvent,
  planModal,
  setPlanModal,
}: CreateEventProps) {
  const toast = useToast();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement | null>(null);

  // --- Yup schema ---
  const schema = useMemo(() =>
    yup.object().shape({
      eventName: yup.string().required("Le nom de l'événement est requis."),
      startDateTime: yup
        .date()
        .nullable()
        .required("La fecha/hora de inicio es obligatoria"),
      endDateTime: yup
        .date()
        .nullable()
        .required("Se requiere fecha y hora de finalización")
        .test("after-start", "End must be after start", function (end) {
          const { startDateTime } = this.parent as FormValues;
          if (!end || !startDateTime) return true;
          return end.getTime() > startDateTime.getTime();
        }),
      description: yup.string().required("Se requiere descripción"),
      address: yup.string().required("L’adresse est obligatoire"),
      budget: yup.string().required("Le budget est obligatoire"),
      categoryName: yup.string().required("La categoría es obligatoria"),
      status: yup
        .mixed<"active" | "inactive">()
        .oneOf(["active", "inactive"])
        .required(),
      thumbnail: yup.mixed<File | string | null>().nullable().notRequired(),
    }),
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      eventName: "",
      startDateTime: null,
      endDateTime: null,
      description: "",
      address: "",
      categoryName: null,
      status: "active",
      thumbnail: null,
    },
  });

  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await getRequest(`${PROVIDER.GET_ALL_CATEGORIES}`);
      const arr = res?.data?.data?.data ?? [];

      const options = arr.map((c: any) => ({
        value: c.name,
        label: c.name,
      }));

      // Add "Other" option
      options.push({ value: "other", label: "Other" });

      setCategoryOptions(options);
    } catch (e) {
      console.error("Category fetch failed:", e);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const selectedCategory = watch("categoryName");
  const showOtherInput = selectedCategory === "other";

  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    register("thumbnail");
  }, [register]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = url;

    setThumbPreview(url);
    setValue("thumbnail", file, { shouldValidate: true });
    clearErrors("thumbnail");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  // -------------------------------------------------------------------
  // Handle Edit Mode: Prefill Form
  // -------------------------------------------------------------------
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (mode === "edit" && selectedEvent?.eventId && active) {
        setLoadingEvent(true);
        try {
          const resp = await getRequest(
            `${PROVIDER.GET_EVENT_BY_ID}/${selectedEvent.eventId}`,
          );

          const payload = resp?.data?.data ?? null;
          if (payload) {
            const catName =
              typeof payload.category === "string"
                ? payload.category
                : (payload.category?.name ?? null);

            // If category not in dropdown, add dynamically
            if (catName && !categoryOptions.some((c) => c.value === catName)) {
              setCategoryOptions((prev) => [
                ...prev.filter((x) => x.value !== "other"),
                { value: catName, label: catName },
                { value: "other", label: "Other" },
              ]);
            }

            reset({
              eventName: payload.name || "",
              startDateTime: payload.startDateTime
                ? new Date(payload.startDateTime)
                : null,
              endDateTime: payload.endDateTime
                ? new Date(payload.endDateTime)
                : null,
              description: payload.description || "",
              address: payload.address || "",
              categoryName: catName || null,
              status: payload.status || "active",
              thumbnail: payload.thumbnail || null,
              budget: payload.stats?.total_budget ?? null,
            });

            setThumbPreview(payload.thumbnail || null);
          }
        } catch (err) {
          console.error("Failed to fetch event details:", err);
          toast.error("Échec de la récupération des détails de l’événement");
        } finally {
          setLoadingEvent(false);
        }
      }
    };

    fetchEvent();
  }, [mode, selectedEvent, active]);

  // -------------------------------------------------------------------
  // Close Modal
  // -------------------------------------------------------------------
  const handleClose = useCallback(() => {
    setActive(false);
    reset();
    setThumbPreview(null);
    if (setMode) setMode("create");
    if (setSelectedEvent) setSelectedEvent(null);
  }, []);

  // prevent modal to close outside

  // -------------------------------------------------------------------
  // Submit Form
  // -------------------------------------------------------------------
  const onSubmit = async (values: FormValues) => {
    try {
      if (mode === "create" && !canCreateEvent()) {
        setPlanModal(true);
        return;
      }

      let finalThumb: string | null = null;

      if (values.thumbnail && typeof values.thumbnail !== "string") {
        setUploading(true);
        const result = await uploadFile(values.thumbnail as File);
        finalThumb = result?.url ?? null;
        setUploading(false);
      } else {
        finalThumb = values.thumbnail as string;
      }

      // If "other", use typed input
      const finalCategoryName =
        values.categoryName === "other"
          ? watch("customCategory")
          : values.categoryName;

      const payload = {
        name: values.eventName,
        startDateTime: values.startDateTime?.toISOString(),
        endDateTime: values.endDateTime?.toISOString(),
        description: values.description,
        address: values.address,
        categoryName: finalCategoryName,
        status: values.status,
        thumbnail: finalThumb,
        budget: Number(values.budget),
      };

      if (mode === "edit" && selectedEvent) {
        await patchRequest(
          `${PROVIDER.UPDATE_EVENT}/${selectedEvent.eventId}`,
          payload,
        );
        toast.success("Événement mis à jour avec succès");
      } else {
        await postRequest(`${PROVIDER.CREATE_EVENT}`, payload);
        toast.success("Événement créé avec succès");
      }
      const params = new URLSearchParams(window.location.search);
      params.delete("create");
      const newUrl = `${window.location.pathname}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      window.history.replaceState(null, "", newUrl);

      fetchAll();
      handleClose();
    } catch (e) {
      console.error("Error saving event:", e);
      toast.error("Échec de l’enregistrement de l’événement");
    }
  };

  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "light",
  );
  console.log(errors, "ssds");

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto transition-all duration-300 ${
        active ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      style={{
        backgroundImage: `url(${theme === "light" ? lightmode : darkmode})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[calc(100%-16px)] md:max-w-4xl mx-auto my-10 p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] shadow-2xl"
      >
        <X
          className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
          onClick={handleClose}
        />

        <div className="container flex items-center justify-center mb-2">
          <Logo />
        </div>

        <div className="mb-6 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold text-center dark:text-neutral-100 capitalize">
            {mode === "edit" ? "Modifier l’événement" : "Créer un événement"}
          </h2>
          <p className="text-gray-600 dark:text-neutral-300 text-base text-center">
            {mode === "edit"
              ? "Mettez à jour les détails de votre événement"
              : "Complete los detalles de su evento"}
          </p>
        </div>

        {/* LOADING STATE */}
        {loadingEvent ? (
          <div className="text-center py-10 text-gray-600 dark:text-neutral-300">
            Loading event details...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 mt-10"
            noValidate
          >
            <div>
              {/* Event Name */}
              <InputGroup
                type="text"
                placeholder="Annual Tech Conference 2025"
                inputProps={register("eventName")}
                label="Nom de l'événement"
                error={errors.eventName}
              />
            </div>

            <div>
              {/* DATES */}
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Start */}
                <div className="flex-1">
                  <label className="block mb-2 font-medium text-mainclr dark:text-neutral-300">
                    Date/heure de début
                  </label>
                  <Controller
                    control={control}
                    name="startDateTime"
                    render={({ field: { value, onChange } }) => (
                      <CustomDatePicker
                        selected={value}
                        onChange={onChange}
                        showTimeSelect
                        placeholderText="Sélectionner la date/heure de début"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full px-3 py-3 border rounded-lg bg-inputbg dark:bg-inputdarkbg border-inputborder"
                      />
                    )}
                  />
                  {errors.startDateTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDateTime.message}
                    </p>
                  )}
                </div>

                {/* End */}
                <div className="flex-1">
                  <label className="block mb-2 font-medium text-mainclr dark:text-neutral-300">
                    Date/heure de fin
                  </label>
                  <Controller
                    control={control}
                    name="endDateTime"
                    render={({ field: { value, onChange } }) => (
                      <CustomDatePicker
                        selected={value}
                        onChange={onChange}
                        showTimeSelect
                        placeholderText="Sélectionner la date/heure de fin"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        minDate={watch("startDateTime") || new Date()}
                        className="w-full px-3 py-3 border rounded-lg bg-inputbg dark:bg-inputdarkbg border-inputborder"
                      />
                    )}
                  />
                  {errors.endDateTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDateTime.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              {/* DESCRIPTION */}
              <InputGroup
                type="textarea"
                label="Description"
                placeholder="Entrer la description"
                inputProps={register("description")}
                error={errors.description}
              />
            </div>

            <div>
              {/* BUDGET */}
              <InputGroup
                type="number"
                label="Budget (€)"
                placeholder="Enter event budget"
                inputProps={register("budget")}
                error={errors.budget}
              />
            </div>
            <div>
              {/* BUDGET */}
              <InputGroup
                type="text"
                label="Adresse"
                placeholder="Entrez l'adresse de l'événement"
                inputProps={register("address")}
                error={errors.address}
              />
            </div>
            <div>
              <Controller
                control={control}
                name="categoryName"
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    label="Catégorie"
                    options={categoryOptions}
                    isDisabled={loadingCategories}
                    value={
                      categoryOptions.find((o) => o.value === value) || null
                    }
                    onChange={(val) => onChange(val?.value ?? null)}
                    placeholder="Sélectionner une catégorie"
                    error={errors.categoryName?.message}
                  />
                )}
              />
            </div>

            <div>
              <span className="block mb-2 font-medium text-mainclr dark:text-neutral-300">
                Vignette
              </span>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${
                  isDragActive ? "border-primary bg-blue-50" : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                <UploadCloud className="h-6 w-6 mx-auto text-gray-500 dark:text-neutral-400" />
                <p className="text-gray-700 dark:text-neutral-400">
                  Faites glisser et déposez une image ici ou cliquez pour
                  sélectionner
                </p>
                {thumbPreview && (
                  <img
                    src={thumbPreview}
                    alt="preview"
                    className="h-24 w-24 object-cover mx-auto mt-3 rounded-md"
                  />
                )}
              </div>
              {errors.thumbnail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-between mt-10">
              <Button
                type="button"
                variant="outline"
                size="medium"
                className="flex-1"
                onClick={handleClose}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="medium"
                className="flex-1"
                disabled={isSubmitting || uploading}
              >
                {isSubmitting || uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Enregistrement…
                  </>
                ) : mode === "edit" ? (
                  "Mettre à jour"
                ) : (
                  "Sauvegarder"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateEvent;
