import InputGroup from "../../components/ui-main/InputGroup";
import Button from "../../components/ui/Button";
import CustomSelect from "../../components/ui-main/selectBox";
import CustomDatePicker from "../../components/DatePicker";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";

interface CreateTaskProps {
  onSubmit: (values: any) => void;
  editMode?: boolean;
  initialData?: any;
}

const schema = yup.object().shape({
  title: yup.string().required("Le titre de la tâche est requis."),
  description: yup.string().required("Une description est requise."),
  date: yup.date().nullable().required("Veuillez sélectionner une date"),
  priority: yup.string().required("La priorité est obligatoire"),
});

const priorities = [
  { value: "low", label: "Faible" },
  { value: "average", label: "Normal" },
  { value: "high", label: "Élevée" },
];

function CreateTask({
  onSubmit,
  editMode,
  initialData,
  loading,
}: CreateTaskProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      date: null,
      priority: "normal",
    },
  });

  useEffect(() => {
    if (editMode && initialData) {
      reset({
        title: initialData.title || "",
        description: initialData.description || "",
        date: initialData.date ? new Date(initialData.date) : null,
        priority: initialData.priority || "normal",
      });
    } else {
      reset({
        title: "",
        description: "",
        date: null,
        priority: "normal",
      });
    }
  }, [editMode, initialData, reset]);

  return (
    <>
    <div className="mb-6">
         <h2 className="text-2xl font-semibold mb-4 dark:text-neutral-100">
        {editMode ? "Modifier la tâche" : "Créer une tâche"}
      </h2>
    </div>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <div>
      <InputGroup
        label="Titre de la tâche"
        placeholder="Saisir le titre de la tâche"
        type="text"
        inputProps={register("title")}
        error={errors.title}
      />
      </div>

      <div>
      <InputGroup
        type="textarea"
        label="Description"
        placeholder="Saisir la description de la tâche"
        inputProps={register("description")}
        error={errors.description}
      />
      </div>

      <div>
        <label className="block mb-2 font-medium text-mainclr dark:text-neutral-300">
          Date
        </label>
        <Controller
          control={control}
          name="date"
          render={({ field: { value, onChange } }) => (
            <Controller
              control={control}
              name="date"
              render={({ field: { value, onChange } }) => (
                <CustomDatePicker
                  selected={value}
                  onChange={onChange}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Sélectionner la date"
                />
              )}
            />
          )}
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">
            {errors.date.message as string}
          </p>
        )}
      </div>

      <div>
      <Controller
        control={control}
        name="priority"
        render={({ field: { value, onChange } }) => (
          <CustomSelect
            label="Priorité"
            options={priorities}
            value={priorities.find((p) => p.value === value)}
            onChange={(v) => onChange(v?.value)}
            placeholder="Sélectionner la priorité"
          />
        )}
      />
      {errors.priority && (
        <p className="text-red-500 text-sm mt-1">
          {errors.priority.message as string}
        </p>
      )}
      </div>    

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        size="large"
        className="w-full mt-4"
        disabled={isSubmitting}
      >
        {editMode ? "Mettre à jour la tâche" : "Créer la tâche"}
      </Button>
    </form>
    </>
  );
}

export default CreateTask;
