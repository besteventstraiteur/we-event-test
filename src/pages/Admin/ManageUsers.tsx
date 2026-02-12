import { useEffect, useMemo, useState, useCallback } from "react";
import Button from "../../components/ui/Button";
import OuterModal from "../../components/Custommodal/OuterModal";
import InputGroup from "../../components/ui-main/InputGroup";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "../../utils/http-client/axiosClient";
import { ADMIN } from "../../utils/endPoints";
import debounce from "lodash.debounce";
import { X, CheckCircle, XCircle, Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomSelect from "../../components/ui-main/selectBox";
import { RESPONSE_CODE } from "../../utils/constants";
import { useToast } from "../../utils/toast";
import { useSearchParams } from "react-router-dom";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

type User = {
  id: string;
  profileImg: string | null;
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  isDeleted: boolean;
  isApproved: boolean;
  role: string;
  companyName?: string | null;
  companyPhoneNumber?: string | null;
  companyRegNo?: string | null;
};

type UsersResponse = {
  data: {
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

enum UserRole {
  CLIENT = "CLIENT",
  PARTNER = "PARTNER",
}

function ManageUsers() {
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "partner" | "client">(
    "all",
  );
  const [validating, setValidating] = useState(false);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);

  const skeletonRows = 6;
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteUser) return;

    try {
      setDeleteLoading(true);

      await deleteRequest(`${ADMIN.DELETE_USER}/${deleteUser.id}`);

      toast.success("Utilisateur supprimé avec succès");

      setDeleteUser(null);
      fetchUsers({ page, limit, search, role: activeTab });
    } catch (error: any) {
      toast.error(
        "Delete failed",
        error?.response?.data?.message ||
          "Impossible de supprimer l’utilisateur.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const roleOptions = [
    { label: "Client", value: "CLIENT" },
    { label: "Partenaire", value: "PARTNER" },
  ];

  // Debounce search
  const debouncedSetSearchServer = useMemo(
    () =>
      debounce((q: string) => {
        setPage(1);
        fetchUsers({ page: 1, limit, search: q });
      }, 350),
    [limit, activeTab],
  );

  // Fetch users
  const fetchUsers = useCallback(
    async ({
      page: p = page,
      limit: l = limit,
      search: q = search,
      role,
    }: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
    } = {}) => {
      setLoading(true);
      setError("");
      try {
        const roleQuery = role && role !== "all" ? `&role=${role}` : "";
        const resp: UsersResponse | any = await getRequest(
          `${ADMIN.USERS}?page=${p}&limit=${l}&search=${encodeURIComponent(
            q || "",
          )}${roleQuery}`,
        );
        const container = resp?.data?.data ?? resp?.data ?? resp;
        const list: User[] = container?.data ?? [];
        setRows(list);
        setTotal(container?.total ?? list.length ?? 0);
        setTotalPages(container?.totalPages ?? 1);
        setPage(container?.page ?? p);
        setLimit(container?.limit ?? l);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch users.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search, activeTab],
  );

  useEffect(() => {
    fetchUsers({ page, limit, search, role: activeTab });
  }, [activeTab]);

  const goToPage = (p: number) => {
    const next = Math.min(Math.max(1, p), Math.max(1, totalPages));
    if (next !== page) {
      setPage(next);
      fetchUsers({ page: next, limit, search, role: activeTab });
    }
  };

  const changeLimit = (l: number) => {
    if (l !== limit) {
      setLimit(l);
      setPage(1);
      fetchUsers({ page: 1, limit: l, search, role: activeTab });
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearch(q);
    debouncedSetSearchServer(q);
  };

  const toggleBlock = async (user: User) => {
    try {
      setLoading(true);
      const endpoint = user.isBlocked
        ? `${ADMIN.AUTH}/${user.id}/unblock`
        : `${ADMIN.AUTH}/${user.id}/block`;
      await patchRequest(endpoint);
      fetchUsers({ page, limit, search, role: activeTab });
      toast.success(
        `User ${user.isBlocked ? "débloqué" : "bloqué"} avec succès`,
      );
    } catch (e: any) {
      toast.error(
        e?.message || "Échec de la mise à jour du statut de l’utilisateur.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setBtnLoading(true);
    const res = await patchRequest(`${ADMIN.AUTH}/${id}/approve`);
    if (res.status === 200) {
      fetchUsers({ page, limit, search, role: activeTab });
      toast.success("Utilisateur approuvé avec succès");
    }
    setBtnLoading(false);
  };

  const handleAddUser = () => {
    setFormMode("add");
    setEditingUser(null);
    reset({
      firstName: "",
      lastName: "",
      email: "",
      role: UserRole.CLIENT,
      businessName: "",
      businessPhone: "",
      phoneNumber: "",
      referralCode: "",
    });
    setOpenFormModal(true);
  };

  const handleEdit = (user: User) => {
    setFormMode("edit");
    setEditingUser(user);
    setOpenFormModal(true);
  };

  // Validation Schema
  const schema = yup.object().shape({
    firstName: yup.string().required("Le prénom est requis"),
    lastName: yup.string().required("Le nom est requis"),
    email: yup.string().email("Invalid email").required("L’e-mail est requis"),
    role: yup.mixed<UserRole>().oneOf(Object.values(UserRole)).required(),
    businessName: yup.string().when("role", {
      is: UserRole.PARTNER,
      then: (schema) => schema.required("Le nom de l’entreprise est requis"),
    }),
    businessPhone: yup.string().when("role", {
      is: UserRole.PARTNER,
      then: (schema) =>
        schema.required(
          "Le numéro d’immatriculation de l’entreprise est requis",
        ),
    }),
    referralCode: yup.string().optional(),
    phoneNumber: yup.string().when("role", {
      is: UserRole.CLIENT,
      then: (schema) => schema.required("Le numéro de téléphone est requis"),
    }),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: UserRole.CLIENT,
      businessName: "",
      businessPhone: "",
      phoneNumber: "",
      referralCode: "",
    },
  });

  useEffect(() => {
    if (!openFormModal) {
      reset();
      setEditingUser(null);
    }
  }, [openFormModal, reset]);

  useEffect(() => {
    if (formMode === "edit" && editingUser) {
      reset({
        firstName: editingUser.firstName || "",
        lastName: editingUser.lastName || "",
        email: editingUser.email || "",
        role:
          editingUser.role?.toUpperCase() === "PARTNER"
            ? UserRole.PARTNER
            : UserRole.CLIENT,
        businessName: editingUser.companyName || "",
        businessPhone: editingUser.companyRegNo || "",
        referralCode: "",
        phoneNumber:
          editingUser.role === "client" ? editingUser.phoneNumber || "" : "",
      });
    }
  }, [formMode, editingUser, reset]);

  const selectedRole = watch("role");
  const referralCode = watch("referralCode");

  useEffect(() => {
    if (!referralCode) {
      setReferralValid(null);
      return;
    }
    setValidating(true);
    const timeout = setTimeout(() => {
      setReferralValid(referralCode === "VALID123");
      setValidating(false);
    }, 600);
    return () => clearTimeout(timeout);
  }, [referralCode]);

  const onSubmit = async (data: any) => {
    let payload: any = {};
    setBtnLoading(true);
    try {
      if (data.role === UserRole.PARTNER) {
        payload = {
          userType: "partner",
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          // phoneNumber: data.phoneNumber || "",
          business: {
            name: data.businessName || "",
            companyRegNo: data.businessPhone || "",
          },
          referredByCode: data.referralCode || "",
        };
      } else {
        payload = {
          userType: "client",
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber || "",
        };
      }

      if (formMode === "edit" && editingUser) {
        const response = await patchRequest(
          `${ADMIN.EDIT_USER}/${editingUser.id}`,
          payload,
        );
        if (response.status === RESPONSE_CODE[200]) {
          toast.success("L’utilisateur a été mis à jour avec succès.");
          fetchUsers({ page, limit, search, role: activeTab });
          setOpenFormModal(false);
        }
      } else {
        const response = await postRequest(`${ADMIN.CREATE_USER}`, payload);
        if (response.status === RESPONSE_CODE[201]) {
          toast.success("L’utilisateur a été ajouté avec succès.y");
          fetchUsers({ page, limit, search, role: activeTab });
          setOpenFormModal(false);
        }
      }
    } catch (error) {}

    setBtnLoading(false);
  };

  const showingFrom = useMemo(
    () => (total === 0 ? 0 : (page - 1) * limit + 1),
    [page, limit, total],
  );

  const showingTo = useMemo(
    () => Math.min(page * limit, total),
    [page, limit, total],
  );

  const tabs = [
    { key: "all", label: "Tous" },
    { key: "partner", label: "Partenaire" },
    { key: "client", label: "Client" },
  ];

  useEffect(() => {
    const roleFromUrl = searchParams.get("role");

    if (roleFromUrl === "provider") {
      setActiveTab("partner");
    } else if (roleFromUrl === "client") {
      setActiveTab("client");
    } else {
      setActiveTab("all");
    }
  }, []);

  return (
    <>
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold dark:text-neutral-100 mb-0">
              Utilisateurs
            </h1>
            <p className="text-gray-600 dark:text-neutral-300">
              Gérer les utilisateurs, effectuer des recherches, paginer et
              bloquer/débloquer selon les besoins
            </p>
          </div>
          <Button variant="primary" size="medium" onClick={handleAddUser}>
            <Plus size={18} /> Ajouter un utilisateur
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6 border-b border-borderlight dark:border-neutral-700">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg cursor-pointer transition-colors ${
                activeTab === tab.key
                  ? "bg-secondary text-white"
                  : "text-gray-600 hover:text-secondary dark:text-neutral-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={onSearchChange}
              placeholder="Rechercher par nom ou E-mail"
              className="w-full border border-borderlight dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Search users"
              title="Query Param: search"
            />
            {search ? (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                onClick={() => {
                  setSearch("");
                  debouncedSetSearchServer("");
                }}
              >
                Effacer
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="limit"
              className="text-sm text-gray-600 dark:text-neutral-300"
            >
              Limite
            </label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => changeLimit(parseInt(e.target.value, 10))}
              className="border border-borderlight rounded px-2 py-1 dark:text-neutral-300"
              title="Query Param: limit"
            >
              {[5, 10, 20, 50].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto rounded-3xl border border-borderlight dark:border-neutral-700">
          <table className="w-full border-collapse text-left dark:tex-white">
            <thead>
              <tr>
                {["Avatar", "Nom", "E-mail", "Rôle", "Statut", "Action"].map(
                  (head) => (
                    <th
                      key={head}
                      className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm font-medium"
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: skeletonRows }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6}>
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 dark:text-neutral-300"
                  >
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id} className="dark:text-neutral-300">
                    <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                      {u.profileImg ? (
                        <img
                          src={u.profileImg}
                          alt="avatar"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {u.firstName?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                    </td>
                    <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                      {u.email}
                    </td>
                    <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm capitalize">
                      {u.role}
                    </td>
                    <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          u.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {u.isBlocked ? "Bloqué" : "Actif"}
                      </span>
                    </td>
                    <td className="bg-white dark:bg-neutral-800 dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                      <div className="inline-flex gap-2">
                        {u.isApproved === false && (
                          <Button
                            loading={btnLoading}
                            size="small"
                            variant="primary"
                            onClick={() => handleApprove(u.id)}
                          >
                            Approuver
                          </Button>
                        )}

                        <Button size="small" onClick={() => handleEdit(u)}>
                          Modifier
                        </Button>

                        <Button
                          size="small"
                          variant={u.isBlocked ? "secondary" : "danger"}
                          onClick={() => toggleBlock(u)}
                        >
                          {u.isBlocked ? "Débloquer" : "Bloquer"}
                        </Button>
                        <Button
                          size="small"
                          className="bg-slate-500"
                          onClick={() => setDeleteUser(u)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-4">
          <div className="text-sm text-gray-600 dark:text-neutral-300">
            Affichage {showingFrom} - de {total}
          </div>
          <div className="flex gap-2">
            <Button
              size="small"
              variant="outline"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              Précédent
            </Button>
            {/* <span className="text-sm dark:text-neutral-300">
              Page {page}/{totalPages}
            </span> */}
            <Button
              size="small"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      

      <OuterModal active={openFormModal} setActive={setOpenFormModal}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <button
            aria-label="Fermer la fenêtre de modification"
            className="absolute top-4 right-4 cursor-pointer"
            onClick={() => setOpenFormModal(false)}
          >
            <X className="dark:text-neutral-300" />
          </button>
          <h2 className="text-2xl font-semibold mb-6 dark:text-neutral-100">
            {formMode === "add"
              ? "Ajouter un nouvel utilisateur"
              : "Modifier l’utilisateur"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <InputGroup
                label="Prénom"
                inputProps={register("firstName")}
                error={errors.firstName}
                placeholder="Saisir le prénom"
              />
            </div>

            <div>
              <InputGroup
                label="Nom de famille"
                inputProps={register("lastName")}
                error={errors.lastName}
                placeholder="Saisir le nom"
              />
            </div>

            <div>
              <InputGroup
                label="E-mail"
                inputProps={register("email")}
                error={errors.email}
                placeholder="Saisir l’adresse e-mail"
                type="email"
              />
            </div>

            <div>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Rôle"
                    options={roleOptions}
                    value={roleOptions.find((opt) => opt.value === field.value)}
                    onChange={(selected) =>
                      field.onChange((selected as any)?.value)
                    }
                    placeholder="Select Role"
                    error={errors.role?.message}
                    isDisabled={formMode === "edit"}
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor:
                          formMode === "edit" ? "#f3f4f6" : "white",
                        cursor: formMode === "edit" ? "not-allowed" : "pointer",
                      }),
                    }}
                  />
                )}
              />
            </div>

            {selectedRole === UserRole.PARTNER && (
              <>
                <div>
                  <InputGroup
                    label="Nom de l’entreprise"
                    inputProps={register("businessName")}
                    error={errors.businessName}
                    placeholder="Saisir le nom de l’entreprise"
                  />
                </div>

                <div>
                  <InputGroup
                    label="Numéro d’immatriculation de l’entreprise"
                    inputProps={register("businessPhone")}
                    error={errors.businessPhone}
                    placeholder="Saisir le numéro d’immatriculation"
                  />
                </div>

                <div className="relative">
                  <div>
                    <InputGroup
                      label="Code de parrainage (facultatif)"
                      inputProps={register("referralCode")}
                      error={errors.referralCode}
                      placeholder="Saisir le code de parrainage"
                    />
                  </div>
                  {validating && (
                    <p className="text-sm text-gray-500 mt-1">
                      Validation en cours…
                    </p>
                  )}
                  {referralValid !== null && referralCode && !validating && (
                    <div className="flex items-center gap-1 mt-1">
                      {referralValid ? (
                        <>
                          <CheckCircle className="text-green-600 w-4 h-4" />
                          <p className="text-green-600 text-sm">
                            Code de parrainage valide
                          </p>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-red-500 w-4 h-4" />
                          <p className="text-red-500 text-sm mt-1">
                            Code de parrainage invalide
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedRole === UserRole.CLIENT && (
              <div>
                <InputGroup
                  label="Numéro de téléphone"
                  inputProps={register("phoneNumber")}
                  error={errors.phoneNumber}
                  placeholder="Saisir le numéro de téléphone"
                />
              </div>
            )}

            <Button
              loading={btnLoading}
              type="submit"
              variant="primary"
              className="w-full mt-3"
            >
              {formMode === "add"
                ? "Ajouter un utilisateur"
                : "Mise à jour de l'utilisateur"}
            </Button>
          </form>
        </div>
      </OuterModal>

      <OuterModal active={!!deleteUser} setActive={() => setDeleteUser(null)}>
        <div className="w-full max-w-lg mx-auto p-10 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <div className="mb-6 space-y-4 text-center">
            <h2 className="text-2xl dark:text-neutral-100 font-bold mb-4">
              Delete User
            </h2>
            <p className="text-gray-600 dark:text-neutral-300">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ?
            </p>
          </div>

          <p className="text-center dark:text-neutral-300">
            Nom: {deleteUser?.firstName} {deleteUser?.lastName}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Button
             className="flex-1" 
              onClick={() => setDeleteUser(null)}
              disabled={deleteLoading}
            >
              Annuler
            </Button>

            <Button
            className="flex-1"
              variant="danger"
              loading={deleteLoading}
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
}

export default ManageUsers;
