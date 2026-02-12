import { X, Trash2, Pencil } from "lucide-react";
import Button from "../../../components/ui/Button";
import InputGroup from "../../../components/ui-main/InputGroup";
import CustomSelect from "../../../components/ui-main/selectBox";
import { useEffect, useState } from "react";
import OuterModal from "../../../components/Custommodal/OuterModal";
import CustomDatePicker from "../../../components/DatePicker";
import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "../../../utils/http-client/axiosClient";
import { uploadFile } from "../../../utils/uploadfile";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DataTable from "../../../components/ui/Datatable";
import { PROVIDER } from "../../../utils/endPoints";
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'

const contactTypes = [
  { value: "prospect", label: "Prospect" },
  { value: "partner", label: "Prestataire" },
  { value: "client", label: "Client" },
];

const contactSources = [
  { value: "site_web", label: "Site web" },
  { value: "recommendation", label: "Recommandations" },
  { value: "social_networks", label: "Réseaux sociaux" },
  { value: "event", label: "Événement" },
  { value: "prospection", label: "Prospection" },
  { value: "other", label: "Other" },
];

/* ---------------- UTILS ---------------- */
const findOption = (list: any[], value: string) =>
  list.find((i) => i.value === value) || null;

/* ---------------- VALIDATION ---------------- */
const schema = yup.object({
  name: yup.string().required("Nom requis"),
  email: yup.string().email().required("Adresse électronique requise"),
  phone: yup.string().required("Téléphone requis"),
  address: yup.string().required("Adresse requise"),
  pincode: yup.string().required("Code postal requis"),
  location: yup.string().required("Lieu requis"),
  type: yup.string().required("Type requis"),
  source: yup.string().required("Source requise"),
  budget: yup.string(),
  note: yup.string(),
  business: yup.string(),
  eventLocation: yup.string(),
});

