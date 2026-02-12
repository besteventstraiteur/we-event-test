import { useEffect, useState } from "react";
import { Plus, Trash2, X, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import OuterModal from "../../../components/Custommodal/OuterModal";
import Button from "../../../components/ui/Button";
import InputGroup from "../../../components/ui-main/InputGroup";
import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import DataTable from "../../../components/ui/Datatable";

/* ---------------- TYPES ---------------- */
interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface SupplierForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

/* ---------------- VALIDATION ---------------- */
const schema = yup.object({
  name: yup.string().required("Nom requis"),
  email: yup.string().email("Email invalide").required("Email requis"),
  phone: yup.string().required("Téléphone requis"),
  address: yup.string(),
});
/* ---------------- COMPONENT ---------------- */

const SupplierPage = () => {
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /* ---------------- FORM ---------------- */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierForm>({
    resolver: yupResolver(schema),
  });

  /* ---------------- FETCH ---------------- */
  const fetchSuppliers = async (pageNumber = page) => {
    setLoading(true);

    const query = new URLSearchParams({
      page: String(pageNumber),
      limit: String(limit),
      ...(debouncedSearch && { search: debouncedSearch }),
    }).toString();

    const res = await getRequest(`${PROVIDER.SUPPLIER}/list?${query}`);

    const payload = res?.data?.data;

    setData(payload?.suppliers || []);
    setPage(payload?.page || 1);
    setTotal(payload?.total || 0);

    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers(page);
  }, [page, debouncedSearch]);

  /* ---------------- HANDLERS ---------------- */
  const openCreate = () => {
    setActiveId(null);
    reset({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
    setModalOpen(true);
  };
  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
  };
  const openEdit = (row: Supplier) => {
    setActiveId(row.id);
    reset({
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
    });
    setModalOpen(true);
  };

  const onSubmit = async (form: SupplierForm) => {
    setbtnLoading(true);
    if (activeId) {
      await patchRequest(`${PROVIDER.SUPPLIER}/${activeId}`, form);
    } else {
      await postRequest(`${PROVIDER.SUPPLIER}`, form);
    }
    setModalOpen(false);
    fetchSuppliers();
    setbtnLoading(false);
  };

  const confirmDelete = async () => {
    setbtnLoading(true);
    if (!activeId) return;
    await deleteRequest(`${PROVIDER.SUPPLIER}/${activeId}`);
    setDeleteModal(false);
    fetchSuppliers();
    setbtnLoading(false);
  };

  const columns = [
    {
      key: "name",
      label: "Nom",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Téléphone",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Supplier) => (
        <div className="text-right relative">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setOpenActionId(null);
                openEdit(row);
              }}
              className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
            >
              <Edit size={14} className="text-gray-600 dark:text-neutral-300" />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                Modifier
              </span>
            </button>

            <button
              onClick={() => {
                setOpenActionId(null);
                setActiveId(row.id);
                setDeleteModal(true);
              }}
              className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
            >
              <Trash2
                size={14}
                className="text-gray-600 dark:text-neutral-300"
              />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                Supprimer
              </span>
            </button>
          </div>
        </div>
      ),
    },
  ];
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // 🔥 reset pagination on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  /* ---------------- UI ---------------- */
  return (
    <>
      
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-0 dark:text-neutral-100">
              Liste de vos fournisseurs
            </h2>
            <p className="text-gray-600 dark:text-neutral-300">
              Gérez les entreprises avec qui vous travaillez pour vos
              prestations.
            </p>
          </div>

          <Button onClick={openCreate}>
            <Plus size={16} /> Nouveau Fournisseur
          </Button>
        </div>

        <div>
          <div className="mt-8 mb-5">
            <InputGroup
              placeholder="Rechercher un fournisseur..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            emptyText="Aucun fournisseur trouvé"
            total={total}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
          />
        </div>
      

      {/* CREATE / EDIT MODAL */}
      <OuterModal active={modalOpen} setActive={setModalOpen}>
        <div className="w-full max-w-3xl mx-auto relative p-5 md:p-8 rounded-2xl bg-white dark:bg-[#1E1E1E]">
          <X
            className="absolute right-4 top-4 cursor-pointer dark:text-neutral-300"
            onClick={() => setModalOpen(false)}
          />
          <h2 className="text-2xl font-semibold mb-6 dark:text-neutral-100">
            {activeId ? "Modifier Fournisseur" : "Nouveau Fournisseur"}
          </h2>

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <InputGroup
                    label="Nom"
                    placeholder="Entrez le nom"
                    error={errors.name}
                    inputProps={register("name")}
                  />
                </div>

                <div>
                  <InputGroup
                    label="E-mail"
                    placeholder="Entrez l’adresse e-mail"
                    error={errors.email}
                    inputProps={register("email")}
                  />
                </div>
                <div className="col-span-2">
                  <InputGroup
                    label="Téléphone"
                    placeholder="Entrez le numéro de mobile"
                    error={errors.phone}
                    inputProps={register("phone")}
                  />
                </div>
                <div className="col-span-2">
                  <InputGroup
                    label="Adresse"
                    type="textarea"
                    placeholder="Entrez l’adresse"
                    error={errors.address}
                    inputProps={register("address")}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <Button
                className="flex-1"
                variant="outline"
                type="button"
                onClick={() => setModalOpen(false)}
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

      {/* DELETE MODAL */}
      <OuterModal active={deleteModal} setActive={setDeleteModal}>
        <div className="w-full max-w-2xl mx-auto relative text-center p-5 md:p-8 rounded-2xl bg-white dark:bg-[#1E1E1E]">
          <div className="mb-6 space-y-4">
            <h2 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
              Supprimer le fournisseur ?
            </h2>

            <p className="text-gray-600 dark:text-gray-300">
              Cette action est irréversible
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-10">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              loading={btnLoading}
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default SupplierPage;
