import InputGroup from "../../../components/ui-main/InputGroup";
import Button from "../../../components/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().required("Le titre est obligatoire"),
  description: yup.string().required("La description est obligatoire"),
});

function CreateSuggestion({ onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
       <div className="mb-6">
       <h2 className="text-xl font-semibold dark:text-neutral-100">
       Proposer une idée
      </h2>
      </div>
      <div>
        <InputGroup
          label="Titre*"
          placeholder="Titre de votre idée"
          type="text"
          error={errors.title}
          inputProps={register("title")}
        />
      </div>

      <div>
        <InputGroup
          label="Description*"
          placeholder="Décrivez votre idée en détail. Pourquoi est-elle importante pour vous ? Quel problème résout-elle ?"
          type="textarea"
          error={errors.description}
          inputProps={register("description")}
        />
      </div>

      <div className="mt-5">
        <Button
          loading={loading}
          type="submit"
          variant="primary"
          size="large"
          className="w-full"
        >
        Soumettez l'idée
        </Button>
      </div>
    </form>
  );
}

export default CreateSuggestion;