const Contacts = () => {
  const [contactModal, setContactModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [importing, setImporting] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  /* FORM */
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const fetchContacts = async () => {
    setLoading(true);

    const res = await getRequest(
      `${
        PROVIDER.GET_CONTACTS
      }?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}&type=${typeFilter}&source=${sourceFilter}`
    );

    setData(res?.data?.data?.records || []);
    setTotal(res?.data?.data?.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, [search, typeFilter, sourceFilter, page]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (form: any) => {
    setBtnLoading(true);
    const payload = {
      ...form,
      eventDate: selectedDate ? selectedDate.toISOString() : null,
    };

    if (selectedId) {
      await patchRequest(`${PROVIDER.ADD_CONTACT}/${selectedId}`, payload);
    } else {
      await postRequest(PROVIDER.ADD_CONTACT, payload);
    }

    reset();
    setSelectedId(null);
    setSelectedDate(null);
    setContactModal(false);
    fetchContacts();
    setBtnLoading(false);
  };

  const handleEdit = async (id: string) => {
    setBtnLoading(true);

    const res = await getRequest(`${PROVIDER.ADD_CONTACT}/${id}`);
    const data = res?.data?.data;
    setContactModal(true);
    reset();

    Object.keys(data).forEach((k: any) => {
      if (k !== "eventDate") setValue(k, data[k]);
    });

    setSelectedDate(data.eventDate ? new Date(data.eventDate) : null);
    setSelectedId(id);
    setBtnLoading(false);
  };

  /* ---------------- DELETE ---------------- */
  const confirmDelete = async () => {
    setBtnLoading(true);

    if (!selectedId) return;
    await deleteRequest(`${PROVIDER.ADD_CONTACT}/${selectedId}`);
    setDeleteModal(false);
    fetchContacts();
    setBtnLoading(false);
  };

  /* ---------------- IMPORT ---------------- */
  const handleImport = async (file: File) => {
    setImporting(true);
    const uploaded = await uploadFile(file);
    await postRequest(PROVIDER.IMPORT_CONTACTS, { fileKey: uploaded.file });
    setImporting(false);
    fetchContacts();
  };

  /* ---------------- TABLE ---------------- */
  const columns = [
    { label: "Nom", key: "name" },
    { label: "E-mail", key: "email" },
    { label: "Téléphone", key: "phone" },
    { label: "Entreprise", key: "business" },
    { label: "Type", key: "type" },
    { label: "Source", key: "source" },
    { label: "Budget", key: "budget" },
    {
      label: "Actions",
      key: "actions",
      render: (row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.id)}
            className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
          >
            <Pencil size={14} className="text-gray-600 dark:text-neutral-300" />
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                                       opacity-0 group-hover:opacity-100
                                       bg-gray-800 text-white text-xs px-2 py-1 rounded
                                       transition-opacity duration-300 whitespace-nowrap"
            >
              Modifier
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedId(row.id);
              setDeleteModal(true);
            }}
            className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
          >
            <Trash2 size={14} className="text-gray-600 dark:text-neutral-300" />
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                                       opacity-0 group-hover:opacity-100
                                       bg-gray-800 text-white text-xs px-2 py-1 rounded
                                       transition-opacity duration-300 whitespace-nowrap"
            >
              Supprimer
            </span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      
        <div className="mb-6">
              <h1 className="text-2xl font-bold dark:text-neutral-100">Contacts</h1>
              <p className="text-gray-600 mt-1 dark:text-neutral-300">
                Gérez tous vos documents commerciaux : devis, factures, bons de commande et bons de livraison
              </p>
        </div>
        
        {/* FILTER BAR */}
        <div className="space-y-6 mt-6">
          <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:flex flex-col xl:flex-row gap-3">
              <div className="flex-2">
                <InputGroup
                  placeholder="Rechercher par nom, e-mail ou entreprise..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <CustomSelect
                  options={contactTypes}
                  value={findOption(contactTypes, typeFilter)}
                  onChange={(opt: any) => setTypeFilter(opt?.value || "")}
                  placeholder="Tous les types"
                />
              </div>
              <div className="flex-1">
                <CustomSelect
                  options={contactSources}
                  value={findOption(contactSources, sourceFilter)}
                  onChange={(opt: any) => setSourceFilter(opt?.value || "")}
                  placeholder="Toutes les sources"
                />
              </div>

              <label
                htmlFor="importFile"
                className="cursor-pointer flex justify-center items-center border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2"
              >
                {importing ? "Importation en cours…" : "Importer"}

                <input
                  hidden
                  id="importFile"
                  type="file"
                  accept=".csv"
                  onChange={(e: any) => handleImport(e.target.files[0])}
                />
              </label>

              <Button
                onClick={() => {
                  reset();
                  setSelectedId(null);
                  setContactModal(true);
                }}
              >
                Nouveau Contact
              </Button>
            </div>
          </div>
          <div>
            <DataTable
              columns={columns}
              data={data}
              loading={loading}
              page={page}
              limit={limit}
              total={total}
              onPageChange={setPage}
            />
          </div>
        </div>
      

      <OuterModal active={contactModal} setActive={setContactModal}>
        <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden mx-auto relative p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E]">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setContactModal(false);
              reset();
              setSelectedId(null);
              setSelectedDate(null);
            }}
          />
          <div className="mb-6">
             <h2 className="text-2xl font-semibold dark:text-neutral-300"> {selectedId ? "Modifier les coordonnées" : "Créer un contact"}</h2>
          </div>  
         
          <div className="max-h-[70vh] overflow-y-auto">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`space-y-3 ${
                btnLoading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <InputGroup
                      label="Nom complet*"
                      error={errors.name}
                      inputProps={register("name")}
                    />
                  </div>
                  <div>
                    <InputGroup
                      label="E-mail*"
                      error={errors.email}
                      inputProps={register("email")}
                    />
                  </div>
                  <div>
                    <InputGroup
                      label="Téléphone*"
                      error={errors.phone}
                      inputProps={register("phone")}
                    />
                  </div>
                  <div>
                    <InputGroup
                      label="Entreprise"
                      inputProps={register("business")}
                      error={errors.business}
                    />
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-neutral-700 p-5 rounded-lg bg-slate-50 dark:bg-neutral-800">
                  <span className="block mb-2 heading-font font-bold tracking-wider capitalize dark:text-neutral-100">
                    Adresse de facturation
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <InputGroup
                        label="Adresse*"
                        error={errors.address}
                        inputProps={register("address")}
                        placeholder="Numéro et rue"
                      />
                    </div>
                    <div>
                      <InputGroup
                        label="Code postal*"
                        placeholder="75001"
                        error={errors.pincode}
                        inputProps={register("pincode")}
                      />
                    </div>
                    <div>
                      <InputGroup
                        label="Ville*"
                        error={errors.location}
                        inputProps={register("location")}
                        placeholder="Paris"
                      />
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 dark:border-neutral-700 p-5 rounded-lg bg-slate-50 dark:bg-neutral-800">
                  <span className="block mb-2 heading-font font-bold tracking-wider capitalize dark:text-neutral-100">
                    Informations de l'événement
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                        Date de l'événement
                      </label>
                      <CustomDatePicker
                       placeholderText="Sélectionner une date"
                        selected={selectedDate}
                        onChange={setSelectedDate}
                        className="w-full px-3 py-3 border rounded-lg bg-inputbg dark:bg-inputdarkbg border-inputborder"
                      />
                    </div>
                     <div>
                  <InputGroup
                    label="Lieu de l'événement"
                    inputProps={register("eventLocation")}
                    placeholder="ex : Château de Versailles, Paris"
                  />
                </div>
                  </div>
                </div>
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <CustomSelect
                      label="Type*"
                      placeholder="Sélectionner"
                      options={contactTypes}
                      value={findOption(contactTypes, watch("type"))}
                      onChange={(v: any) => setValue("type", v?.value || "")}
                      error={errors.type?.message}
                    />
                  </div>
                  <div>
                    <CustomSelect
                      label="Source*"
                      placeholder="Sélectionner"
                      options={contactSources}
                      value={findOption(contactSources, watch("source"))}
                      onChange={(v: any) => setValue("source", v?.value || "")}
                      error={errors.source?.message}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <InputGroup
                      label="Budget estimé"
                      inputProps={register("budget")}
                      placeholder="Ex: 5000 - 8000€"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <InputGroup
                      label="Notes"
                      type="textarea"
                      inputProps={register("note")}
                      className="col-span-2"
                      placeholder="Notes internes sur ce contact..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 justify-between mt-7">
                <Button
                  className="flex-1"
                  variant="outline"
                  type="button"
                  onClick={() => setContactModal(false)}
                >
                  Annuler
                </Button>
                <Button loading={btnLoading} className="flex-1" type="submit">
                  {selectedId ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </OuterModal>

      <OuterModal active={deleteModal} setActive={setDeleteModal}>
        <div className="bg-white p-6 max-w-md mx-auto text-center rounded-lg">
          <h3 className="text-lg font-bold mb-3">Supprimer le contact ?</h3>
          <p className="mb-4">Cette action est irréversible</p>

          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => setDeleteModal(false)}>
              Annuler
            </Button>
            <Button loading={btnLoading} onClick={confirmDelete}>
              Supprimer
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default Contacts;
