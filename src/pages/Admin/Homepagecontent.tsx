
import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "react-router-dom";

import Button from "../../components/ui/Button";
import InputGroup from "../../components/ui-main/InputGroup";
import { ADMIN } from "../../utils/endPoints";
import {
  getRequest,
  postRequest,
  patchRequest,
} from "../../utils/http-client/axiosClient";
import { useToast } from "../../utils/toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { uploadFile } from "../../utils/uploadfile";
import FileDropzone from "../../components/imageUpload";
import { IMAGE_URL, VIDEO_URL } from "../../utils/constants";

// Flags

import USAflag from '../../../public/flags/uk.png'

// ---------------- Types ----------------
type Language = "en" | "es" | "fr";
type TextWithDesc = { heading: string; description: string };
type Card = { heading: string; description: string };
type FirstSection = TextWithDesc;
type SecondSection = TextWithDesc & { card1: Card; card2: Card };
type ThirdSection = { sectionHeading: string; card1: Card; card2: Card };
type FourthSection = { sectionHeading: string; listHeading: string };
type BenefitsSection = { sectionHeading: string; points: string[] };
type VideoSection = { sectionHeading: string };
type LangHomepage = {
  first: FirstSection;
  second: SecondSection;
  third: ThirdSection;
  fourth: FourthSection;
  benefits: BenefitsSection;
  video: VideoSection;
};
type SharedMedia = {
  heroImage?: string;
  heroImageFile?: File[];
  fourthImage?: string;
  fourthImageFile?: File[];
  videoUrl?: string;
  videoFile?: File[];
};
type HomepageFormValues = {
  en: LangHomepage;
  es: LangHomepage;
  fr: LangHomepage;
  shared: SharedMedia;
};
type HomepageApiContent = {
  shared?: { heroImage?: string; fourthImage?: string; videoUrl?: string };
  en?: Partial<LangHomepage>;
  es?: Partial<LangHomepage>;
  fr?: Partial<LangHomepage>;
};
type HomepageApi = {
  id?: string;
  slug: string;
  title?: string;
  content: HomepageApiContent;
};

// ---------------- Base preview URLs (replace with actuals) ----------------
// const IMAGE_URL = (import.meta as any)?.env?.VITE_IMAGE_URL || ""; // e.g. https://cdn.example.com/
// const VIDEO_URL = (import.meta as any)?.env?.VITE_VIDEO_URL || ""; // e.g. https://videos.example.com/

const toImageUrl = (path?: string) => {
  if (!path) return "";
  if (
    /^https?:\/\//i.test(path) ||
    path.startsWith("blob:") ||
    path.startsWith("/")
  )
    return path;
  if (!IMAGE_URL) return path;
  return `${String(IMAGE_URL).replace(/\/$/, "")}/${String(path).replace(
    /^\//,
    ""
  )}`;
};

const toVideoUrl = (path?: string) => {
  if (!path) return "";
  if (
    /^https?:\/\//i.test(path) ||
    path.startsWith("blob:") ||
    path.startsWith("/")
  )
    return path;
  if (!VIDEO_URL) return path;
  return `${String(VIDEO_URL).replace(/\/$/, "")}/${String(path).replace(
    /^\//,
    ""
  )}`;
};

// ---------------- Validation ----------------
const nonEmptyHtml = (value?: string) => {
  if (typeof value !== "string") return false;
  const stripped = value
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return stripped.length > 0;
};
const quillRequired = yup
  .string()
  .test("non-empty-html", "Description is required", nonEmptyHtml);
const cardSchema = yup.object({
  heading: yup.string().required("Heading is required"),
  description: quillRequired.required("Description is required"),
});
const firstSectionSchema = yup.object({
  heading: yup.string().required("Heading is required"),
  description: quillRequired.required("Description is required"),
});
const secondSectionSchema = yup.object({
  heading: yup.string().required("Heading is required"),
  description: quillRequired.required("Description is required"),
  card1: cardSchema.required(),
  card2: cardSchema.required(),
});
const thirdSectionSchema = yup.object({
  sectionHeading: yup.string().required("Section heading is required"),
  card1: cardSchema.required(),
  card2: cardSchema.required(),
});
const fourthSectionSchema = yup.object({
  sectionHeading: yup.string().required("Section heading is required"),
  listHeading: yup.string().required("List heading is required"),
});
const benefitsSchema = yup.object({
  sectionHeading: yup.string().required("Section heading is required"),
  points: yup
    .array()
    .of(yup.string().trim().required("Point is required"))
    .min(1, "At least one point is required")
    .required("At least one point is required"),
});
const videoSectionSchema = yup.object({
  sectionHeading: yup.string().required("Section heading is required"),
});
const langHomepageSchema: yup.Schema<LangHomepage> = yup.object({
  first: firstSectionSchema.required(),
  second: secondSectionSchema.required(),
  third: thirdSectionSchema.required(),
  fourth: fourthSectionSchema.required(),
  benefits: benefitsSchema.required(),
  video: videoSectionSchema.required(),
});
const sharedMediaSchema = yup.object({
  heroImageFile: yup.array().of(yup.mixed<File>()).optional(),
  fourthImageFile: yup.array().of(yup.mixed<File>()).optional(),
  videoFile: yup.array().of(yup.mixed<File>()).optional(),
});
const schema: yup.Schema<HomepageFormValues> = yup.object({
  en: langHomepageSchema.required(),
  es: langHomepageSchema.required(),
  fr: langHomepageSchema.required(),
  shared: sharedMediaSchema,
});

