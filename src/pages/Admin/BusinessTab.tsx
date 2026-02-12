import { Plus, X, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import OuterModal from "../../components/Custommodal/OuterModal";
import Button from "../../components/ui/Button";
import DataTable from "../../components/ui/Datatable";
import InputGroup from "../../components/ui-main/InputGroup";

import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useToast } from "../../utils/toast";
import CustomDatePicker from "../../components/DatePicker";

const Departments = [
  { id: "01", label: "Ain" },
  { id: "02", label: "Aisne" },
  { id: "03", label: "Allier" },
  { id: "04", label: "Alpes-de-Haute-Provence" },
  { id: "05", label: "Hautes-Alpes" },
  { id: "06", label: "Alpes-Maritimes" },
  { id: "07", label: "Ardèche" },
  { id: "08", label: "Ardennes" },
  { id: "09", label: "Ariège" },
  { id: "10", label: "Aube" },
  { id: "11", label: "Aude" },
  { id: "12", label: "Aveyron" },
  { id: "13", label: "Bouches-du-Rhône" },
  { id: "14", label: "Calvados" },
  { id: "15", label: "Cantal" },
  { id: "16", label: "Charente" },
  { id: "17", label: "Charente-Maritime" },
  { id: "18", label: "Cher" },
  { id: "19", label: "Corrèze" },
  { id: "2A", label: "Corse-du-Sud" },
  { id: "2B", label: "Haute-Corse" },
  { id: "21", label: "Côte-d'Or" },
  { id: "22", label: "Côtes-d'Armor" },
  { id: "23", label: "Creuse" },
  { id: "24", label: "Dordogne" },
  { id: "25", label: "Doubs" },
  { id: "26", label: "Drôme" },
  { id: "27", label: "Eure" },
  { id: "28", label: "Eure-et-Loir" },
  { id: "29", label: "Finistère" },
  { id: "30", label: "Gard" },
  { id: "31", label: "Haute-Garonne" },
  { id: "32", label: "Gers" },
  { id: "33", label: "Gironde" },
  { id: "34", label: "Hérault" },
  { id: "35", label: "Ille-et-Vilaine" },
  { id: "36", label: "Indre" },
  { id: "37", label: "Indre-et-Loire" },
  { id: "38", label: "Isère" },
  { id: "39", label: "Jura" },
  { id: "40", label: "Landes" },
  { id: "41", label: "Loir-et-Cher" },
  { id: "42", label: "Loire" },
  { id: "43", label: "Haute-Loire" },
  { id: "44", label: "Loire-Atlantique" },
  { id: "45", label: "Loiret" },
  { id: "46", label: "Lot" },
  { id: "47", label: "Lot-et-Garonne" },
  { id: "48", label: "Lozère" },
  { id: "49", label: "Maine-et-Loire" },
  { id: "50", label: "Manche" },
  { id: "51", label: "Marne" },
  { id: "52", label: "Haute-Marne" },
  { id: "53", label: "Mayenne" },
  { id: "54", label: "Meurthe-et-Moselle" },
  { id: "55", label: "Meuse" },
  { id: "56", label: "Morbihan" },
  { id: "57", label: "Moselle" },
  { id: "58", label: "Nièvre" },
  { id: "59", label: "Nord" },
  { id: "60", label: "Oise" },
  { id: "61", label: "Orne" },
  { id: "62", label: "Pas-de-Calais" },
  { id: "63", label: "Puy-de-Dôme" },
  { id: "64", label: "Pyrénées-Atlantiques" },
  { id: "65", label: "Hautes-Pyrénées" },
  { id: "66", label: "Pyrénées-Orientales" },
  { id: "67", label: "Bas-Rhin" },
  { id: "68", label: "Haut-Rhin" },
  { id: "69", label: "Rhône" },
  { id: "70", label: "Haute-Saône" },
  { id: "71", label: "Saône-et-Loire" },
  { id: "72", label: "Sarthe" },
  { id: "73", label: "Savoie" },
  { id: "74", label: "Haute-Savoie" },
  { id: "75", label: "Paris" },
  { id: "76", label: "Seine-Maritime" },
  { id: "77", label: "Seine-et-Marne" },
  { id: "78", label: "Yvelines" },
  { id: "79", label: "Deux-Sèvres" },
  { id: "80", label: "Somme" },
  { id: "81", label: "Tarn" },
  { id: "82", label: "Tarn-et-Garonne" },
  { id: "83", label: "Var" },
  { id: "84", label: "Vaucluse" },
  { id: "85", label: "Vendée" },
  { id: "86", label: "Vienne" },
  { id: "87", label: "Haute-Vienne" },
  { id: "88", label: "Vosges" },
  { id: "89", label: "Yonne" },
  { id: "90", label: "Territoire de Belfort" },
  { id: "91", label: "Essonne" },
  { id: "92", label: "Hauts-de-Seine" },
  { id: "93", label: "Seine-Saint-Denis" },
  { id: "94", label: "Val-de-Marne" },
  { id: "95", label: "Val-d'Oise" },

  { id: "971", label: "Guadeloupe" },
  { id: "972", label: "Martinique" },
  { id: "973", label: "Guyane" },
  { id: "974", label: "La Réunion" },
  { id: "976", label: "Mayotte" },
];

