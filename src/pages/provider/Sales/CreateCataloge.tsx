import OuterModal from "../../../components/Custommodal/OuterModal";
import InputGroup from "../../../components/ui-main/InputGroup";
import { Trash2, X } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import FileDropzone from "../../../components/imageUpload";
import { useToast } from "../../../utils/toast";
import {
  patchRequest,
  postRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import Button from "../../../components/ui/Button";
import { uploadFile } from "../../../utils/uploadfile";

// Yup Schema
const schema = yup.object().shape({
  name: yup.string().required("Le nom du produit est requis"),
  description: yup.string().optional(),
  unitPrice: yup
    .number()
    .typeError("Veuillez entrer un prix valide")
    .required("Le prix est requis"),
  vatRate: yup
    .number()
    .typeError("Veuillez entrer une TVA valide")
    .required("La TVA est requise"),
  category: yup.string().required("La catégorie est requise"),
  rentDeposit: yup.number().typeError("Veuillez entrer une valeur valide").required(),

  image: yup.array(),
  ingredients: yup
    .array()
    .of(
      yup.object().shape({
        ingredient: yup.string().required("L’ingrédient est requis"),
        quantity: yup.string().required("La quantité est requise"),
        unit: yup.object().required("L’unité est requise"),
      })
    )
    .optional()
    .default([]),
});

function CreateCataloge({ active, setActive, editData = null }) {
  const categories = [
    { value: "Gram", label: "Gramme (g)" },
    { value: "Kilo", label: "Kilo(kg)" },
    { value: "ML", label: "milliliter" },
    { value: "Litre", label: "Litre (l)" },
    { value: "Piece", label: "Pièce" },
  ];
  const [btnLoading, setBtnLoading] = useState(false);


  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      unitPrice: "",
      vatRate: "",
      rentDeposit: "",
      category: "",
      servings: 1,
      image: [],
      ingredients: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "ingredients",
    control,
  });

  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        description: editData.description,
        unitPrice: editData.unitPrice,
        vatRate: editData.vatRate,
        category: editData.category,
        rentDeposit: editData.rentDeposit,
        image: [],
        ingredients: (editData.ingredients || []).map((ing) => ({
          ingredient: ing.ingredient,
          quantity: ing.quantity,
          unit: categories.find((u) => u.value === ing.unit) || null,
        })),
      });
    }
  }, [editData]);

  const toast = useToast();

  const onSubmit = async (data) => {
    setBtnLoading(true);

    try {
      let uploadedUrl = editData?.imageUrl || null;

      if (data.image?.length) {
        const uploadRes = await uploadFile(data.image[0]);
        uploadedUrl = uploadRes.url;
      }

      const payload = {
        name: data.name,
        description: data.description,
        imageUrl: uploadedUrl,
        unitPrice: data?.unitPrice?.toString(),
        vatRate: data.vatRate,
        category: data.category,
        rentDeposit: data.rentDeposit,
        // ingredients: data.ingredients.map((i) => ({
        //   ingredient: i.ingredient,
        //   quantity: i.quantity,
        //   unit: i.unit.value,
        // })),
        ingredients: [],
      };

      if (editData?.id) {
        await patchRequest(`${PROVIDER.CATELOGUE}/${editData.id}`, payload);
        toast.success("Le produit a été mis à jour avec succès");
      } else {
        await postRequest(PROVIDER.CATELOGUE, payload);
        toast.success("Le produit a été ajouté avec succès");
      }

      setActive(false);
    } catch (error) {
      console.error(error);
      toast.error("Échec de l’enregistrement du produit, veuillez réessayer");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <OuterModal active={active} setActive={setActive}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative"
      >
        <X
          className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
          onClick={() => setActive(false)}
        />

        <h5 className="text-2xl mb-5 font-bold tracking-wider capitalize dark:text-neutral-300">
          Informations Générales
        </h5>

        <div className="space-y-3 mb-7">
          <div>
            <InputGroup
              label="Nom du produit ou de la recette*"
              placeholder="Exemple : menu en 3 services"
              inputProps={register("name")}
              error={errors.name}
            />
          </div>
          <div>
            <InputGroup
              label="Description"
              type="textarea"
              placeholder="Décrivez votre produit"
              inputProps={register("description")}
            />
          </div>
          <div>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <FileDropzone
                  value={field.value}
                  onChange={field.onChange}
                  maxFiles={1}
                  previews={editData?.imageUrl ? [editData.imageUrl] : []}
                  onRemoveExisting={() => {
                    reset((prev) => ({ ...prev, image: [] }));
                    editData.imageUrl = null;
                  }}
                  error={errors.image?.message}
                />
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <InputGroup
                label="Prix unitaire hors TVA*"
                type="number"
                placeholder="0.00"
                inputProps={register("unitPrice")}
                error={errors.unitPrice}
              />
            </div>
            <div className="flex-1">
              <InputGroup
                label="Taux de TVA (%)"
                type="number"
                placeholder="20"
                inputProps={register("vatRate")}
                error={errors.vatRate}
              />
            </div>
          </div>
          <div>
            <InputGroup
              label="Catégorie"
              placeholder="Ex. : Buffets"
              inputProps={register("category")}
              error={errors.category}
            />
          </div>
          <div>
            <InputGroup
              label="Dépôt de garantie locative"
              type="number"
              inputProps={register("rentDeposit")}
              error={errors.rentDeposit}
            />
          </div>
        </div>

        

       

        <div className="flex flex-col md:flex-row justify-between gap-3 mt-6">
          {/* <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => append({ ingredient: "", quantity: "", unit: null })}
          >
            + Add Ingredient
          </Button> */}

          <Button type="submit" loading={btnLoading} className="flex-1">
            {editData ? "Mettre à jour" : "Créer"} Catalogue
          </Button>
        </div>
      </form>
    </OuterModal>
  );
}

export default CreateCataloge;