// ---------------- Defaults ----------------
const defaultCard: Card = { heading: "", description: "" };
const defaultFirst: FirstSection = { heading: "", description: "" };
const defaultSecond: SecondSection = {
  heading: "",
  description: "",
  card1: { ...defaultCard },
  card2: { ...defaultCard },
};
const defaultThird: ThirdSection = {
  sectionHeading: "",
  card1: { ...defaultCard },
  card2: { ...defaultCard },
};
const defaultFourth: FourthSection = { sectionHeading: "", listHeading: "" };
const defaultBenefits: BenefitsSection = { sectionHeading: "", points: [""] };
const defaultVideo: VideoSection = { sectionHeading: "" };
const defaultLang: LangHomepage = {
  first: { ...defaultFirst },
  second: { ...defaultSecond },
  third: { ...defaultThird },
  fourth: { ...defaultFourth },
  benefits: { ...defaultBenefits },
  video: { ...defaultVideo },
};

const toLang = (src?: Partial<LangHomepage>): LangHomepage => ({
  first: {
    heading: src?.first?.heading ?? "",
    description: src?.first?.description ?? "",
  },
  second: {
    heading: src?.second?.heading ?? "",
    description: src?.second?.description ?? "",
    card1: {
      heading: src?.second?.card1?.heading ?? "",
      description: src?.second?.card1?.description ?? "",
    },
    card2: {
      heading: src?.second?.card2?.heading ?? "",
      description: src?.second?.card2?.description ?? "",
    },
  },
  third: {
    sectionHeading: src?.third?.sectionHeading ?? "",
    card1: {
      heading: src?.third?.card1?.heading ?? "",
      description: src?.third?.card1?.description ?? "",
    },
    card2: {
      heading: src?.third?.card2?.heading ?? "",
      description: src?.third?.card2?.description ?? "",
    },
  },
  fourth: {
    sectionHeading: src?.fourth?.sectionHeading ?? "",
    listHeading: src?.fourth?.listHeading ?? "",
  },
  benefits: {
    sectionHeading: src?.benefits?.sectionHeading ?? "",
    points:
      Array.isArray(src?.benefits?.points) &&
      (src!.benefits!.points as string[])?.length > 0
        ? (src!.benefits!.points as string[])
        : [""],
  },
  video: { sectionHeading: src?.video?.sectionHeading ?? "" },
});

// ---------------- Quill config ----------------
const quillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "clean"],
  ],
};
const quillFormats = ["bold", "italic", "underline", "list", "link"];

