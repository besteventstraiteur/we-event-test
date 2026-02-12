import { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import InputGroup from "../../components/ui-main/InputGroup";
import CustomSelect from "../../components/ui-main/selectBox";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uploadFile } from "../../utils/uploadfile";
import "react-phone-input-2/lib/style.css";
import {
  getRequest,
  patchRequest,
  postRequest,
  deleteRequest,
} from "../../utils/http-client/axiosClient";
import { AUTH, PROVIDER } from "../../utils/endPoints";
import { useToast } from "../../utils/toast";
import FileDropzone from "../../components/imageUpload";
import Autocomplete from "react-google-autocomplete";
import { FileText, Plus, Trash2, Upload } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type ProfileForm = {
  companyName: string;
  bio: string | null;
  categories: string[];
  location: string;
  department: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website: string;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  portfolio: File[];
  portfolioUrls: string[];
  lat?: number | null;
  long?: number | null;
  placeId?: string | null;
};

const schema: yup.SchemaOf<ProfileForm> = yup.object({
  companyName: yup
    .string()
    .trim()
    .required("Le nom de l'entreprise est requis"),
  bio: yup.string().nullable().max(5000).optional(),
  categories: yup
    .array(yup.string().required())
    .min(1, "Sélectionnez au moins une catégorie"),
  location: yup.string().required("Le lieu est obligatoire"),
  department: yup.string().required("Le département est obligatoire"),
  postalCode: yup.string().required("Le code postal est obligatoire"),
  phoneNumber: yup.string().required("Le numéro d’entreprise est obligatoire"),
  email: yup.string().email().required("L’e-mail est obligatoire"),
  website: yup.string().required(),
  instagramUrl: yup.string().nullable().optional(),
  linkedinUrl: yup.string().nullable().optional(),
  twitterUrl: yup.string().nullable().optional(),
  facebookUrl: yup.string().nullable().optional(),
  youtubeUrl: yup.string().nullable().optional(),
  portfolio: yup.array().of(yup.mixed<File>()).optional(),
  portfolioUrls: yup.array().of(yup.string()).optional(),
  lat: yup.number().nullable().optional(),
  long: yup.number().nullable().optional(),
});