const regions = [
  "Île-de-France",
  "Auvergne-Rhône-Alpes",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Hauts-de-France",
  "Grand Est",
  "Provence-Alpes-Côte d'Azur",
  "Pays de la Loire",
  "Bretagne",
  "Normandie",
  "Bourgogne-Franche-Comté",
  "Centre-Val de Loire",
];

const businessSchema = Yup.object().shape({
  title: Yup.string().required("Le titre est requis"),
  description: Yup.string().required("La description est requise"),
  startDate: Yup.string().required("La date de début est requise"),
  location: Yup.string().required("Le lieu est requis"),
  duration: Yup.number()
    .typeError("La durée doit être un nombre")
    .positive("La durée doit être positive")
    .required("La durée est requise"),
  maxAtendees: Yup.number()
    .typeError("Le nombre maximum de participants doit être un nombre")
    .positive("Le nombre maximum de participants doit être positif")
    .required("Le nombre maximum de participants est requis"),
  // meetingUrl: Yup.string().required("Meeting URL is required"),
  amount: Yup.number()
    .typeError("Le montant doit être un nombre")
    .positive("Le montant doit être positif")
    .required("Le montant est requis"),
});

type BusinessFormValues = Yup.InferType<typeof businessSchema>;

const BusinessTab = () => {
  const toast = useToast();

  // LIST STATE
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // MODALS
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // EDIT STATE
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  // DATE PICKER
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // DEPARTMENTS & REGIONS
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // ---------- TABLE COLUMNS ----------
  const columns = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "title", label: "Titre" },
      {
        key: "startDate",
        label: "Date",
        render: (item: any) =>
          item.startDate
            ? new Date(item.startDate).toLocaleString()
            : "No date",
      },
      { key: "location", label: "Lieu" },
      { key: "duration", label: "Durée (min)" },
      { key: "maxAtendees", label: "Nombre maximal de participants" },
      {
        key: "amount",
        label: "Montant",
        render: (item: any) =>
          typeof item.amount === "number"
            ? item.amount.toFixed(2)
            : item.amount,
      },
      {
        key: "region",
        label: "Régions",
        render: (item: any) =>
          Array.isArray(item.region) ? item.region.join(", ") : "—",
      },
      {
        key: "department",
        label: "Départements",
        render: (item: any) =>
          Array.isArray(item.department) ? item.department.join(", ") : "—",
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
            <Button
              size="small"
              variant="danger"
              onClick={() => openDelete(item)}
            >
              Supprimer
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const fetchMeetings = async (pageArg = 1, limitArg = 10) => {
    try {
      setLoading(true);
      const res = await getRequest(
        `${PROVIDER.GET_BUSINESS_MEETINGS}?page=${pageArg}&limit=${limitArg}`
      );

      const raw = res?.data?.data;

      let items: any[] = [];
      let currentPage = pageArg;
      let currentLimit = limitArg;
      let currentTotal = 0;

      if (Array.isArray(raw)) {
        items = raw;
        currentTotal = raw.length;
      } else if (raw) {
        if (Array.isArray(raw.meetings)) {
          items = raw.meetings;
          currentPage = raw.page ?? pageArg;
          currentLimit = raw.limit ?? limitArg;
          currentTotal = raw.total ?? items.length;
        } else if (Array.isArray(raw.items)) {
          items = raw.items;
          currentTotal = raw.total ?? items.length;
        }
      }

      setMeetings(items);
      setPage(currentPage);
      setLimit(currentLimit);
      setTotal(currentTotal);
    } catch (err) {

      setMeetings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- FORM ----------
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BusinessFormValues>({
    resolver: yupResolver(businessSchema),
  });

  const resetFormState = () => {
    reset({});
    setSelectedDate(null);
    setSelectedDepartments([]);
    setSelectedRegions([]);
    setIsEditing(false);
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetFormState();
    setOpenModal(true);
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setEditingItem(item);

    setValue("title", item.title || "");
    setValue("description", item.description || "");
    setValue("location", item.location || "");
    setValue("duration", item.duration ?? ("" as any));
    setValue("maxAtendees", item.maxAtendees ?? ("" as any));
    setValue("meetingUrl", item.meetingUrl || "");
    setValue("amount", item.amount ?? ("" as any));

    if (item.startDate) {
      const d = new Date(item.startDate);
      setSelectedDate(d);
      setValue("startDate", d.toISOString());
    } else {
      setSelectedDate(null);
      setValue("startDate", "" as any);
    }

    setSelectedDepartments(
      Array.isArray(item.department) ? item.department : []
    );
    setSelectedRegions(Array.isArray(item.region) ? item.region : []);

    setOpenModal(true);
  };

  // ---------- DELETE ----------
  const openDelete = (item: any) => {
    setDeleteTarget(item);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    setBtnLoading(true);
    if (!deleteTarget) return;
    try {
      await deleteRequest(`${PROVIDER.BUSINESS_MEETING}/${deleteTarget.id}`);
      toast.success("Réunion professionnelle supprimée avec succès");
      setDeleteModal(false);
      setDeleteTarget(null);
      fetchMeetings(1, limit);
    } catch (err) {

      toast.error("Échec de la suppression");
    }
    setBtnLoading(false);
  };

  // ---------- CHECKBOX HELPERS ----------
  const toggleDepartment = (label: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(label) ? prev.filter((d) => d !== label) : [...prev, label]
    );
  };

  const toggleRegion = (label: string) => {
    setSelectedRegions((prev) =>
      prev.includes(label) ? prev.filter((r) => r !== label) : [...prev, label]
    );
  };

  const isDepartmentChecked = (label: string) =>
    selectedDepartments.includes(label);
  const isRegionChecked = (label: string) => selectedRegions.includes(label);

  // ---------- SUBMIT ----------
  const onSubmit = async (values: BusinessFormValues) => {
    try {
      if (!selectedDate) {
        toast.error("Veuillez sélectionner la date et l’heure de début");
        return;
      }

      if (selectedDepartments.length === 0) {
        toast.error("Veuillez sélectionner au moins un département");
        return;
      }

      if (selectedRegions.length === 0) {
        toast.error("Veuillez sélectionner au moins une région");
        return;
      }
      setBtnLoading(true);
      const payload = {
        title: values.title,
        description: values.description,
        startDate: selectedDate.toISOString(),
        location: values.location,
        maxAtendees: Number(values.maxAtendees),
        duration: Number(values.duration),
        meetingUrl: values.meetingUrl || "",
        amount: Number(values.amount),
        region: selectedRegions,
        department: selectedDepartments,
      };

      if (isEditing && editingItem) {
        await patchRequest(
          `${PROVIDER.BUSINESS_MEETING}/${editingItem.id}`,
          payload
        );
        toast.success("Réunion professionnelle mise à jour avec succès");
      } else {
        await postRequest(PROVIDER.BUSINESS_MEETING, payload);
        toast.success("Réunion professionnelle créée avec succès");
      }
      reset();
      setOpenModal(false);
      resetFormState();
      fetchMeetings(1, limit);
    } catch (err) {

      toast.error("Échec de l’envo");
    }
    setBtnLoading(false);
  };

  return (
    <>
      {/* HEADER + TABLE */}
      <div className="space-y-6">
         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
           <h3 className="text-xl font-semibold dark:text-neutral-100 mb-0">Entreprise</h3>
          <Button size="medium" onClick={openAddModal}>
            <Plus size={20} /> Ajouter une entreprise
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={meetings}
          loading={loading}
          skeletonRows={3}
          total={total}
          page={page}
          limit={limit}
          onPageChange={(p) => fetchMeetings(p, limit)}
          emptyText="Aucune réunion professionnelle trouvées"
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      <OuterModal active={openModal} setActive={setOpenModal}>
        <div className="w-full max-w-3xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <button className="absolute top-4 right-4 cursor-pointer" aria-label="">
          <X
            className="dark:text-neutral-300"
            onClick={() => {
              setOpenModal(false);
              resetFormState();
            }}
          />
          </button>

          <h2 className="text-2xl font-bold mb-6 dark:text-neutral-300">
            {isEditing ? "Modifier l’entreprise" : "Créer une entreprise"}
          </h2>

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Title + Date */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <InputGroup
                  type="text"
                  label="Titre"
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
                  onChange={(date: any) => {
                    setSelectedDate(date);
                    setValue(
                      "startDate",
                      date ? date.toISOString() : ("" as any)
                    );
                  }}
                  showTimeSelect
                  dateFormat="dd/MM/yyyy h:mm aa"
                  placeholderText="Sélectionner une date"
                  className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate.message}
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

            <div>
              <InputGroup
                label="Lieu"
                type="text"
                placeholder="Entrer le lieu"
                inputProps={register("location")}
                error={errors.location}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <InputGroup
                  label="Durée (min)"
                  type="number"
                  placeholder="Entrer la durée"
                  inputProps={register("duration")}
                  error={errors.duration}
                />
              </div>

              <div className="flex-1">
                <InputGroup
                  label="Nombre maximal de participants"
                  type="number"
                  placeholder="Entrer le nombre maximum de participants"
                  inputProps={register("maxAtendees")}
                  error={errors.maxAtendees}
                />
              </div>
              <div>
                <InputGroup
                  label="Montant"
                  type="number"
                  placeholder="Entrer le montant"
                  inputProps={register("amount")}
                  error={errors.amount}
                />
              </div>
            </div>
          

            <div>
              <div className="text-lg font-semibold mb-2 dark:text-neutral-300">
                Départements
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {Departments.map((elem) => (
                  <label
                    key={elem.id}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      className="hidden peer"
                      checked={isDepartmentChecked(elem.label)}
                      onChange={() => toggleDepartment(elem.label)}
                    />
                    <span className="w-5 h-5 border border-gray-400 rounded-sm peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                      <Check className="text-white w-4 h-4" />
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">
                      {elem.id} - {elem.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* REGIONS */}
            <div>
              <div className="text-lg font-semibold mb-2 dark:text-neutral-300">
               Régions
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {regions.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      className="hidden peer"
                      checked={isRegionChecked(item)}
                      onChange={() => toggleRegion(item)}
                    />
                    <span className="w-5 h-5 border border-gray-400 rounded-sm peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center">
                      <Check className="text-white w-4 h-4" />
                    </span>
                    <span className="text-gray-700 dark:text-gray-200">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between mt-7">
              <Button
                className="flex-1"
                type="button"
                variant="outline"
                onClick={() => {
                  setOpenModal(false);
                  resetFormState();
                }}
              >
                Annuler
              </Button>
              <Button loading={btnLoading} className="flex-1" type="submit">
                {isEditing ? "Enregistrer les modifications" : "Créer une réunion"}
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>

      <OuterModal active={deleteModal} setActive={setDeleteModal}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-10 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <div className="text-center mb-6 space-y-6">
          <h3 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
            Supprimer la réunion professionnelle
          </h3>
          <p className="text-gray-600 dark:text-neutral-300">
            Êtes-vous sûr de vouloir supprimer ?{" "}
            <strong>{deleteTarget?.title}</strong>?
          </p>
           </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button className="flex-1" variant="outline" onClick={() => setDeleteModal(false)}>
              Annuler
            </Button>
            <Button className="flex-1" variant="danger" loading={btnLoading} onClick={confirmDelete}>
             Supprimer
            </Button>
          </div>
         
        </div>
      </OuterModal>
    </>
  );
};

export default BusinessTab;