// ---------------- Component ----------------
const ManageHomepage: React.FC = () => {
  const { id } = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [pageId, setPageId] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<HomepageFormValues>({
    defaultValues: {
      en: { ...defaultLang },
      es: { ...defaultLang },
      fr: { ...defaultLang },
      shared: { heroImageFile: [], fourthImageFile: [], videoFile: [] },
    },
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const enBenefits = useFieldArray({ control, name: "en.benefits.points" });
  const esBenefits = useFieldArray({ control, name: "es.benefits.points" });
  const frBenefits = useFieldArray({ control, name: "fr.benefits.points" });

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        const resp = await getRequest(`${ADMIN.PAGES}/${id}`);
        const data = resp?.data?.data as HomepageApi | undefined;
        if (!data?.content) return;
        if (data.id) setPageId(String(data.id));

        const content = data.content;
        reset({
          en: toLang(content.en),
          es: toLang(content.es),
          fr: toLang(content.fr),
          shared: {
            heroImage: content.shared?.heroImage ?? "",
            heroImageFile: [],
            fourthImage: content.shared?.fourthImage ?? "",
            fourthImageFile: [],
            videoUrl: content.shared?.videoUrl ?? "",
            videoFile: [],
          },
        });
      } catch (e) {
        console.error("Failed to fetch homepage content", e);
      }
    };
    if (id) load();
  }, [reset, id]);

  // Build previews from current form values using IMAGE_URL / VIDEO_URL
  const heroPreview = useMemo(() => {
    const p = watch("shared.heroImage");
    return p ? [toImageUrl(p)] : [];
  }, [watch("shared.heroImage")]);

  const fourthPreview = useMemo(() => {
    const p = watch("shared.fourthImage");
    return p ? [toImageUrl(p)] : [];
  }, [watch("shared.fourthImage")]);

  const videoPreview = useMemo(() => {
    const p = watch("shared.videoUrl");
    return p ? [toVideoUrl(p)] : [];
  }, [watch("shared.videoUrl")]);

  const buildPayload = (v: HomepageFormValues) => ({
    slug: "homepage",
    title: "Homepage",
    content: {
      shared: {
        heroImage: v.shared.heroImage,
        fourthImage: v.shared.fourthImage,
        videoUrl: v.shared.videoUrl,
      },
      en: v.en,
      es: v.es,
      fr: v.fr,
    },
  });

  const onSubmit = async (values: HomepageFormValues) => {
    setLoading(true);
    try {
      // Upload newly selected files first (if present) — ensure single-file indexing
      if (values.shared.heroImageFile?.length) {
        const { file } = await uploadFile(values.shared.heroImageFile[0]);
        values.shared.heroImage = file;
      }
      if (values.shared.fourthImageFile?.length) {
        const { file } = await uploadFile(values.shared.fourthImageFile[0]);
        values.shared.fourthImage = file;
      }
      if (values.shared.videoFile?.length) {
        const { file } = await uploadFile(values.shared.videoFile[0]);
        values.shared.videoUrl = file;
      }

      const payload = buildPayload(values);

      if (pageId) {
        await patchRequest(`${ADMIN.PAGES}/${pageId}`, payload);
        toast.success("Page d’accueil mise à jour avec succès");
      } else {
        const resp = await postRequest(ADMIN.CREATE_CONTENT, payload);
        if (resp?.data?.data?.id) {
          setPageId(String(resp.data.data.id));
        }
        toast.success("Page d’accueil créée avec succès");
      }
    } catch (e) {
      console.error("Save failed", e);
      toast.error("Une erreur s’est produite lors de l’enregistrement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const QuillField = ({
    field,
    error,
    label,
    placeholder,
  }: {
    field: any;
    error?: any;
    label: string;
    placeholder?: string;
  }) => (
    <div>
      <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
        {label}
      </label>
      <ReactQuill
        theme="snow"
        value={field.value || ""}
        onChange={(val) => field.onChange(val)}
        modules={quillModules}
        formats={quillFormats}
        placeholder={placeholder}
      />
      {error?.message ? (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      ) : null}
    </div>
  );

  const BenefitsPoints = (langKey: Language) => {
    const err: any = (errors as any)?.[langKey]?.benefits || {};
    const fa =
      langKey === "en"
        ? enBenefits
        : langKey === "es"
        ? esBenefits
        : frBenefits;

    return (
      <div className="space-y-4 mt-6">
        <div className="bg-gray-100 p-3 rounded">Section des avantages</div>
        <Controller
          control={control}
          name={`${langKey}.benefits.sectionHeading` as const}
          render={({ field }) => (
            <InputGroup
              label="Titre de la section"
              placeholder="What Benefit Will You Get"
              inputProps={field}
              error={err?.sectionHeading}
            />
          )}
        />
        <div className="flex items-center justify-between">
          <span className="block mb-2 text-base font-medium dark:text-neutral-300">Points</span>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => fa.append("")}
          >
            Ajouter un point
          </Button>
        </div>
        <div className="space-y-3">
          {fa.fields.map((f, idx) => (
            <div key={f.id} className="flex items-end gap-3 w-full">
              <div className="flex-1">
                <Controller
                  control={control}
                  name={`${langKey}.benefits.points.${idx}` as const}
                  render={({ field }) => (
                    <InputGroup
                      label={`Point #${idx + 1}`}
                      placeholder="Enter benefit point"
                      inputProps={field}
                      error={(err as any)?.points?.[idx]}
                    />
                  )}
                />
              </div>
              <Button
                type="button"
                variant="danger"
                size="small"
                onClick={() => fa.remove(idx)}
              >
                Supprimer
              </Button>
            </div>
          ))}
          {typeof (err as any)?.points?.message === "string" && (
            <p className="text-red-500 text-sm mt-1">
              {(err as any)?.points?.message}
            </p>
          )}
        </div>
      </div>
    );
  };

  const LangBlock: React.FC<{ langKey: Language; label: string }> = ({
    langKey,
    label,
  }) => {
    const langErr: any = (errors as any)?.[langKey] || {};
    return (
      <div className="bg-white dark:bg-darkmode rounded-2xl p-5">
      <div className = {`p-4 rounded-xl mb-4 ${
    label === "English Content (EN)"
      ? "bg-blue-950"
      : label === "Spanish Content (ES)"
      ? "bg-yellow-500"
      : label === "Contenu français"
      ? "bg-red-600"
      : "bg-black"
  }`}>
          <span className="font-bold text-white flex items-center gap-3">{label}</span>
          
        </div>

        {/* First Section */}
        <div className="space-y-4">
          <Controller
            control={control}
            name={`${langKey}.first.heading` as const}
            render={({ field }) => (
              <InputGroup
                label="Titre de la première section"
                placeholder="Saisir un titre"
                inputProps={field}
                error={langErr?.first?.heading}
              />
            )}
          />
          <Controller
            control={control}
            name={`${langKey}.first.description` as const}
            render={({ field }) => (
              <QuillField
                field={field}
                label="Description de la première section"
                placeholder="Écrire une description"
                error={langErr?.first?.description}
              />
            )}
          />
        </div>

        {/* Second Section */}
        <div className="space-y-4 mt-6">
          <div className="bg-gray-100 p-3 rounded">Deuxième section</div>
          <Controller
            control={control}
            name={`${langKey}.second.heading` as const}
            render={({ field }) => (
              <InputGroup
                label="Titre"
                placeholder="Écrire un titre"
                inputProps={field}
                error={langErr?.second?.heading}
              />
            )}
          />
          <Controller
            control={control}
            name={`${langKey}.second.description` as const}
            render={({ field }) => (
              <QuillField
                field={field}
                label="Description"
                placeholder="Écrire une description"
                error={langErr?.second?.description}
              />
            )}
          />
          <Controller
            control={control}
            name={`${langKey}.second.card1.heading` as const}
            render={({ field }) => (
              <InputGroup
                label="En-tête de la première carte"
                placeholder="Saisir un titre"
                inputProps={field}
                error={langErr?.second?.card1?.heading}
              />
            )}
          />
          <Controller
            control={control}
            name={`${langKey}.second.card1.description` as const}
            render={({ field }) => (
              <QuillField
                field={field}
                label="Description de la première carte"
                placeholder="Saisir une description"
                error={langErr?.second?.card1?.description}
              />
            )}
          />
          <Controller
            control={control}
            name={`${langKey}.second.card2.heading` as const}
            render={({ field }) => (
              <InputGroup
                label="Titre de la deuxième carte"
                placeholder="Saisir un titre"
                inputProps={field}
                error={langErr?.second?.card2?.heading}
              />
            )}
          />
          <Controller
            control={control}
            name={`${langKey}.second.card2.description` as const}
            render={({ field }) => (
              <QuillField
                field={field}
                label="Description de la deuxième carte"
                placeholder="Saisir une description"
                error={langErr?.second?.card2?.description}
              />
            )}
          />
        </div>

        {/* Third Section */}
        <div className="space-y-4 mt-6">
          <div className="bg-gray-100 p-3 rounded">Troisième section</div>
          <Controller
            control={control}
            name={`${langKey}.third.sectionHeading` as const}
            render={({ field }) => (
              <InputGroup
                label="Titre de la section"
                placeholder="Écrire un titre"
                inputProps={field}
                error={langErr?.third?.sectionHeading}
              />
            )}
          />
          <Controller
            control={control}
            name={`${langKey}.third.card1.heading` as const}
            render={({ field }) => (
              <InputGroup
                label="Titre de la première carte"
                placeholder="Saisir un titre"
                inputProps={field}
                error={langErr?.third?.card1?.heading}
              />
            )}
          />
          <Controller
            control={control}
            name={`${langKey}.third.card1.description` as const}
            render={({ field }) => (
              <QuillField
                field={field}
                label="Description de la première carte"
                placeholder="Saisir une description"
                error={langErr?.third?.card1?.description}
              />
            )}
          />
          <Controller
            control={control}
            name={`${langKey}.third.card2.heading` as const}
            render={({ field }) => (
              <InputGroup
                label="Titre de la deuxième carte"
                placeholder="Saisir un titre"
                inputProps={field}
                error={langErr?.third?.card2?.heading}
              />
            )}
          />
          <Controller
            control={control}
            name={`${langKey}.third.card2.description` as const}
            render={({ field }) => (
              <QuillField
                field={field}
                label="Description de la deuxième carte"
                placeholder="Saisir une description"
                error={langErr?.third?.card2?.description}
              />
            )}
          />
        </div>

        {/* Fourth Section */}
        <div className="space-y-4 mt-6">
          <div className="bg-gray-100 p-3 rounded">Quatrième section</div>
          <Controller
            control={control}
            name={`${langKey}.fourth.sectionHeading` as const}
            render={({ field }) => (
              <InputGroup
                label="Titre de la section"
                placeholder="Écrire un titre"
                inputProps={field}
                error={langErr?.fourth?.sectionHeading}
              />
            )}
          />
          <Controller
            control={control}
            name={`${langKey}.fourth.listHeading` as const}
            render={({ field }) => (
              <InputGroup
                label="Titre de la liste"
                placeholder="Saisir un titre"
                inputProps={field}
                error={langErr?.fourth?.listHeading}
              />
            )}
          />
        </div>

        {/* Benefits */}
        {BenefitsPoints(langKey)}

        {/* Video Section */}
        <div className="space-y-4 mt-6">
          <div className="bg-gray-100 p-3 rounded">Section vidéo</div>
          <Controller
            control={control}
            name={`${langKey}.video.sectionHeading` as const}
            render={({ field }) => (
              <InputGroup
                label="Section vidéo"
                placeholder="Écrire un titre"
                inputProps={field}
                error={(errors as any)?.[langKey]?.video?.sectionHeading}
              />
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-5 justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold dark:text-neutral-300">Gérer le contenu de la page d'accueil</h1>
            {/* <p className="text-gray-600 dark:text-neutral-300 mt-1">Manage the homepage content</p> */}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, () =>
          toast.error("Please fix the errors highlighted below")
        )}
      >
        <div className="space-y-9">
          <div className="bg-white dark:bg-darkmode rounded-2xl p-5">
            <div className="bg-gray-200 p-4 rounded-xl mb-4">
              <span className="mb-5 font-bold text-gray-600 capitalize">médias partagés</span>
            </div>

            <div className="space-y-4">
              {/* Hero Image */}
              <div>
                <span className="block mb-2 text-base font-medium dark:text-neutral-300">
                Image principale
                </span>
                <Controller
                  control={control}
                  name="shared.heroImageFile"
                  render={({ field }) => (
                    <FileDropzone
                      value={(field.value as File[]) || []}
                      onChange={(files) => field.onChange(files)}
                      accept={{ "image/*": [] }}
                      maxFiles={1}
                      helperText="Upload a hero image. Existing will remain unless replaced."
                      className="mt-1 dark:text-neutral-300"
                      previews={heroPreview}
                    />
                  )}
                />
              </div>

              {/* Fourth Section Image */}
              <div>
                <span className="block mb-2 text-base font-medium">
                  Image de la quatrième section
                </span>
                <Controller
                  control={control}
                  name="shared.fourthImageFile"
                  render={({ field }) => (
                    <FileDropzone
                      value={(field.value as File[]) || []}
                      onChange={(files) => field.onChange(files)}
                      accept={{ "image/*": [] }}
                      maxFiles={1}
                      helperText="Upload image for fourth section."
                      className="mt-1 dark:text-neutral-300"
                      previews={fourthPreview}
                    />
                  )}
                />
              </div>

              {/* Video */}
              <div>
                <span className="block mb-2 text-base font-medium dark:text-neutral-300">
                 Télécharger une vidéo
                </span>
                <Controller
                  control={control}
                  name="shared.videoFile"
                  render={({ field }) => (
                    <FileDropzone
                      value={(field.value as File[]) || []}
                      onChange={(files) => field.onChange(files)}
                      accept={{ "video/*": [] }}
                      maxFiles={1}
                      helperText="Upload a video file."
                      className="mt-1 dark:text-neutral-300"
                      previews={videoPreview}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Language blocks */}
          <LangBlock langKey="en" label="English Content (EN)" />
          <LangBlock langKey="es" label="Spanish Content (ES)" />
          <LangBlock langKey="fr" label="Contenu français" />

          {/* Submit */}
          <div className="bg-white dark:bg-darkmode rounded-2xl p-5 sticky bottom-0">
            <Button
              variant="primary"
              size="medium"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Enregistrement en cours..."
                : pageId
                ? "Mettre à jour le contenu"
                : "Enregistrer le contenu"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManageHomepage;
