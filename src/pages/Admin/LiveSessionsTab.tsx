import { Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import OuterModal from "../../components/Custommodal/OuterModal";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/Datatable";
import InputGroup from "../../components/ui-main/InputGroup";
import CustomSelect from "../../components/ui-main/selectBox";

import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useToast } from "../../utils/toast";
import CustomDatePicker from "../../components/DatePicker";

const AccessOptions = [
  { value: true, label: "Gratuit" },
  { value: false, label: "Payant" },
];

// Validation Schema
const sessionSchema = Yup.object().shape({
  title: Yup.string().required("Le titre est requis"),
  description: Yup.string().required("La durée est requise"),
  startTime: Yup.string().required("La date est requise"),
  duradtionMin: Yup.number()
    .positive("La durée doit être positive")
    .required("La durée est requise"),
  maxAttendees: Yup.number().positive().required("Le nombre maximum de participants est requis"),
  meetingUrl: Yup.string().required("L’URL de la réunion est requise"),
  meetingId: Yup.string(),
  meetingPass: Yup.string(),
});

type FormValues = Yup.InferType<typeof sessionSchema>;

const LiveSessionsTab = () => {
  const toast = useToast();

  // List State
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsPage, setSessionsPage] = useState(1);
  const [sessionsLimit, setSessionsLimit] = useState(10);
  const [sessionsTotal, setSessionsTotal] = useState(0);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Access Level
  const [accessLevel, setAccessLevel] = useState<any>(null);

  // Custom Date Picker State
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Table Columns
  const columns = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "title", label: "Titre" },
      {
        key: "startTime",
        label: "Date",
        render: (item: any) =>
          item.startTime
            ? new Date(item.startTime).toLocaleString()
            : "Aucune date",
      },
      { key: "duradtionMin", label: "Durée (min)" },
      { key: "maxAttendees", label: "Nombre maximal de participants" },
      {
        key: "isFreeAccess",
        label: "Accéder",
        render: (item: any) => (item.isFreeAccess ? "Gratuit" : "Payant"),
      },
      {
        key: "actions",
        label: "Actions",
        render: (item: any) => (
          <div className="flex gap-2">
            <Button
              size="small"
              variant="outline"
              onClick={() => handleEdit(item)}
            >
              Modifier
            </Button>
            <Button size="small" variant="danger" onClick={() => openDelete(item)}>
              Supprimer
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  // Fetching All Sessions
  const fetchSessions = async (page = 1, limit = 10) => {
    try {
      setSessionsLoading(true);
      const res = await getRequest(PROVIDER.GET_LIVE_SESSIONS, {
        params: { page, limit },
      });

      const data = res?.data?.data;

      setSessions(data?.sessions ?? []);
      setSessionsPage(data?.page ?? 1);
      setSessionsLimit(data?.limit ?? 10);
      setSessionsTotal(data?.total ?? 0);
    } catch (err) {
      console.error(err);
      setSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(sessionsPage, sessionsLimit);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(sessionSchema),
  });

  const openAddModal = () => {
    setIsEditing(false);
    setEditingItem(null);

    reset({});
    setAccessLevel(null);
    setSelectedDate(null);

    setOpenModal(true);
  };

  // Edit Modal Load Data
  const handleEdit = (item: any) => {
    setIsEditing(true);
    setEditingItem(item);

    setValue("title", item.title);
    setValue("description", item.description);
    setValue("startTime", item.startTime);
    setSelectedDate(new Date(item.startTime));

    setValue("duradtionMin", item.duradtionMin);
    setValue("maxAttendees", item.maxAttendees);
    setValue("meetingUrl", item.meetingUrl);
    setValue("meetingId", item.meetingId);
    setValue("meetingPass", item.meetingPass);

    setAccessLevel(item.isFreeAccess ? AccessOptions[0] : AccessOptions[1]);

    setOpenModal(true);
  };

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const openDelete = (item: any) => {
    setDeleteTarget(item);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    setbtnLoading(true);
    try {
      await deleteRequest(`${PROVIDER.DELETE_LIVE_SESSION}/${deleteTarget.id}`);
      toast.success("Session supprimée avec succès");
      setDeleteModal(false);
      fetchSessions(1, sessionsLimit);
    } catch {
      toast.error("Échec de la suppression");
    }
    setbtnLoading(false);
  };

  // Submit Form
  const onSubmit = async (values: FormValues) => {
    setbtnLoading(true);
    try {
      const payload = {
        ...values,
        startTime: selectedDate?.toISOString(),
        isFreeAccess: accessLevel?.value ?? true,
      };

      if (isEditing && editingItem) {
        await patchRequest(
          `${PROVIDER.ADD_LIVE_SESSION}/${editingItem.id}`,
          payload
        );
        toast.success("Session mise à jour avec succès");
      } else {
        await postRequest(PROVIDER.ADD_LIVE_SESSION, payload);
        toast.success("Session créée avec succès.");
      }

      setOpenModal(false);
      reset({});
      setAccessLevel(null);
      setSelectedDate(null);
      fetchSessions(1, sessionsLimit);
    } catch (err) {
      console.error(err);
      toast.error("Échec de l’envoi");
    }
    setbtnLoading(false);
  };

  return (
    <>
      {/* Header */}
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
          <h3 className="text-xl font-semibold dark:text-neutral-100 mb-0">Sessions en directs</h3>
          <Button size="medium" onClick={openAddModal}>
            <Plus size={18} /> Ajouter une session
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={sessions}
          loading={sessionsLoading}
          skeletonRows={3}
          total={sessionsTotal}
          page={sessionsPage}
          limit={sessionsLimit}
          onPageChange={(p) => fetchSessions(p, sessionsLimit)}
          emptyText="No live sessions found"
        />
      </div>

      <OuterModal active={openModal} setActive={setOpenModal}>
        <div className="w-full max-w-4xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => setOpenModal(false)}
          />

          <h2 className="text-2xl font-bold  mb-6 dark:text-neutral-100">
            {isEditing ? "Modifier la session" : "Créer une session"}
          </h2>

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <InputGroup
                  label="Titre"
                  type="text"
                  placeholder="Entrer le titre"
                  inputProps={register("title")}
                  error={errors.title}
                />
              </div>

              <div className="flex-1">
                <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                Sélectionnez la date et l'heure
                </label>
                <CustomDatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setValue("startTime", date ? date.toISOString() : "");
                  }}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy h:mm aa"
                  placeholderText="Sélectionner une date"
                  className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startTime.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <InputGroup
                label="Description"
                type="textarea"
                placeholder="Entrer la description"
                inputProps={register("description")}
                error={errors.description}
              />
            </div>

            {/* DURATION + MAX + LEVEL */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <InputGroup
                  label="Durée (min)"
                  type="number"
                  placeholder="Entrer la durée"
                  inputProps={register("duradtionMin")}
                  error={errors.duradtionMin}
                />
              </div>
              <div className="flex-1">
                <InputGroup
                  label="Nombre maximal de participants"
                  type="number"
                  placeholder="Nombre maximum de participants"
                  inputProps={register("maxAttendees")}
                  error={errors.maxAttendees}
                />
              </div>
              <div className="flex-1">
                <CustomSelect
                  label="Niveau"
                  options={AccessOptions}
                  value={accessLevel}
                  onChange={setAccessLevel}
                  placeholder="Choisir le niveau"
                />
              </div>
            </div>

            {/* MEETING URL + ID */}
           <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <InputGroup
                  label="URL de la réunion"
                  type="text"
                  placeholder="Entrer l’URL de la réunion"
                  inputProps={register("meetingUrl")}
                  error={errors.meetingUrl}
                />
              </div>
              <div className="flex-1">
                <InputGroup
                  label="ID de réunion"
                  type="text"
                  placeholder="ID de la réunion"
                  inputProps={register("meetingId")}
                  error={errors.meetingId}
                />
              </div>
            </div>
            <div className="flex-1">
              <InputGroup
                label="Mot de passe de la réunion"
                type="text"
                placeholder="Entrer le mot de passe de la réunion"
                inputProps={register("meetingPass")}
                error={errors.meetingPass}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between mt-7">
              <Button
                className="flex-1"
                type="button"
                variant="outline"
                onClick={() => setOpenModal(false)}
              >
                Annuler
              </Button>

              <Button loading={btnLoading} className="flex-1" type="submit">
                {isEditing ? "Enregistrer les modifications" : "Créer une session"}
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>

      <OuterModal active={deleteModal} setActive={setDeleteModal}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-10 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <div className="text-center mb-6 space-y-6">
          <h2 className="text-2xl font-semibold dark:text-neutral-300 mb-0">
            Supprimer la session
          </h2>
          <p className="text-gray-600 dark:text-neutral-300">
            Êtes-vous sûr de vouloir supprimer:
            <strong> {deleteTarget?.title}</strong>?
          </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-8">
            <Button className="flex-1" variant="outline" onClick={() => setDeleteModal(false)}>
              Annuler
            </Button>

            <Button className="flex-1" 
            variant="danger"
            loading={btnLoading} onClick={confirmDelete}>
              Supprimer
            </Button>
          </div>
          
        </div>
      </OuterModal>
    </>
  );
};

export default LiveSessionsTab;
