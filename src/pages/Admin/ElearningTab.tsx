import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import OuterModal from "../../components/Custommodal/OuterModal";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/Datatable";
import InputGroup from "../../components/ui-main/InputGroup";
import CustomSelect from "../../components/ui-main/selectBox";
import FileDropzone from "../../components/imageUpload";

import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { uploadFile } from "../../utils/uploadfile";
import { useToast } from "../../utils/toast";
import { BUNNY_LIBRARY_ID, uploadVideoToBunny } from "../../utils/common/bunny";

const Replays_level = [
  { value: true, label: "Gratuit" },
  { value: false, label: "Gratuit" },
];

const elearningSchema = Yup.object().shape({
  title: Yup.string().required("Le titre est requis"),
  category: Yup.string().required("La catégorie est requise"),
  description: Yup.string().required("La description est requise"),
  isPublished: Yup.boolean().optional(),
});

type CourseFormValues = Yup.InferType<typeof elearningSchema>;

type ModuleDraft = {
  localId: number; // local React key
  moduleId?: string; // backend module id (for edit)
  title: string;
  content: string;
  lengthSeconds: string | number;
  orderNo: number;
  videoFiles: File[];
  bunnyVideoId?: string;
  bunnyStorageUrl?: string;
  bunnyLibraryId?: string | number;
  attachmentFiles?: File[]; // local upload
  attachmentUrl?: string;
};

const COURSE_ATTACHMENT_ACCEPT = {
  "application/pdf": [],
  "application/zip": [],
  "application/x-zip-compressed": [],
  "application/msword": [],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
};