function Businessinfo() {
  const [imgUploading, setImgUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [profileData, setProfileData] = useState<any>(null);

  const toast = useToast();
  const [videos, setVideos] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [videoTitleInput, setVideoTitleInput] = useState("");
  const [loadingBusiness, setLoadingBusiness] = useState(false);
  const [importLoading, setimportLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("Information");
  const [googleReviews, setGoogleReviews] = useState<any[]>([]);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [dbReviews, setDbReviews] = useState<any[]>([]);
  const [dbPage, setDbPage] = useState(1);
  const [dbLimit] = useState(5);
  const [dbTotalPages, setDbTotalPages] = useState(1);
  const [loadingDbReviews, setLoadingDbReviews] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getRequest(
          `${PROVIDER.GET_ALL_SERVICES}?page=1&limit=100`,
        );
        const services = res?.data?.data?.services || [];
        setCategoriesOptions(
          services.map((s: any) => ({ value: s.id, label: s.name })),
        );
      } catch (err) {}
    };
    fetchCategories();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getRequest(PROVIDER.GET_PROFILE);
      const data = res?.data?.data;
      setProfileData(data);
      setVideos(data?.videos || []);
      setDocuments(data?.documents || []);
    } catch (err) {}
  };

  const fetchDbReviews = async (page = 1) => {
    if (!profileData?.id) return;

    try {
      setLoadingDbReviews(true);

      const res = await getRequest(
        `${PROVIDER.GET_IMPORTED_REVIEWS}/${profileData.id}?page=${page}&limit=${dbLimit}`,
      );

      const data = res?.data?.data;

      const ratings = data?.ratings || [];

      setDbReviews(ratings);

      setSelectedReviews(ratings.map((r: any) => r.id));

      setDbPage(data?.page || 1);
      setDbTotalPages(data?.totalPages || 1);
    } catch (err) {
      toast.error("Échec de la récupération des avis enregistrés");
    } finally {
      setLoadingDbReviews(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const defaultValues = useMemo<ProfileForm>(
    () => ({
      companyName: profileData?.name ?? "",
      bio: profileData?.description ?? "",
      categories: profileData?.services?.map((s: any) => s?.serviceId) ?? [],
      location: profileData?.address ?? "",
      department: profileData?.state ?? "",
      postalCode: profileData?.postcode ?? "",
      phoneNumber: profileData?.phoneNumber ?? "",
      email: profileData?.email ?? "",
      website: profileData?.webUrl ?? "",
      instagramUrl: profileData?.inUrl ?? "",
      linkedinUrl: profileData?.liUrl ?? "",
      twitterUrl: profileData?.xUrl ?? "",
      facebookUrl: profileData?.fbUrl ?? "",
      youtubeUrl: profileData?.ytUrl ?? "",
      portfolio: [],
      portfolioUrls:
        profileData?.portfolioImages?.map((img: string) => `${img}`) ?? [],
      lat: profileData?.lat ?? null,
      long: profileData?.long ?? null,
      placeId: profileData?.placeId ?? "",
    }),
    [profileData],
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
    watch,
  } = useForm<ProfileForm>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (activeTab === "Notice" && profileData?.id) {
      fetchDbReviews(1);
    }
  }, [activeTab, profileData?.id]);

  useEffect(() => {
    if (profileData)
      reset(defaultValues, {
        keepDirty: true,
        keepTouched: true,
      });
  }, [profileData, defaultValues, reset]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (!place) return;
    const address = place.formatted_address || "";
    setValue("location", address, { shouldDirty: true });

    if (place.geometry?.location) {
      setValue("lat", place.geometry.location.lat(), { shouldDirty: true });
      setValue("long", place.geometry.location.lng(), { shouldDirty: true });
    }
  };

  const uploadBusinessFile = async (file: File, type: "video" | "document") => {
    try {
      setUploadingFile(true);
      const { file: s3Key, url } = await uploadFile(file);

      const payload: any = {
        name: file.name,
        url,
        s3Key,
        businessId: profileData?.id,
        type,
      };

      await postRequest(PROVIDER.UPLOAD_SHOWCASE, payload);
      toast.success(
        `${type === "video" ? "Video" : "Document"} Téléchargé avec succès`,
      );
      await fetchProfile();
    } catch (err) {
      toast.error("Échec du téléchargement. Réessayez.");
    } finally {
      setUploadingFile(false);
    }
  };

  const addVideoFromUrl = async () => {
    setLoadingBusiness(true);
    if (!videoUrlInput.trim()) {
      toast.error("Veuillez saisir une URL de vidéo");
      return;
    }
    try {
      const payload = {
        name: videoTitleInput?.trim() || "External video",
        url: videoUrlInput,
        s3Key: null,
        businessId: profileData?.id,
        type: "video",
      };
      await postRequest(PROVIDER.UPLOAD_SHOWCASE, payload);
      toast.success("Vidéo externe ajoutée");
      setVideoUrlInput("");
      setVideoTitleInput("");
      await fetchProfile();
    } catch (err) {
      toast.error("Échec de l’ajout de la vidéo.");
    }
    setLoadingBusiness(false);
  };

  const deleteBusinessFile = async (id: string, type: "video" | "document") => {
    try {
      const endpoint =
        type === "video"
          ? `${PROVIDER.DELETE_VIDEO}/${id}`
          : `${PROVIDER.DELETE_DOCUMENT}/${id}`;
      await deleteRequest(endpoint);
      toast.success(
        `${type === "video" ? "Video" : "Document"} Supprimé avec succès`,
      );
      await fetchProfile();
    } catch (err) {
      toast.error("Échec de la suppression.");
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      setImgUploading(true);

      const uploadedUrls: string[] = [];
      for (const f of data.portfolio || []) {
        const { url } = await uploadFile(f);
        uploadedUrls.push(url);
      }

      const payload = {
        name: data.companyName,
        description: data.bio,
        services: data.categories,
        address: data.location,
        state: data.department,
        postcode: data.postalCode,
        phoneNumber: data.phoneNumber,
        email: data.email,
        webUrl: data.website,
        inUrl: data.instagramUrl,
        liUrl: data.linkedinUrl,
        xUrl: data.twitterUrl,
        fbUrl: data.facebookUrl,
        ytUrl: data.youtubeUrl,
        lat: data.lat,
        long: data.long,
        placeId: data?.placeId || null,
        portfolioImages: [
          ...(data.portfolioUrls || []),
          ...(uploadedUrls || []),
        ],
      };

      if (profileData) {
        await patchRequest(
          `${AUTH.BUSINESS_PROFILE}/${profileData?.id}`,
          payload,
        );
      } else {
        await postRequest(`${AUTH.BUSINESS_PROFILE}`, payload);
      }

      toast.success("Profil mis à jour avec succès");
      await fetchProfile();
    } catch (err) {
      toast.error("Échec de la mise à jour.");
    } finally {
      setImgUploading(false);
    }
  };
  const fetchGoogleReviews = async () => {
    const placeId = profileData?.placeId;

    if (!placeId) {
      toast.error("Veuillez d’abord saisir votre identifiant Google Place.");
      return;
    }

    try {
      setUploadingFile(true);

      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=rating,reviews,userRatingCount&key=${
          import.meta.env.VITE_PLACE_API
        }`,
      );

      const data = await res.json();

      if (!data.reviews) {
        toast.error("Aucun avis trouvé ou identifiant Google Place invalide.");
        return;
      }

      const reviews = data.reviews.map((r) => ({
        authorName: r.authorAttribution?.displayName || "Unknown",
        profilePhotoUrl: r.authorAttribution?.photoUri || "",
        rating: r.rating,
        text: r.text?.text || "",
        time: r.publishTime,
      }));

      toast.success("Avis importés avec succès !");

      // Refresh profile
      await fetchProfile();
    } catch (err) {
      toast.error("Échec de la récupération des avis.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFetchReviews = async () => {
    const pid = profileData?.placeId;

    if (!pid) {
      toast.error("Veuillez d’abord saisir votre identifiant Google Place.");
      return;
    }

    try {
      setUploadingFile(true);

      const res = await fetch(
        `https://places.googleapis.com/v1/places/${pid}?fields=rating,reviews,userRatingCount&key=${
          import.meta.env.VITE_PLACE_API
        }`,
      );

      const data = await res.json();

      if (!data.reviews) {
        toast.error("Aucun avis trouvé ou identifiant Google Place invalide.");
        return;
      }

      const normalized = data.reviews.map((r: any) => ({
        id: r.name.split("/").pop(),
        rating: r.rating,
        comment: r.text?.text || "",
        author: r.authorAttribution?.displayName || "Anonymous",
        isAnonymous: !r.authorAttribution?.displayName,
        profileImage: r.authorAttribution?.photoUri
          ? `${r.authorAttribution.photoUri}=s96-c`
          : "",
        ratedAt: r.publishTime,
      }));

      setGoogleReviews(normalized);
      toast.success("Avis récupérés avec succès");
    } catch {
      toast.error("Échec de la récupération des avis Google");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleImportSelectedReviews = async () => {
    setimportLoading(true);
    if (!selectedReviews.length) {
      toast.error("Sélectionnez au moins un avis");
      return;
    }

    try {
      const payload = {
        businessId: profileData?.id,
        reviews: googleReviews
          .filter((r) => selectedReviews.includes(r.id))
          .map((r) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            isAnonymous: r.isAnonymous,
            name: r.author,
            profileImage: r.profileImage,
            ratedAt: r.ratedAt,
          })),
      };

      await postRequest(`${PROVIDER.IMPORT}`, payload);

      toast.success("Les avis sélectionnés ont été importés avec succès");
      setSelectedReviews([]);
      await fetchDbReviews(dbPage);
    } catch {
      toast.error("Échec de l’importation des avis");
    }
    setimportLoading(false);
  };
  useEffect(() => {
    if (
      activeTab === "Avis" &&
      profileData?.placeId &&
      googleReviews.length === 0
    ) {
      handleFetchReviews();
    }
  }, [activeTab, profileData?.placeId]);

  const dbReviewMap = useMemo(() => {
    const map = new Map<string, any>();
    dbReviews.forEach((r) => {
      if (r.googleRatingId) {
        map.set(r.googleRatingId, r);
      }
    });
    return map;
  }, [dbReviews]);

  const handleRemoveReview = async (googleReviewIds: string[]) => {
    setDeleteLoading(true);
    try {
      await postRequest(PROVIDER.DELETE_REVIEW, {
        reviewId: googleReviewIds,
      });

      toast.success("Avis supprimé(s) avec succès");

      setDbReviews([]);

      // re-fetch from DB
      await fetchDbReviews(dbPage);
    } catch (err) {
      toast.error("Échec de la suppression des avis");
    }
    setDeleteLoading(false);
  };

  return (
    <div data-no-translate className="min-h-screen">
      <div className="mb-6 space-y-3">
        <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">
          Informations de l’entreprise
        </h1>
        <p className="text-gray-600 dark:text-neutral-300">
          Gérez les informations de votre entreprise
        </p>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="mt-10">
            <div className="flex p-2 bg-gray-100 dark:bg-darkmode rounded-lg overflow-x-auto">
              {["Information", "Images", "Vidéos", "Documents", "Avis"].map(
                (tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 p-2 text-center rounded-lg cursor-pointer font-medium capitalize ${
                      activeTab === tab
                        ? "bg-white text-secondary"
                        : "text-gray-500 hover:text-secondary"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            <div className="mt-5">
              {activeTab === "Information" && (
                <div className="space-y-6">
                  <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                    <div className="flex justify-between border-b border-gray-200 dark:border-neutral-700 pb-4">
                      <span className="text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-100">
                        Informations principales
                      </span>
                    </div>

                    <div>
                      <InputGroup
                        label="Nom de l'entreprise"
                        placeholder="Nom de votre entreprise"
                        error={errors.companyName}
                        inputProps={register("companyName")}
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                        Détails
                      </label>
                      <p className="text-gray-600 dark:text-neutral-400 text-sm mb-2">
                        Limite de 5000 caractères
                      </p>

                      <Controller
                        name="bio"
                        control={control}
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Décrivez votre activité..."
                            className={`bg-white dark:bg-neutral-800 rounded-lg ${
                              errors.bio ? "border border-red-500" : ""
                            }`}
                          />
                        )}
                      />

                      {errors.bio && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bio.message}
                        </p>
                      )}
                    </div>
                    <Controller
                      control={control}
                      name="categories"
                      render={({ field }) => (
                        <CustomSelect
                          label="Catégorie"
                          options={categoriesOptions}
                          isMulti
                          value={categoriesOptions.filter((opt) =>
                            field.value?.includes(opt.value),
                          )}
                          onChange={(values) =>
                            field.onChange(values.map((v: any) => v.value))
                          }
                          placeholder="Sélectionnez des catégories"
                          error={errors.categories?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                    <span className="text-xl font-semibold dark:text-neutral-100 block">
                      Coordonnées et localisation
                    </span>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block mb-1 text-mainclr dark:text-neutral-300">
                          Localisation 
                        </label>
                        <Autocomplete
                          apiKey={import.meta.env.VITE_PLACE_API}
                          defaultValue={watch("location")}
                          onPlaceSelected={handlePlaceSelect}
                          options={{ types: ["geocode"] }}
                          placeholder="Indiquez un lieu"
                          className="w-full px-3 py-3 border border-inputborder dark:border-neutral-700 rounded-lg dark:bg-neutral-800 dark:text-neutral-300"
                        />
                        {errors.location && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.location.message}
                          </p>
                        )}
                      </div>

                      <div className="flex-1">
                        <InputGroup
                          label="Département"
                          placeholder="Saisir le département"
                          error={errors.department}
                          inputProps={register("department")}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <InputGroup
                          label="Code postal"
                          placeholder="Saisir le code postal"
                          error={errors.postalCode}
                          inputProps={register("postalCode")}
                        />
                      </div>

                      <div className="flex-1">
                        <InputGroup
                          label="Numéro d'entreprise"
                          placeholder="Saisir le Numéro d'entreprise"
                          error={errors.phoneNumber}
                          inputProps={register("phoneNumber")}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <InputGroup
                          type="email"
                          label="E-mail"
                          placeholder="Saisir le E-mail"
                          error={errors.email}
                          inputProps={register("email")}
                        />
                      </div>
                      <div className="flex-1">
                        <InputGroup
                          label="URL du site web"
                          placeholder="Saisir le URL du site web"
                          error={errors.website}
                          inputProps={register("website")}
                        />
                      </div>
                    </div>

                    <div>
                      <InputGroup
                        label="Lien Instagram"
                        placeholder="https://instagram.com/..."
                        error={errors.instagramUrl}
                        inputProps={register("instagramUrl")}
                      />
                    </div>

                    <div>
                      <InputGroup
                        label="Lien Facebook"
                        placeholder="https://facebook.com/..."
                        error={errors.facebookUrl}
                        inputProps={register("facebookUrl")}
                      />
                    </div>
                    <div>
                      <InputGroup
                        label="Lien Youtube"
                        placeholder="https://youtube.com/..."
                        error={errors.youtubeUrl}
                        inputProps={register("youtubeUrl")}
                      />
                    </div>

                    <div>
                      <InputGroup
                        label="Lien LinkedIn"
                        placeholder="https://linkedin.com/..."
                        error={errors.linkedinUrl}
                        inputProps={register("linkedinUrl")}
                      />
                    </div>

                    <div>
                      <InputGroup
                        label="Lien X (Twitter)"
                        placeholder="https://X.com/..."
                        error={errors.twitterUrl}
                        inputProps={register("twitterUrl")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Images" && (
                <div className="bg-white dark:bg-darkmode p-4 rounded-2xl space-y-4">
                  <div className="flex justify-between border-b border-gray-200 dark:border-neutral-700 pb-4">
                    <div>
                      <span className="text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-100">
                        Images
                      </span>
                      <p className="text-gray-600 dark:text-neutral-400 text-sm">
                        Téléversez vos meilleures réalisations. La première
                        image sera votre image de couverture.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Controller
                      control={control}
                      name="portfolio"
                      render={({ field }) => (
                        <FileDropzone
                          value={field.value}
                          onChange={field.onChange}
                          maxFiles={10}
                          accept={{ "image/*": [] }}
                          previews={watch("portfolioUrls")}
                          onRemoveExisting={(url) => {
                            const newUrls = watch("portfolioUrls").filter(
                              (x) => x !== url,
                            );
                            setValue("portfolioUrls", newUrls, {
                              shouldDirty: true,
                            });
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              )}

              {activeTab === "Vidéos" && (
                <div className="bg-white dark:bg-darkmode p-4 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start justify-between border-b border-gray-200 dark:border-neutral-700 pb-4">
                    <div>
                      <span className="text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-100">
                        Vidéos de présentation
                      </span>
                      <p className="text-gray-600 dark:text-neutral-400 text-sm">
                        Ajoutez des vidéos depuis YouTube, Vimeo ou
                        téléversez-les directement.{" "}
                      </p>
                    </div>

                    <>
                      <input
                        id="videofileinput"
                        type="file"
                        accept="video/*"
                        hidden
                        onChange={(e) =>
                          e.target.files &&
                          uploadBusinessFile(e.target.files[0], "video")
                        }
                      />
                      <Button
                        size="medium"
                        disabled={uploadingFile}
                        onClick={() =>
                          document.getElementById("videofileinput")?.click()
                        }
                      >
                        <Upload size={18} className="mr-2" />
                        {uploadingFile
                          ? "Téléchargement en cours..."
                          : "Télécharger une vidéo"}
                      </Button>
                    </>
                  </div>

                  <div className="bg-gray-100 dark:bg-neutral-900 p-4 rounded-lg">
                    <span className="text-base font-medium block mb-3 capitalize dark:text-neutral-300">
                      Ajouter depuis une URL (YouTube, Vimeo)
                    </span>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <InputGroup
                        type="text"
                        placeholder="Entrez l’URL"
                        className="bg-white"
                        defaultValue={videoUrlInput}
                        onChange={(e) => setVideoUrlInput(e.target.value)}
                      />

                      <InputGroup
                        type="text"
                        placeholder="Titre de la vidéo (facultatif)"
                        className="bg-white"
                        value={videoTitleInput}
                        onChange={(e) => setVideoTitleInput(e.target.value)}
                      />

                      <Button
                        loading={loadingBusiness}
                        size="medium"
                        onClick={addVideoFromUrl}
                      >
                        <Plus size={18} />
                        Ajouter
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                      {videos.map((vid) => (
                        <div
                          key={vid.id}
                          className="bg-white rounded-lg p-2 relative"
                        >
                          <button
                            className="absolute z-10 right-3 top-3 bg-white dark:bg-darkmode cursor-pointer w-7 h-7 rounded-md flex justify-center items-center group"
                            onClick={() => deleteBusinessFile(vid.id, "video")}
                          >
                            <Trash2 size={16} className="text-red-500" />
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                              Delete
                            </span>
                          </button>
                          {(() => {
                            const rawUrl = vid.url;
                            const url = rawUrl?.toLowerCase() || "";
                            const isDirectVideo =
                              url.endsWith(".mp4") ||
                              url.endsWith(".mov") ||
                              url.endsWith(".webm") ||
                              url.endsWith(".mkv") ||
                              url.endsWith(".avi") ||
                              url.endsWith(".m4v");

                            if (isDirectVideo) {
                              return (
                                <video
                                  controls
                                  src={rawUrl}
                                  className="w-full h-40 rounded-lg"
                                />
                              );
                            }

                            // 2. YouTube auto-embed conversion
                            if (url.includes("youtube.com/watch?v=")) {
                              const videoId = rawUrl
                                .split("v=")[1]
                                ?.split("&")[0];
                              const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                              return (
                                <iframe
                                  src={embedUrl}
                                  className="w-full h-40 rounded-lg"
                                  allow="autoplay; encrypted-media; picture-in-picture"
                                  allowFullScreen
                                />
                              );
                            }

                            if (url.includes("youtu.be/")) {
                              const videoId = rawUrl
                                .split("youtu.be/")[1]
                                ?.split("?")[0];
                              const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                              return (
                                <iframe
                                  src={embedUrl}
                                  className="w-full h-40 rounded-lg"
                                  allow="autoplay; encrypted-media; picture-in-picture"
                                  allowFullScreen
                                />
                              );
                            }

                            // 3. Vimeo
                            if (url.includes("vimeo.com")) {
                              const videoId = rawUrl.split("vimeo.com/")[1];
                              const embedUrl = `https://player.vimeo.com/video/${videoId}`;
                              return (
                                <iframe
                                  src={embedUrl}
                                  className="w-full h-40 rounded-lg"
                                  allow="autoplay; encrypted-media; picture-in-picture"
                                  allowFullScreen
                                />
                              );
                            }

                            return (
                              <iframe
                                src={rawUrl}
                                className="w-full h-40 rounded-lg"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                              />
                            );
                          })()}

                          <span className="text-sm text-gray-600 block truncate mt-2">
                            {vid.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Documents" && (
                <div className="bg-white dark:bg-darkmode p-4 rounded-2xl space-y-4">
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <div>
                      <span className="text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-100">
                        Documents et brochures
                      </span>
                      <p className="text-gray-600 dark:text-neutral-400 text-sm">
                        Partagez vos brochures, menus ou autres documents PDF
                        utiles avec vos clients.
                      </p>
                    </div>

                    <>
                      <input
                        id="docfileinput"
                        type="file"
                        accept="application/pdf"
                        hidden
                        onChange={(e) =>
                          e.target.files &&
                          uploadBusinessFile(e.target.files[0], "document")
                        }
                      />
                      <Button
                        size="medium"
                        disabled={uploadingFile}
                        onClick={() =>
                          document.getElementById("docfileinput")?.click()
                        }
                      >
                        <Upload size={18} className="mr-2" />
                        {uploadingFile
                          ? "Téléchargement en cours..."
                          : "Télécharger un PDF"}
                      </Button>
                    </>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex gap-3 items-center justify-between p-5 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1 truncate">
                          <FileText
                            size={20}
                            className="text-red-500 shrink-0"
                          />
                          <a
                            href={doc.url}
                            target="_blank"
                            className="text-gray-700 truncate max-w-11/12"
                          >
                            {doc.name}
                          </a>
                        </div>

                        <button
                          onClick={() => deleteBusinessFile(doc.id, "document")}
                          className="relative group cursor-pointer shrink-0"
                        >
                          <Trash2 size={18} className="text-red-500" />
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-full text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                            Supprimer
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "Avis" && (
                <div className="bg-white dark:bg-darkmode p-4 rounded-2xl space-y-4">
                  {/* HEADER */}
                  <div className="flex justify-between border-b border-gray-200 pb-4">
                    <div>
                      <span className="text-xl heading-font font-bold dark:text-neutral-300">
                        Avis Google
                      </span>
                      <p className="text-gray-600 text-sm">
                        Connectez votre page Google My Business pour importer
                        automatiquement vos avis.
                      </p>
                    </div>
                  </div>

                  {/* CASE 1️⃣ — PLACE ID NOT SAVED */}
                  {/* {!profileData?.placeId && ( */}
                  <>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-3">
                      <h3 className="text-lg font-semibold text-blue-700">
                        Comment trouver votre Google Place ID ?
                      </h3>

                      <ol className="list-decimal list-inside text-gray-700 space-y-2">
                        <li>Ouvrez Google Maps.</li>
                        <li>
                          Recherchez <strong>le nom de votre entreprise</strong>{" "}
                          .
                        </li>
                        <li>
                          Cliquez sur votre entreprise pour ouvrir sa fiche.
                        </li>
                        <li>
                          Faites défiler la page pour trouver :
                          <br />
                          <code className="bg-gray-200 px-2 py-1 rounded">
                            identifiant de lieu: ChIJxxxxxxxxxxxxxxxx
                          </code>
                        </li>
                        <li>Copiez et collez le Place ID ci-dessous.</li>
                      </ol>

                      <p className="text-gray-700">
                        Ou utilisez l’outil officiel de Google :{" "}
                        <a
                          href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder"
                          className="text-blue-600 underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Cliquez ici pour trouver votre Place ID
                        </a>
                      </p>

                      <p className="text-sm text-gray-600">
                        ⚠ Un Place ID ne commence JAMAIS par{" "}
                        <code className="bg-gray-200 px-1 py-0.5 rounded">
                          AIza
                        </code>{" "}
                        — il s’agit de votre clé API Google.
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                      <p className="text-sm text-blue-700">
                        Veuillez saisir votre Google Place ID pour récupérer les
                        avis.
                      </p>
                    </div>

                    <div>
                      <label className="block font-medium mb-2 dark:text-neutral-300">
                        ID de lieu Google
                      </label>

                      <input
                        type="text"
                        className="w-full px-3 py-3 border rounded-lg dark:bg-inputdarkbg dark:text-neutral-300"
                        placeholder="ChIJxxxxxxxxxxxxxxxx"
                        defaultValue={watch("placeId")}
                        {...register("placeId")}
                        onChange={(e) => {
                          setValue("placeId", e.target.value, {
                            shouldDirty: true,
                            shouldTouch: true,
                          });

                          setProfileData((prev) => ({
                            ...prev,
                            placeId: e.target.value,
                          }));
                        }}
                      />

                      <p className="text-xs text-gray-500 mt-2">
                        Enregistrez votre profil pour importer automatiquement
                        les avis.
                      </p>
                    </div>
                  </>
                  {/* )} */}

                  {/* CASE 2️⃣ — PLACE ID EXISTS */}
                  {/* GOOGLE REVIEWS (NOT YET IMPORTED) */}
                  {googleReviews.length > 0 && (
                    <div>
                      <div className="space-y-4">
                        {googleReviews.map((rev) => {
                          const alreadyImported = dbReviewMap.has(rev.id);
                          const dbReview = dbReviewMap.get(rev.id);
                          const avatarColors = [
                            "bg-red-500",
                            "bg-blue-500",
                            "bg-green-500",
                            "bg-purple-500",
                            "bg-pink-500",
                            "bg-orange-500",
                            "bg-teal-500",
                          ];

                          const avatarColor =
                            avatarColors[
                              (rev?.author?.charCodeAt(0) || 0) %
                                avatarColors.length
                            ];
                          return (
                            <div
                              key={rev.id}
                              className="flex items-start gap-3 p-4 border border-light rounded-lg bg-white dark:bg-darkmode"
                            >
                              {/* REVIEW CONTENT */}
                              <div className="flex gap-3 dark:text-neutral-300">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${avatarColor}`}
                                >
                                  <span className="text-sm font-semibold text-white uppercase">
                                    {rev?.author?.charAt(0) || "U"}
                                  </span>
                                </div>

                                <div>
                                  <p className="font-semibold">
                                    ⭐ {rev.rating}/5 — {rev.author}
                                  </p>
                                  <p className="text-gray-600 text-sm mt-1">
                                    {rev.comment}
                                  </p>

                                  {alreadyImported && (
                                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                                      Déjà importé
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* LEFT ACTION */}
                              {!alreadyImported ? (
                                <input
                                  type="checkbox"
                                  className="w-10 h-10"
                                  checked={selectedReviews.includes(rev.id)}
                                  onChange={(e) =>
                                    setSelectedReviews((prev) =>
                                      e.target.checked
                                        ? [...prev, rev.id]
                                        : prev.filter((id) => id !== rev.id),
                                    )
                                  }
                                />
                              ) : (
                                <Button
                                  size="small"
                                  variant="outline"
                                  loading={deleteLoading}
                                  onClick={() => {
                                    handleRemoveReview([
                                      dbReview.googleRatingId,
                                    ]);
                                  }}
                                >
                                  Supprimer
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* IMPORT BUTTON */}
                      <div className="flex justify-end mt-6">
                        <Button
                          loading={importLoading}
                          disabled={!selectedReviews.length}
                          onClick={handleImportSelectedReviews}
                        >
                          Importer les avis sélectionnés
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            size="medium"
            variant="primary"
            className="disabled:opacity-60"
            // disabled={isSubmitting || imgUploading || !isDirty}
          >
            {isSubmitting
              ? "Enregistrement en cours..."
              : "Enregistrer ma vitrine"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Businessinfo;
