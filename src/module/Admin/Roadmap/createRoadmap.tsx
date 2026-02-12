import { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import InputGroup from "../../../components/ui-main/InputGroup";
import CustomSelect from "../../../components/ui-main/selectBox";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomDatePicker from "../../../components/DatePicker";
import {
  patchRequest,
  postRequest,
} from "../../../utils/http-client/axiosClient";
import { ADMIN } from "../../../utils/endPoints";
import { useToast } from "../../../utils/toast";
import { X } from "lucide-react";

const developmentPhase = [
  { value: "ui/ux", label: "UI / UX" },
  { value: "integrations", label: "Intégrations" },
  { value: "mobile", label: "Mobile" },
  { value: "analytics", label: "Analytique" },
  { value: "security", label: "Sécurité" },
  { value: "performance", label: "Performance" },
  { value: "development", label: "Développement" },
  { value: "crm", label: "CRM" },
  { value: "customer-area", label: "Espace client" },
  { value: "quotes-invoicing", label: "Devis et facturation" },
  { value: "platform", label: "Plateforme" },
  { value: "gallery-media", label: "Galerie et médias" },
  { value: "recommendations", label: "Recommandations" },
  { value: "gamification", label: "Gamification" },
  { value: "logistics", label: "Logistique" },
  { value: "communication", label: "Communication" },
];


const mapstatus = [
  { value: "planned", label: "Planifié" },
  { value: "inprogress", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "on_hold", label: "En attente" },
  { value: "cancelled", label: "Annulé" },
];

const priority = [
  { value: "low", label: "Faible" },
  { value: "medium", label: "Moyen" },
  { value: "high", label: "Élevé" },
  { value: "urgent", label: "Critique" },
];

const phase = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "13", label: "13" },

];

const schema = yup.object().shape({
  title: yup.string().required("Le titre est requis"),
  description: yup.string().required("La description est requise"),
  status: yup.object().nullable().required("Le statut est requis"),
  mapstatus: yup.object().nullable().required("Le statut de la roadmap est requis"),
  priority: yup.object().nullable().required("La priorité est requise"),
  date: yup.date().nullable().required("La date est requise"),
  phase: yup.object().nullable().required("La phase est requise"),
  progression: yup
    .number()
    .typeError("La progression doit être un nombre")
    .min(0, "Min 0%")
    .max(100, "Max 100%")
    .required("La progression est requise"),
  tags: yup.array().of(yup.string()).min(1, "Au moins un tag est requis"),
  visibleToPartner: yup.boolean(),
});