const ElearningTab = () => {
  const toast = useToast();

  // ========== COURSES LIST ==========
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesPage, setCoursesPage] = useState(1);
  const [coursesLimit, setCoursesLimit] = useState(10);
  const [coursesTotal, setCoursesTotal] = useState(0);
  const [courseAttachmentFiles, setCourseAttachmentFiles] = useState<File[]>(
    [],
  );
  const [courseAttachmentUrls, setCourseAttachmentUrls] = useState<string[]>(
    [],
  );

  const [courseAttachmentProgress, setCourseAttachmentProgress] = useState(0);
  const [uploadingCourseAttachment, setUploadingCourseAttachment] =
    useState(false);

  // ========== VIEW MODULES (read-only table) ==========
  const [viewModulesCourse, setViewModulesCourse] = useState<any | null>(null);
  const [viewModules, setViewModules] = useState<any[]>([]);
  const [viewModulesLoading, setViewModulesLoading] = useState(false);
  const [deleteModuleModal, setDeleteModuleModal] = useState(false);

  const [deleteModuleTarget, setDeleteModuleTarget] = useState<{
    id: string;
    source: "table" | "edit";
  } | null>(null);

  // ========== ADD / EDIT COURSE MODAL ==========
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [elearnThumbFiles, setElearnThumbFiles] = useState<File[]>([]);
  const [courseModules, setCourseModules] = useState<ModuleDraft[]>([]);
  const [elearnAccess, setElearnAccess] = useState<{
    value: boolean;
    label: string;
  } | null>(null);

  // ========== TABLE COLUMNS ==========

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingModuleId, setUploadingModuleId] = useState<number | null>(
    null,
  );

  const [deleteEditModuleTarget, setDeleteEditModuleTarget] =
    useState<ModuleDraft | null>(null);

  const handleDeleteClick = (course: any) => {
    setDeleteTarget(course);
    setDeleteModal(true);
  };

  const elearningColumns = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "title", label: "Titre" },
      { key: "category", label: "Catégorie" },
      {
        key: "isFreeAccess",
        label: "Accéder",
        render: (item: any) => (item.isFreeAccess ? "Gratuit" : "Payant"),
      },
      {
        key: "isPublished",
        label: "Publié",
        render: (item: any) => (item.isPublished ? "Oui" : "Non"),
      },
      {
        key: "createdAt",
        label: "Créé à",
        render: (item: any) =>
          item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—",
      },
      {
        key: "actions",
        label: "Actions",
        render: (item: any) => (
          <div className="flex gap-2">
            <Button
              size="small"
              variant="outline"
              onClick={() => handleViewModules(item)}
            >
              Voir les modules
            </Button>
            <Button size="small" onClick={() => handleEditCourse(item)}>
              Modifier
            </Button>
            <Button
              size="small"
              variant="danger"
              onClick={() => handleDeleteClick(item)}
            >
              Supprimer
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const modulesColumns = useMemo(
    () => [
      { key: "orderNo", label: "Ordre" },
      { key: "title", label: "Titre" },
      { key: "lengthSeconds", label: "Durée (s)" },
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
          <button
            className="p-2 rounded-md hover:bg-red-100"
            onClick={() => {
              setDeleteModuleTarget({
                id: item.id,
                source: "table",
              });
              setDeleteModuleModal(true);
            }}
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        ),
      },
      //   {
      //     key: "isCompleted",
      //     label: "Completed",
      //     render: (item: any) => (item.isCompleted ? "Yes" : "No"),
      //   },
    ],
    [],
  );

  const fetchCourses = async (page = 1, limit = 10) => {
    try {
      setCoursesLoading(true);
      const res = await getRequest(PROVIDER.trainingCOURSES_ALL, {
        params: { page, limit },
      });
      const items = res?.data?.data?.items ?? [];
      setCourses(items);
      setCoursesPage(page);
      setCoursesLimit(limit);
      // if your API returns total, replace this with that
      setCoursesTotal(items.length);
    } catch (err) {
      setCourses([]);
      setCoursesTotal(0);
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleViewModules = async (course: any) => {
    setViewModulesCourse(course);
    setViewModules([]);
    setViewModulesLoading(true);
    try {
      const res = await getRequest(
        `${PROVIDER.GET_COURSE_BY_ID}/${course.id}/modules`,
      );
      const mods = res?.data?.data?.modules ?? [];
      setViewModules(mods);
    } catch (err) {
      toast.error("Échec de la récupération des modules");
    } finally {
      setViewModulesLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(coursesPage, coursesLimit);
  }, []);

  const {
    register: registerCourse,
    handleSubmit: handleSubmitCourse,
    reset: resetCourse,
    formState: { errors: courseErrors },
  } = useForm<CourseFormValues>({
    resolver: yupResolver(elearningSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",

      isPublished: true,
    },
  });

  // open modal for CREATE
  const openCreateModal = () => {
    setIsEditing(false);
    setEditingCourse(null);
    resetCourse({
      title: "",
      category: "",
      description: "",
      isPublished: true,
    });
    setElearnThumbFiles([]);
    setCourseModules([]);
    setCourseAttachmentFiles([]);
    setCourseAttachmentUrls([]);
    setElearnAccess(null);
    setOpenModal(true);
  };

  const confirmDeleteModule = async () => {
    if (!deleteModuleTarget?.id) return;

    setBtnLoading(true);
    try {
      await deleteRequest(
        `${PROVIDER.GET_COURSE_BY_ID}/module/${deleteModuleTarget.id}`,
      );

      toast.success("Module supprimé avec succès");

      // 🔁 Update correct UI based on source
      if (deleteModuleTarget.source === "table") {
        setViewModules((prev) =>
          prev.filter((m) => m.id !== deleteModuleTarget.id),
        );
      }

      if (deleteModuleTarget.source === "edit") {
        setCourseModules((prev) =>
          prev
            .filter((m) => m.moduleId !== deleteModuleTarget.id)
            .map((m, idx) => ({ ...m, orderNo: idx + 1 })),
        );
      }

      setDeleteModuleModal(false);
      setDeleteModuleTarget(null);
    } catch (err) {
      toast.error("Échec de la suppression du module");
    } finally {
      setBtnLoading(false);
    }
  };

  // open modal for EDIT
  const handleEditCourse = async (course: any) => {
    setBtnLoading(true);
    try {
      setIsEditing(true);
      setEditingCourse(course);
      resetCourse({
        title: course.title || "",
        category: course.category || "",
        description: course.description || "",
        isPublished: course.isPublished ?? true,
      });

      if (typeof course.isFreeAccess === "boolean") {
        setElearnAccess(
          course.isFreeAccess ? Replays_level[0] : Replays_level[1],
        );
      } else {
        setElearnAccess(null);
      }

      setElearnThumbFiles([]);

      // Load modules for this course for editing
      const res = await getRequest(
        `${PROVIDER.GET_COURSE_BY_ID}/${course.id}/modules`,
      );
      const mods = res?.data?.data?.modules ?? [];

      const mapped: ModuleDraft[] = mods.map((m: any, idx: number) => ({
        localId: Date.now() + idx,
        moduleId: m.id,
        title: m.title || "",
        content: m.content || "",
        lengthSeconds: m.lengthSeconds ?? "",
        orderNo: m.orderNo ?? idx + 1,
        videoFiles: [],
        bunnyVideoId: m.bunnyVideoId,
        bunnyStorageUrl: m.bunnyStorageUrl,
        bunnyLibraryId: m.bunnyLibraryId,
        attachmentFiles: [],
        attachmentUrls: Array.isArray(m.attachments) ? m.attachments : [],
      }));
      setCourseAttachmentUrls(
        Array.isArray(course.attachments)
          ? course.attachments
          : course.attachmentUrl
            ? [course.attachmentUrl]
            : [],
      );
      setCourseAttachmentFiles([]);
      setCourseModules(mapped);
      setOpenModal(true);
    } catch (err) {
      toast.error("Échec du chargement du cours pour modification");
    }
    setBtnLoading(false);
  };

  const handleModuleDeleteClick = (module: ModuleDraft) => {
    // CREATE MODE or NEW MODULE IN EDIT
    if (!isEditing || !module.moduleId) {
      handleRemoveModule(module.localId);
      return;
    }

    // EDIT MODE + EXISTING MODULE → open confirm modal
    setDeleteEditModuleTarget(module);
    setDeleteModuleModal(true);
  };

  const handleAddModule = () => {
    setCourseModules((prev) => [
      ...prev,
      {
        localId: Date.now(),
        title: "",
        content: "",
        lengthSeconds: "",
        orderNo: prev.length + 1,
        videoFiles: [],
        attachmentFiles: [],
        attachmentUrls: [],
      },
    ]);
  };

  const handleRemoveModule = (localId: number) => {
    setCourseModules((prev) =>
      prev
        .filter((m) => m.localId !== localId)
        .map((m, idx) => ({ ...m, orderNo: idx + 1 })),
    );
  };

  const updateModuleField = (
    localId: number,
    field: keyof ModuleDraft,
    value: any,
  ) => {
    setCourseModules((prev) =>
      prev.map((m) => (m.localId === localId ? { ...m, [field]: value } : m)),
    );
  };

  const onSubmitElearning = async (values: CourseFormValues) => {
    setBtnLoading(true);

    try {
      if (courseModules.length === 0) {
        toast.error("Veuillez ajouter au moins un module");
        return;
      }

      let thumbnailUrl = editingCourse?.thumbnail || "";
      if (elearnThumbFiles.length > 0) {
        const thumbRes = await uploadFile(elearnThumbFiles[0]);
        thumbnailUrl = thumbRes.url;
      }

      const finalAttachmentUrls = [...courseAttachmentUrls];

      if (courseAttachmentFiles.length > 0) {
        setUploadingCourseAttachment(true);
        setCourseAttachmentProgress(0);

        for (const file of courseAttachmentFiles) {
          const res = await uploadFile(file, (percent) =>
            setCourseAttachmentProgress(percent),
          );
          finalAttachmentUrls.push(res.url);
        }

        setUploadingCourseAttachment(false);
        setCourseAttachmentProgress(0);
      }

      const modulesPayload: any[] = [];

      for (let m of courseModules) {
        if (!m.title) {
          toast.error("Chaque module doit avoir un titre");
          return;
        }

        // ---------- MODULE ATTACHMENTS ----------
        const finalModuleAttachmentUrls = [...(m.attachmentUrls || [])];

        if (m.attachmentFiles && m.attachmentFiles.length > 0) {
          for (const file of m.attachmentFiles) {
            const res = await uploadFile(file);
            finalModuleAttachmentUrls.push(res.url);
          }
        }

        // ---------- MODULE VIDEO ----------
        let bunnyVideoId = m.bunnyVideoId;
        let bunnyStorageUrl = m.bunnyStorageUrl;
        let bunnyLibraryId = m.bunnyLibraryId ?? BUNNY_LIBRARY_ID.toString();

        if (m.videoFiles && m.videoFiles.length > 0) {
          const videoFile = m.videoFiles[0];
          setUploadingModuleId(m.localId);
          setUploadProgress(0);

          const uploadRes = await uploadVideoToBunny(videoFile, (percent) => {
            setUploadProgress(percent);
          });

          setUploadingModuleId(null);
          setUploadProgress(0);

          bunnyVideoId = uploadRes.videoId;
          bunnyStorageUrl = uploadRes.videoUrl;
          bunnyLibraryId = BUNNY_LIBRARY_ID.toString();
        } else if (!bunnyVideoId && !isEditing) {
          toast.error("Chaque module doit avoir une vidéo");
          return;
        }

        // ---------- MODULE PAYLOAD ----------
        const modulePayload: any = {
          title: m.title,
          content: m.content || "",
          orderNo: Number(m.orderNo) || 1,
          lengthSeconds: Number(m.lengthSeconds) || 0,
          bunnyVideoId,
          bunnyLibraryId,
          bunnyStorageUrl,

          // ✅ MODULE ATTACHMENTS
          attachments: finalModuleAttachmentUrls,
        };

        if (isEditing && m.moduleId) {
          modulePayload.id = m.moduleId;
        }

        modulesPayload.push(modulePayload);
      }

      // ================= FINAL PAYLOAD =================
      const basePayload = {
        category: values.category,
        title: values.title,
        description: values.description,
        thumbnail: thumbnailUrl || "",
        isFreeAccess: elearnAccess?.value ?? false,
        isPublished: Boolean(values.isPublished),
        modules: modulesPayload,
        attachments: finalAttachmentUrls, // course-level attachments
      };

      let payload: any;

      if (isEditing && editingCourse) {
        payload = { ...basePayload, id: editingCourse.id };
        await patchRequest(
          `${PROVIDER.UPDATE_TRAINING_COURSE}/${editingCourse.id}`,
          payload,
        );
        toast.success("Le cours en ligne a été mis à jour avec succès");
      } else {
        payload = basePayload;
        await postRequest(PROVIDER.ADD_TRAINING_COURSE, payload);
        toast.success("Le cours en ligne a été ajouté avec succès");
      }

      // ================= RESET =================
      resetCourse();
      setElearnThumbFiles([]);
      setCourseModules([]);
      setElearnAccess(null);
      setEditingCourse(null);
      setIsEditing(false);
      setOpenModal(false);

      fetchCourses(1, coursesLimit);
    } catch (err) {
      toast.error("Échec de la soumission du cours en ligne");
    } finally {
      setBtnLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;

    setBtnLoading(true);
    try {
      await deleteRequest(
        `${PROVIDER.DELETE_TRAINING_COURSE}/${deleteTarget.id}`,
      );

      toast.success("Cours supprimé avec succès");

      setDeleteModal(false);
      setDeleteTarget(null);

      fetchCourses(1, coursesLimit);
    } catch (err) {
      toast.error("Échec de la suppression");
    }

    setBtnLoading(false);
  };

  return (
    <>
      {/* MAIN LIST AREA */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <h3 className="text-xl font-semibold dark:text-neutral-100 mb-0">
            Apprentissage en ligne
          </h3>
          <Button size="medium" onClick={openCreateModal}>
            <Plus size={20} /> Ajouter un cours en ligne
          </Button>
        </div>

        {/* COURSES TABLE */}
        <DataTable
          columns={elearningColumns}
          data={courses}
          loading={coursesLoading}
          skeletonRows={3}
          total={coursesTotal}
          page={coursesPage}
          limit={coursesLimit}
          onPageChange={(p) => fetchCourses(p, coursesLimit)}
          emptyText="Aucun cours en ligne trouvé"
        />

        {/* VIEW MODULES (READ ONLY) */}
        {viewModulesCourse && (
          <div className="mt-6 bg-white dark:bg-darkmode p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <h4
                data-no-translate
                className="text-lg font-semibold dark:text-neutral-300"
              >
                Modules pour: {viewModulesCourse.title}
              </h4>
              <button
                type="button"
                className="text-sm text-primary underline"
                onClick={() => {
                  setViewModulesCourse(null);
                  setViewModules([]);
                }}
              >
                Fermer
              </button>
            </div>
            <DataTable
              columns={modulesColumns}
              data={viewModules}
              loading={viewModulesLoading}
              skeletonRows={2}
              total={viewModules.length}
              page={1}
              limit={viewModules.length || 10}
              onPageChange={() => {}}
              emptyText="Aucun module trouvé pour ce cours"
            />
          </div>
        )}
      </div>

      {/* ADD / EDIT COURSE MODAL */}
      <OuterModal active={openModal} setActive={setOpenModal}>
        <div className="w-full max-w-3xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <button
            aria-label="Fermer la fenêtre E-learning"
            type="button"
            className="absolute top-4 right-4 cursor-pointer"
            onClick={() => {
              setOpenModal(false);
              setIsEditing(false);
              setEditingCourse(null);
              resetCourse();
              setElearnThumbFiles([]);
              setCourseModules([]);
              setElearnAccess(null);
            }}
          >
            <X className="dark:text-neutral-300" />
          </button>

          <h2 className="text-2xl font-bold mb-6 dark:text-neutral-300">
            {isEditing
              ? "Modifier le cours en ligne"
              : "Ajouter un cours en ligne"}
          </h2>

          <form
            className="space-y-3"
            onSubmit={handleSubmitCourse(onSubmitElearning)}
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <InputGroup
                  type="text"
                  label="Titre"
                  placeholder="Saisir le titre"
                  inputProps={registerCourse("title")}
                  error={courseErrors.title}
                />
              </div>
              <div className="flex-1">
                <InputGroup
                  type="text"
                  label="Catégorie"
                  placeholder="Saisir la catégorie"
                  inputProps={registerCourse("category")}
                  error={courseErrors.category}
                />
              </div>
            </div>

            <div>
              <InputGroup
                label="Description"
                type="textarea"
                placeholder="Saisir une description"
                inputProps={registerCourse("description")}
                error={courseErrors.description}
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <CustomSelect
                  label="Accès"
                  options={Replays_level}
                  value={elearnAccess}
                  onChange={setElearnAccess as any}
                  placeholder="Sélectionner l’accès"
                  className="min-w-60 !z-50"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...registerCourse("isPublished")}
                  defaultChecked
                />
                <span className="dark:text-neutral-300">Publié</span>
              </label>
            </div>

            {/* Course thumbnail (no dev preview) */}
            <div>
              <div className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Miniature du cours
              </div>
              <FileDropzone
                value={elearnThumbFiles}
                onChange={setElearnThumbFiles}
                accept={{ "image/*": [] }}
                maxFiles={1}
                previews={
                  editingCourse?.thumbnail ? [editingCourse.thumbnail] : []
                }
                onRemoveExisting={() => {
                  if (editingCourse) {
                    setEditingCourse({ ...editingCourse, thumbnail: "" });
                  }
                }}
                helperText="Téléverser l’image miniature du cours"
                name="elearn-thumbnail"
              />
            </div>
            {/* COURSE ATTACHMENT */}
            <div>
              <div className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Pièce jointe du cours (facultatif – ZIP / PDF / DOC)
              </div>

              <FileDropzone
                value={courseAttachmentFiles}
                onChange={setCourseAttachmentFiles}
                accept={COURSE_ATTACHMENT_ACCEPT}
                maxFiles={5}
                previews={courseAttachmentUrls}
                onRemoveExisting={(url) =>
                  setCourseAttachmentUrls((prev) =>
                    prev.filter((u) => u !== url),
                  )
                }
                helperText="Pièces jointes facultatives pour l’ensemble du cours (ZIP / PDF / DOC)"
                name="course-attachments"
              />

              {uploadingCourseAttachment && (
                <div className="w-full mt-2">
                  <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                    {/* <div
                      className="h-full bg-green-500 transition-all duration-200"
                      style={{ width: `${courseAttachmentProgress}%` }}
                    /> */}
                  </div>
                  <p className="text-xs mt-1 dark:text-neutral-300">
                    Téléchargement de la pièce jointe…
                  </p>
                </div>
              )}
            </div>

            <div className="w-full h-0.5 my-6 bg-gray-100 dark:bg-neutral-700"></div>

            <div className="text-xl mb-3 block dark:text-neutral-300">
              Modules
            </div>
            <Button
              variant="outline"
              size="small"
              type="button"
              onClick={handleAddModule}
            >
              <Plus size={18} /> Ajouter un module
            </Button>

            {/* MODULES LIST */}
            <div className="space-y-4 mt-4">
              {courseModules.map((m, idx) => (
                <div
                  key={m.localId}
                  className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-2xl relative space-y-3"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold dark:text-neutral-300">
                      Module #{idx + 1}
                    </span>
                    <button
                      className="p-2 bg-gray-100 hover:bg-gray-200  dark:bg-neutral-600 hover:dark:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group"
                      onClick={() => {
                        if (!m.moduleId) {
                          handleRemoveModule(m.localId);
                          return;
                        }

                        setDeleteModuleTarget({
                          id: m.moduleId,
                          source: "edit",
                        });
                        setDeleteModuleModal(true);
                      }}
                      type="button"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <InputGroup
                        label="Titre"
                        type="text"
                        placeholder="Saisir le titre"
                        className="bg-white"
                        inputProps={{
                          value: m.title,
                          onChange: (e: any) =>
                            updateModuleField(
                              m.localId,
                              "title",
                              e.target.value,
                            ),
                        }}
                      />
                    </div>
                    <div>
                      <InputGroup
                        label="Ordre"
                        type="number"
                        placeholder="Ordre"
                        className="bg-white"
                        inputProps={{
                          value: m.orderNo,
                          onChange: (e: any) =>
                            updateModuleField(
                              m.localId,
                              "orderNo",
                              e.target.value || 1,
                            ),
                        }}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <InputGroup
                        label="Contenu"
                        type="textarea"
                        placeholder="Saisir le contenu"
                        className="bg-white"
                        inputProps={{
                          value: m.content,
                          onChange: (e: any) =>
                            updateModuleField(
                              m.localId,
                              "content",
                              e.target.value,
                            ),
                        }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputGroup
                        label="Durée (secondes)"
                        type="number"
                        placeholder="Saisir la durée en secondes"
                        className="bg-white"
                        inputProps={{
                          value: m.lengthSeconds,
                          onChange: (e: any) =>
                            updateModuleField(
                              m.localId,
                              "lengthSeconds",
                              e.target.value,
                            ),
                        }}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                        Vidéo du module
                      </div>
                      <FileDropzone
                        value={m.videoFiles || []}
                        onChange={(files: File[]) =>
                          updateModuleField(m.localId, "videoFiles", files)
                        }
                        accept={{ "video/*": [] }}
                        maxFiles={1}
                        previews={
                          isEditing && m.bunnyStorageUrl
                            ? [m.bunnyStorageUrl]
                            : []
                        }
                        onRemoveExisting={() => {
                          updateModuleField(
                            m.localId,
                            "bunnyVideoId",
                            undefined,
                          );
                          updateModuleField(
                            m.localId,
                            "bunnyStorageUrl",
                            undefined,
                          );
                          updateModuleField(
                            m.localId,
                            "bunnyLibraryId",
                            undefined,
                          );
                        }}
                        helperText={
                          isEditing && m.bunnyVideoId
                            ? "Vidéo existante affichée ci-dessous. Téléchargez un fichier pour la remplacer."
                            : "Télécharger le fichier vidéo du module"
                        }
                      />
                      {uploadingModuleId === m.localId && (
                        <div className="w-full mt-2">
                          <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-50 transition-all duration-200"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs mt-1 dark:text-neutral-300">
                            Téléchargement en cours… {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <div className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                        Pièces jointes du module (facultatif)
                      </div>

                      <FileDropzone
                        value={m.attachmentFiles || []}
                        onChange={(files: File[]) =>
                          updateModuleField(m.localId, "attachmentFiles", files)
                        }
                        accept={COURSE_ATTACHMENT_ACCEPT}
                        maxFiles={5}
                        previews={m.attachmentUrls || []}
                        onRemoveExisting={(url) =>
                          updateModuleField(
                            m.localId,
                            "attachmentUrls",
                            (m.attachmentUrls || []).filter((u) => u !== url),
                          )
                        }
                        helperText="Pièces jointes facultatives pour l’ensemble du cours (ZIP / PDF / DOC)"
                        name={`module-attachments-${m.localId}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between mt-7">
              <Button
                className="flex-1"
                variant="outline"
                type="button"
                onClick={() => {
                  setOpenModal(false);
                  setIsEditing(false);
                  setEditingCourse(null);
                  resetCourse();
                  setElearnThumbFiles([]);
                  setCourseModules([]);
                  setElearnAccess(null);
                }}
              >
                Annuler
              </Button>
              <Button loading={btnLoading} className="flex-1" type="submit">
                {isEditing ? "Supprimer le cours" : "Enregistrer le cours"}
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>
      <OuterModal active={deleteModal} setActive={setDeleteModal}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <div className="mb-6 space-y-6 text-center">
            <h2 className="text-2xl font-semibold mb-0 dark:text-neutral-100">
              Supprimer le cours
            </h2>
            <p className="text-gray-600 dark:text-neutral-300">
              Êtes-vous sûr de vouloir supprimer:
              <strong> {deleteTarget?.title}</strong>?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8">
            <Button
            className="flex-1"
              variant="outline"
              onClick={() => {
                setDeleteModal(false);
                setDeleteTarget(null);
              }}
            >
              Annuler
            </Button>

            <Button
            className="flex-1"
            variant="danger"
             loading={btnLoading} onClick={confirmDelete}>
              Supprimer
            </Button>
          </div>
        </div>
      </OuterModal>
      <OuterModal active={deleteModuleModal} setActive={setDeleteModuleModal}>
        <div className="w-full max-w-2xl mx-auto p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relativ">
          <div className="mb-6 space-y-4 text-center">
            <h2 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
              Supprimer le module
            </h2>

            <p className="text-gray-600 dark:text-neutral-300">
              Êtes-vous sûr de vouloir supprimer le module :
              <strong> {deleteEditModuleTarget?.title}</strong>?
              <br />
              Cette action est irréversible.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-end mt-8">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => {
                setDeleteModuleModal(false);
                setDeleteModuleTarget(null);
              }}
            >
              Annuler
            </Button>

            <Button
              className="flex-1"
              loading={btnLoading}
              variant="danger"
              onClick={confirmDeleteModule}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default ElearningTab;
