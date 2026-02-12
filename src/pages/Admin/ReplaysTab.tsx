import { Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { uploadFile } from "../../utils/uploadfile";
import { useToast } from "../../utils/toast";
import Button from "../../components/ui/Button";
import { BUNNY_LIBRARY_ID, uploadVideoToBunny } from "../../utils/common/bunny";
import DataTable from "../../components/ui/Datatable";
import OuterModal from "../../components/Custommodal/OuterModal";
import InputGroup from "../../components/ui-main/InputGroup";
import CustomSelect from "../../components/ui-main/selectBox";
import FileDropzone from "../../components/imageUpload";

const SAMPLE_FILE_PATH = "/mnt/data/3c70ae1b-763d-4295-bf7a-7286f8f8a73e.png";

const Replays_level = [
  { value: true, label: "Gratuit" },
  { value: false, label: "Payant" },
];

const StatusOptions = [
  { value: "draft", label: "Draft" },
  { value: "uploading", label: "Téléchargement en cours" },
  { value: "processing", label: "Traitement en cours" },
  { value: "published", label: "Publié" },
];

const replaySchema = Yup.object().shape({
  title: Yup.string().required("Le titre est requis"),
  category: Yup.string().required("La catégorie est requise"),
  excerpt: Yup.string().required("L’extrait est requis"),
  content: Yup.string().required("Le contenu est requis"),
  duration: Yup.number()
    .typeError("La durée doit être un nombre")
    .positive("La durée doit être positive")
    .required("La durée est requise"),
  access: Yup.boolean().required("L’accès est requis"),
  status: Yup.string()
    .oneOf(["draft", "uploading", "processing", "published"])
    .required("Le statut est requis"),
});

type ReplayFormValues = Yup.InferType<typeof replaySchema>;

const ATTACHMENT_ACCEPT = {
  "application/pdf": [],
  "application/zip": [],
  "application/x-zip-compressed": [],
  "application/msword": [],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
};

const ReplaysTab = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createAttachmentFiles, setCreateAttachmentFiles] = useState<File[]>(
    [],
  );
  const [createAttachmentUrls, setCreateAttachmentUrls] = useState<string[]>(
    [],
  );

  const [editAttachmentFiles, setEditAttachmentFiles] = useState<File[]>([]);
  const [editAttachmentUrls, setEditAttachmentUrls] = useState<string[]>([]);

  const [attachmentProgress, setAttachmentProgress] = useState(0);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const [createThumbFiles, setCreateThumbFiles] = useState<File[]>([]);
  const [createVideoFiles, setCreateVideoFiles] = useState<File[]>([]);

  const [editThumbPreviews, setEditThumbPreviews] = useState<string[]>([]);
  const [editVideoPreviews, setEditVideoPreviews] = useState<string[]>([]);
  const [editThumbFiles, setEditThumbFiles] = useState<File[]>([]);
  const [editVideoFiles, setEditVideoFiles] = useState<File[]>([]);

  const [videos, setVideos] = useState<any[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosPage, setVideosPage] = useState(1);
  const [videosLimit, setVideosLimit] = useState(10);
  const [videosTotal, setVideosTotal] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);

  const toast = useToast();

  const devPreviews =
    import.meta.env.NODE_ENV === "development" ? [SAMPLE_FILE_PATH] : [];

  // ===== REPLAY LIST FETCH =====
  const fetchVideos = async (page = 1, limit = 10) => {
    try {
      setVideosLoading(true);
      const res = await getRequest(PROVIDER.trainingVIDEOS_ALL, {
        params: { page, limit },
      });

      if (res?.data?.data?.videos) {
        setVideos(res.data.data.videos);
        setVideosPage(res.data.data.page ?? page);
        setVideosLimit(res.data.data.limit ?? limit);
        setVideosTotal(res.data.data.total ?? res.data.data.videos.length ?? 0);
      } else {
        setVideos([]);
        setVideosTotal(0);
      }
    } catch (err) {
      console.error("Failed to fetch training videos", err);
      setVideos([]);
      setVideosTotal(0);
    } finally {
      setVideosLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(1, videosLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== TABLE COLUMNS =====
  const columns = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "title", label: "Titre" },
      { key: "category", label: "Catégorie" },
      { key: "lengthSeconds", label: "Durée (s)" },
      {
        key: "isFreeAccess",
        label: "Accès",
        render: (item: any) => (item.isFreeAccess ? "Gratuit" : "Payant"),
      },
      {
        key: "status",
        label: "Statut",
        render: (item: any) =>
          item.status
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : "—",
      },
      {
        key: "bunnyVideoId",
        label: "Vidéo",
        render: (item: any) =>
          item.bunnyVideoId ? (
            <a
              href={`https://iframe.mediadelivery.net/embed/${item.bunnyLibraryId}/${item.bunnyVideoId}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Lire
            </a>
          ) : (
            "—"
          ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (item: any) => (
          <div className="flex gap-2">
            <Button
              size="small"
              variant="outline"
              onClick={() => {
                setEditingItem(item);
                setEditThumbPreviews(item.thumbnail ? [item.thumbnail] : []);
                setEditVideoPreviews(
                  item.bunnyStorageUrl ? [item.bunnyStorageUrl] : [],
                );
                setEditThumbFiles([]);
                setEditVideoFiles([]);
                setUploadProgress(0);
                setEditModal(true);
                setEditAttachmentUrls(
                  Array.isArray(item.attachments)
                    ? item.attachments
                    : item.attachmentUrl
                      ? [item.attachmentUrl]
                      : [],
                );
                setEditAttachmentFiles([]);
              }}
            >
              Modifier
            </Button>

            <Button
              variant="danger"
              size="small"
              onClick={() => {
                setDeleteTarget(item);
                setDeleteModalOpen(true);
              }}
            >
              Supprimer
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  // ===== RHF ADD =====
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReplayFormValues>({
    resolver: yupResolver(replaySchema),
    defaultValues: {
      title: "",
      category: "",
      excerpt: "",
      content: "",
      duration: "" as any,
      access: true,
      status: "published",
    },
  });

  // ===== RHF EDIT =====
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: editErrors },
  } = useForm<ReplayFormValues>({
    resolver: yupResolver(replaySchema),
    defaultValues: {
      title: "",
      category: "",
      excerpt: "",
      content: "",
      duration: "" as any,
      access: true,
      status: "published",
    },
  });

  const openCreateModal = () => {
    reset({
      title: "",
      category: "",
      excerpt: "",
      content: "",
      duration: "" as any,
      access: true,
      status: "published",
    });
    setCreateThumbFiles([]);
    setCreateVideoFiles([]);
    setCreateAttachmentFiles([]);
    setAttachmentProgress(0);
    setUploadingAttachment(false);
    setUploadProgress(0);
    setOpenModal(true);
  };

  const onSubmitReplay = async (values: ReplayFormValues) => {
    setBtnLoading(true);
    try {
      if (createVideoFiles.length === 0) {
        toast.error("Veuillez télécharger un fichier vidéo");
        setBtnLoading(false);
        return;
      }

      let thumbnailUrl = "";
      if (createThumbFiles.length > 0) {
        const thumbRes = await uploadFile(createThumbFiles[0]);
        thumbnailUrl = thumbRes.url;
      }

      const videoFile = createVideoFiles[0];
      const uploadRes = await uploadVideoToBunny(videoFile, (pct) =>
        setUploadProgress(pct),
      );

      const attachmentUrls: string[] = [];

      if (createAttachmentFiles.length > 0) {
        setUploadingAttachment(true);
        setAttachmentProgress(0);

        for (const file of createAttachmentFiles) {
          const res = await uploadFile(file, (p) => setAttachmentProgress(p));
          attachmentUrls.push(res.url);
        }

        setUploadingAttachment(false);
        setAttachmentProgress(0);
      }

      const payload = {
        title: values.title,
        category: values.category,
        excerpt: values.excerpt,
        content: values.content,
        lengthSeconds: Number(values.duration),
        isFreeAccess: values.access,
        thumbnail: thumbnailUrl || "",
        bunnyVideoId: uploadRes.videoId,
        bunnyLibraryId: BUNNY_LIBRARY_ID.toString(),
        bunnyStorageUrl: uploadRes.videoUrl,
        status: values.status || "published",
        attachments: attachmentUrls,
      };

      await postRequest(PROVIDER.TRAINING_ADD_VIDEO, payload);
      toast.success("Replay créé avec succès");

      reset();
      setCreateThumbFiles([]);
      setCreateVideoFiles([]);
      setCreateAttachmentFiles([]);
      setCreateAttachmentUrls([]);
      setUploadProgress(0);
      setOpenModal(false);
      fetchVideos(1, videosLimit);
    } catch (err) {
      console.error("Error creating replay:", err);
      toast.error("Échec de la création du replay");
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    if (editingItem) {
      setValueEdit("title", editingItem.title || "");
      setValueEdit("category", editingItem.category || "");
      setValueEdit("excerpt", editingItem.excerpt || "");
      setValueEdit("content", editingItem.content || "");
      setValueEdit(
        "duration",
        editingItem.lengthSeconds != null ? editingItem.lengthSeconds : "",
      );
      setValueEdit("access", editingItem.isFreeAccess ?? true);
      setValueEdit("status", editingItem.status || "published");
    } else {
      resetEdit();
      setEditThumbPreviews([]);
      setEditVideoPreviews([]);
      setEditThumbFiles([]);
      setEditVideoFiles([]);
      setUploadProgress(0);
    }
  }, [editingItem, resetEdit, setValueEdit]);

  const onSubmitEditReplay = async (values: ReplayFormValues) => {
    setBtnLoading(true);
    if (!editingItem) return;

    try {
      let thumbnailUrl = editingItem.thumbnail || "";
      let finalVideoUrl = editingItem.bunnyStorageUrl || "";
      let finalVideoId = editingItem.bunnyVideoId || "";

      if (editThumbFiles.length > 0) {
        const thumbRes = await uploadFile(editThumbFiles[0]);
        thumbnailUrl = thumbRes.url;
      }

      if (editVideoFiles.length > 0) {
        const videoFile = editVideoFiles[0];
        const uploadRes = await uploadVideoToBunny(videoFile, (pct) =>
          setUploadProgress(pct),
        );
        finalVideoUrl = uploadRes.videoUrl;
        finalVideoId = uploadRes.videoId;
      }

      const finalAttachmentUrls = [...editAttachmentUrls];

      if (editAttachmentFiles.length > 0) {
        setUploadingAttachment(true);
        setAttachmentProgress(0);

        for (const file of editAttachmentFiles) {
          const res = await uploadFile(file, (p) => setAttachmentProgress(p));
          finalAttachmentUrls.push(res.url);
        }

        setUploadingAttachment(false);
        setAttachmentProgress(0);
      }

      const payload = {
        id: editingItem.id,
        title: values.title,
        category: values.category,
        excerpt: values.excerpt,
        content: values.content,
        lengthSeconds: Number(values.duration),
        isFreeAccess: values.access,
        thumbnail: thumbnailUrl,
        bunnyVideoId: finalVideoId,
        bunnyLibraryId: BUNNY_LIBRARY_ID.toString(),
        bunnyStorageUrl: finalVideoUrl,
        status: values.status || "published",
        attachments: finalAttachmentUrls,
      };

      await patchRequest(
        `${PROVIDER.TRAINING_ADD_VIDEO}/${editingItem.id}`,
        payload,
      );
      toast.success("Replay mis à jour avec succès");

      resetEdit();
      setEditThumbFiles([]);
      setEditVideoFiles([]);
      setEditThumbPreviews([]);
      setEditVideoPreviews([]);
      setEditAttachmentFiles([]);
      setEditAttachmentUrls([]);
      setUploadProgress(0);
      setEditModal(false);
      setEditingItem(null);
      fetchVideos(1, videosLimit);
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("Échec de la mise à jour du replay");
    }
    setBtnLoading(false);
  };

  // ===== DELETE =====
  const handleConfirmDelete = async () => {
    setBtnLoading(true);
    if (!deleteTarget) {
      setDeleteModalOpen(false);
      setBtnLoading(false);
      return;
    }

    try {
      await deleteRequest(`${PROVIDER.DELETE_VIDEO_REPLAY}/${deleteTarget.id}`);
      toast.success("Replay supprimé avec succès");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      fetchVideos(1, videosLimit);
    } catch (err) {
      toast.error("Échec de la suppression");
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
    setBtnLoading(false);
  };

  const handleRemoveExistingEditThumbnail = () => {
    setEditThumbPreviews([]);
  };
  const handleRemoveExistingEditVideo = () => {
    setEditVideoPreviews([]);
  };

  return (
    <>
      {/* LIST + ADD BUTTON */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <h3 className="text-xl font-semibold dark:text-neutral-100 mb-0">
            Rediffusions
          </h3>
          <Button size="medium" onClick={openCreateModal}>
            <Plus size={20} /> Ajouter une rediffusion
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={videos}
          loading={videosLoading}
          skeletonRows={3}
          total={videosTotal}
          page={videosPage}
          limit={videosLimit}
          onPageChange={(p) => fetchVideos(p, videosLimit)}
          emptyText="Aucun replay trouvé"
        />
      </div>

      {/* ADD MODAL */}

      <OuterModal active={openModal} setActive={setOpenModal}>
        <div className="w-full max-w-3xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <button
            className="absolute top-4 right-4 cursor-pointer"
            aria-label="Fermer la fenêtre des rediffusions"
          >
            <X
              className="dark:text-neutral-300"
              onClick={() => setOpenModal(false)}
            />
          </button>

          <h2 className="text-2xl font-bold mb-6 dark:text-neutral-100">
            Ajouter des replays
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmitReplay)}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <InputGroup
                  type="text"
                  label="Titre"
                  placeholder="Saisir le titre"
                  inputProps={register("title")}
                  error={errors.title}
                />
              </div>
              <div className="flex-1">
                <InputGroup
                  type="text"
                  label="Catégorie"
                  placeholder="Saisir la catégorie"
                  inputProps={register("category")}
                  error={errors.category}
                />
              </div>
            </div>
            <div>
              <InputGroup
                label="Extrait"
                type="textarea"
                placeholder="Rédiger une courte description"
                inputProps={register("excerpt")}
                error={errors.excerpt}
              />
            </div>

            <div>
              <InputGroup
                label="Contenu"
                type="textarea"
                placeholder="Saisir le contenu"
                inputProps={register("content")}
                error={errors.content}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <InputGroup
                  label="Durée (secondes)"
                  type="number"
                  placeholder="Saisir la durée en secondes"
                  inputProps={register("duration")}
                  error={errors.duration}
                />
              </div>

              <div className="flex-1">
                <Controller
                  control={control}
                  name="access"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      label="Accès"
                      options={Replays_level}
                      value={
                        Replays_level.find((r) => r.value === value) || null
                      }
                      onChange={(opt: any) => onChange(opt?.value ?? true)}
                      placeholder="Sélectionner l’accès"
                      className="min-w-60 !z-50"
                    />
                  )}
                />
                {errors.access && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.access.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <Controller
                  control={control}
                  name="status"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      label="Statut"
                      options={StatusOptions}
                      value={
                        StatusOptions.find((s) => s.value === value) || null
                      }
                      onChange={(opt: any) =>
                        onChange(opt?.value ?? "published")
                      }
                      placeholder="Sélectionner le statut"
                      className="min-w-60 !z-50"
                    />
                  )}
                />
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            {/* Thumbnail upload */}
            <div>
              <div className="mb-2 text-sm font-medium dark:text-neutral-300">
                Vignette
              </div>
              <FileDropzone
                value={createThumbFiles}
                onChange={setCreateThumbFiles}
                accept={{ "image/*": [] }}
                maxFiles={1}
                previews={
                  import.meta.env.NODE_ENV === "development" &&
                  createThumbFiles.length === 0
                    ? devPreviews
                    : []
                }
                helperText="Upload thumbnail image"
                name="thumbnail"
              />
            </div>

            {/* Video upload */}
            <div>
              <div className="mb-2 text-sm font-medium dark:text-neutral-300">
                Fichier vidéo
              </div>
              <FileDropzone
                value={createVideoFiles}
                onChange={setCreateVideoFiles}
                accept={{ "video/*": [] }}
                maxFiles={1}
                previews={
                  import.meta.env.NODE_ENV === "development" &&
                  createVideoFiles.length === 0
                    ? devPreviews
                    : []
                }
                helperText="Upload video file"
                name="video"
              />
            </div>

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-md h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-md"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}

            {/* Attachment upload */}
            <div>
              <div className="mb-2 text-sm font-medium dark:text-neutral-300">
                Pièce jointe (facultative – ZIP / PDF / DOC)
              </div>

              <FileDropzone
                value={createAttachmentFiles}
                onChange={setCreateAttachmentFiles}
                accept={ATTACHMENT_ACCEPT}
                maxFiles={5}
                helperText="Optional attachments (ZIP / PDF / DOC)"
                name="replay-attachments"
              />
              {uploadingAttachment && (
                <div className="w-full mt-2">
                  <div className="h-2 bg-gray-200 rounded-md overflow-hidden">
                    {/* <div
                      className="h-2 bg-green-500 transition-all"
                      style={{ width: `${Math.max(attachmentProgress, 5)}%` }}
                    /> */}
                  </div>
                  <p className="text-xs mt-1 dark:text-neutral-300">
                    Téléchargement de la pièce jointe…
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-between mt-7">
              <Button
                className="flex-1"
                variant="outline"
                type="button"
                onClick={() => {
                  reset();
                  setOpenModal(false);
                  setCreateThumbFiles([]);
                  setCreateVideoFiles([]);
                  setUploadProgress(0);
                }}
              >
                Annuler
              </Button>
              <Button loading={btnLoading} className="flex-1" type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>

      {/* EDIT MODAL */}

      <OuterModal active={editModal} setActive={setEditModal}>
        <div className="w-full max-w-3xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <button
            className="absolute top-4 right-4 cursor-pointer"
            role="Fermer la fenêtre des rediffusions"
          >
            <X
              className="dark:text-neutral-300"
              onClick={() => {
                setEditModal(false);
                setEditingItem(null);
                resetEdit();
                setEditThumbFiles([]);
                setEditVideoFiles([]);
                setUploadProgress(0);
              }}
            />
          </button>
          <h2 className="text-2xl font-bold mb-6 dark:text-neutral-300">
            Modifier le rediffusions
          </h2>

          <form
            className="space-y-4"
            onSubmit={handleSubmitEdit(onSubmitEditReplay)}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <InputGroup
                  type="text"
                  label="Titre"
                  placeholder="Saisir le titre"
                  inputProps={registerEdit("title")}
                  error={editErrors.title}
                />
              </div>
              <div className="flex-1">
                <InputGroup
                  type="text"
                  label="Catégorie"
                  placeholder="Saisir la catégorie"
                  inputProps={registerEdit("category")}
                  error={editErrors.category}
                />
              </div>
            </div>

            <InputGroup
              label="Extrait"
              type="textarea"
              placeholder="Rédiger une courte description"
              inputProps={registerEdit("excerpt")}
              error={editErrors.excerpt}
            />

            <InputGroup
              label="Contenu"
              type="textarea"
              placeholder="Saisir la durée en secondes"
              inputProps={registerEdit("content")}
              error={editErrors.content}
            />

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <InputGroup
                  label="Durée (secondes)"
                  type="number"
                  placeholder="Saisir la durée en secondes"
                  inputProps={registerEdit("duration")}
                  error={editErrors.duration}
                />
              </div>

              <div className="flex-1">
                <Controller
                  control={controlEdit}
                  name="access"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      label="Accès"
                      options={Replays_level}
                      value={
                        Replays_level.find((r) => r.value === value) || null
                      }
                      onChange={(opt: any) => onChange(opt?.value ?? true)}
                      placeholder="Sélectionner l’accès"
                      className="min-w-60 !z-50"
                    />
                  )}
                />
                {editErrors.access && (
                  <p className="text-red-500 text-sm mt-1">
                    {editErrors.access.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <Controller
                  control={controlEdit}
                  name="status"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      label="Statut"
                      options={StatusOptions}
                      value={
                        StatusOptions.find((s) => s.value === value) || null
                      }
                      onChange={(opt: any) =>
                        onChange(opt?.value ?? "published")
                      }
                      placeholder="Sélectionner le statut"
                      className="min-w-60 !z-50"
                    />
                  )}
                />
                {editErrors.status && (
                  <p className="text-red-500 text-sm mt-1">
                    {editErrors.status.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-medium dark:text-neutral-300">
                Vignette (aperçu existant affiché ci-dessous)
              </div>
              <FileDropzone
                value={editThumbFiles}
                onChange={setEditThumbFiles}
                accept={{ "image/*": [] }}
                maxFiles={1}
                previews={editThumbPreviews}
                onRemoveExisting={handleRemoveExistingEditThumbnail}
                helperText="Remplacer la miniature ou supprimer celle existante"
                name="edit-thumbnail"
              />
            </div>

            <div>
              <div className="mb-2 text-sm font-medium dark:text-neutral-300">
                Vidéo (aperçu existant affiché ci-dessous)
              </div>
              <FileDropzone
                value={editVideoFiles}
                onChange={setEditVideoFiles}
                accept={{ "video/*": [] }}
                maxFiles={1}
                previews={editVideoPreviews}
                onRemoveExisting={handleRemoveExistingEditVideo}
                helperText="Remplacer la vidéo ou supprimer celle existante"
                name="edit-video"
              />
            </div>

            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-md h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-md"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            <div>
              <div className="mb-2 text-sm font-medium dark:text-neutral-300">
                Pièce jointe (facultative)
              </div>
              <FileDropzone
                value={editAttachmentFiles}
                onChange={setEditAttachmentFiles}
                accept={ATTACHMENT_ACCEPT}
                maxFiles={5}
                previews={editAttachmentUrls}
                onRemoveExisting={(url) =>
                  setEditAttachmentUrls((prev) => prev.filter((u) => u !== url))
                }
                helperText="Remplacer, ajouter ou supprimer des pièces jointes"
                name="edit-replay-attachments"
              />

              {uploadingAttachment && (
                <div className="w-full mt-2">
                  <div className="h-2 bg-gray-200 rounded-md overflow-hidden">
                    <div
                      className="h-2 bg-blue-500 transition-all"
                      style={{ width: `${Math.max(attachmentProgress, 5)}%` }}
                    />
                  </div>
                  <p className="text-xs mt-1 dark:text-neutral-300">
                    Téléchargement de la pièce jointe… {attachmentProgress}%
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-between mt-7">
              <Button
                className="flex-1"
                variant="outline"
                type="button"
                onClick={() => {
                  resetEdit();
                  setEditModal(false);
                  setEditingItem(null);
                  setEditThumbFiles([]);
                  setEditVideoFiles([]);
                  setEditThumbPreviews([]);
                  setEditVideoPreviews([]);
                  setUploadProgress(0);
                }}
              >
                Annuler
              </Button>
              <Button loading={btnLoading} className="flex-1" type="submit">
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>

      {/* DELETE MODAL */}
      <OuterModal active={deleteModalOpen} setActive={setDeleteModalOpen}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <div className="mb-6 text-center space-y-6">
            <h2 className="text-2xl text-center font-semibold mb-0 dark:text-neutral-100">
              Supprimer la rediffusion
            </h2>
            <p className="text-gray-600 dark:text-neutral-300">
              Êtes-vous sûr de vouloir supprimer le rediffusion {" "}
              <strong>{deleteTarget?.title}</strong> (ID: {deleteTarget?.id})?
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setDeleteTarget(null);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={btnLoading}
              onClick={handleConfirmDelete}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default ReplaysTab;