function CreateRoadmap({ fetchRoadmap, setActive, editData = null }) {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [btnLoading, setButtonLoading] = useState(false);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      status: null,
      mapstatus: null,
      priority: null,
      date: null,
      phase: null,
      progression: "",
      tags: [],
      visibleToPartner: true,
    },
  });

  useEffect(() => {
    if (editData) {
      let parsedTags = [];

      if (typeof editData.label === "string") {
        try {
          const parsed = JSON.parse(editData.label);
          if (Array.isArray(parsed)) parsedTags = parsed;
          else parsedTags = [editData.label];
        } catch {
          parsedTags = [editData.label];
        }
      } else if (Array.isArray(editData.label)) {
        parsedTags = editData.label;
      }

      const formattedData = {
        title: editData.title || "",
        description: editData.description || "",
        status:
          developmentPhase.find(
            (d) =>
              d.label.toLowerCase() === editData.category?.toLowerCase() ||
              d.value.toLowerCase() === editData.category?.toLowerCase()
          ) || null,
        mapstatus:
          mapstatus.find(
            (m) => m.value.toLowerCase() === editData.status?.toLowerCase()
          ) || null,
        priority:
          priority.find(
            (p) => p.value.toLowerCase() === editData.priority?.toLowerCase()
          ) || null,
        date: editData.dueDate ? new Date(editData.dueDate) : null,
        phase:
          phase.find(
            (p) => p.label.toLowerCase() === editData.phase?.toLowerCase()
          ) || null,
        progression: editData.progressRate || "",
        tags: parsedTags,
        visibleToPartner:
          typeof editData.visibleToPartner === "boolean"
            ? editData.visibleToPartner
            : true,
      };

      setTags(formattedData.tags);
      reset(formattedData);
    } else {
      reset({
        title: "",
        description: "",
        status: null,
        mapstatus: null,
        priority: null,
        date: null,
        phase: null,
        progression: "",
        tags: [],
        visibleToPartner: true,
      });
      setTags([]);
    }
  }, [editData, reset]);
  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const onSubmit = async (data) => {
    setButtonLoading(true);

    const payload = {
      title: data.title,
      description: data.description,
      category: data.status?.label || "",
      label: JSON.stringify(data.tags) || [],
      phase: data.phase?.label || "",
      progressRate: Number(data.progression),
      status: data.mapstatus?.value || "",
      priority: data.priority?.value || "",
      dueDate: data.date ? new Date(data.date).toISOString() : null,
      visibleToPartner: data.visibleToPartner ?? true,
      tags: data.tags || [],
    };

    try {
      let res;
      if (editData?.id) {
        res = await patchRequest(`${ADMIN.ROADMAP}/${editData.id}`, payload);
        if (res?.status === 200) {
          toast.success("La roadmap a été mise à jour avec succès");
          fetchRoadmap();
          setActive(false);
          setTags([]);
          reset();
        }
      } else {
        res = await postRequest(ADMIN.ROADMAP, payload);
        if (res?.status === 201) {
          toast.success("La roadmap a été créée avec succès");
          fetchRoadmap();
          setActive(false);
          setTags([]);
          reset();
        }
      }
    } catch (error) {
      toast.error("Erreur lors de l’enregistrement de la roadmap, veuillez réessayer");
      console.error("Error creating roadmap:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="w-full">
          <InputGroup
            label="Title"
            placeholder="Saisir le titre"
            type="text"
            error={errors.title}
            inputProps={register("title")}
          />
        </div>
        <div className="w-full">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="Statut"
                options={developmentPhase}
                value={field.value}
                onChange={field.onChange}
                placeholder="Sélectionner le statut"
                className="w-full min-w-60"
                error={errors.status?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Description */}
      <div>
      <InputGroup
        label="Description"
        placeholder="Saisir la description"
        type="textarea"
        error={errors.description}
        inputProps={register("description")}
      />
      </div>

      {/* Status + Priority + Date */}
      <div className="flex flex-col md:flex-row gap-3">
        <Controller
          name="mapstatus"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label="Statut de la feuille de route"
              options={mapstatus}
              value={field.value}
              onChange={field.onChange}
              placeholder="Sélectionner un statut"
              className="w-full"
              error={errors.mapstatus?.message}
            />
          )}
        />
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label="Priorité"
              options={priority}
              value={field.value}
              onChange={field.onChange}
              placeholder="Sélectionner une priorité"
              className="w-full"
              error={errors.priority?.message}
            />
          )}
        />
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <div className="w-full">
              <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Sélectionner une date
              </label>
              <CustomDatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                placeholderText="Sélectionner une date"
                className="w-full"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Phase + Progression */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="w-full">
          <Controller
            name="phase"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="Phase"
                options={phase}
                value={field.value}
                onChange={field.onChange}
                placeholder="Sélectionner une phase"
                className="w-full"
                error={errors.phase?.message}
              />
            )}
          />
        </div>
        <div className="w-full">
          <InputGroup
            label="Progression (%)"
            placeholder="0"
            type="text"
            error={errors.progression}
            inputProps={register("progression")}
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
          Étiquettes
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Ajouter une étiquette"
            className={`w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border dark:border-neutral-700 bg-inputbg rounded-lg focus:border-secondary dark:bg-neutral-800 dark:text-neutral-300 ${
              errors.tags ? "border-red-500" : "border-inputborder"
            }`}
          />
          <Button
            type="button"
            variant="primary"
            size="medium"
            onClick={handleAddTag}
          >
            Ajouter
          </Button>
        </div>
        {errors.tags && (
          <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2"
            >
              {tag}
              <button
              aria-label="remove tags"
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="text-red-500 font-bold"
              >
                <X />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Visible to partner */}
      <div className="flex items-center gap-2">
        <Controller
          name="visibleToPartner"
          control={control}
          render={({ field }) => (
            <>
              <input
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <span className="text-sm dark:text-neutral-300">
              Visible pour les prestataires
              </span>
            </>
          )}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-3 mt-8">
        <Button
          type="button"
          variant="outline"
          size="large"
          className="w-full"
          onClick={() => {
            setActive(false);
            setTags([]);
            reset();
          }}
        >
          Annuler
        </Button>
        <Button
          loading={btnLoading}
          type="submit"
          variant="primary"
          size="large"
          className="w-full"
        >
          {editData ? "Mettre à jour" : "Envoyer"}
        </Button>
      </div>
    </form>
  );
}

export default CreateRoadmap;
