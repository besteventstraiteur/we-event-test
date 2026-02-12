import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import InputGroup from "../../components/ui-main/InputGroup";
import Logo from "../../components/Logo";
import lightmode from "../../assets/images/Login-Screen.jpg";
import darkmode from "../../assets/images/dashboard-dark.jpg";

import { Bot, CircleX, Users, ArrowLeft, Plus, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { PROVIDER } from "../../utils/endPoints";
import {
  getRequest,
  patchRequest,
  postRequest,
  deleteRequest,
} from "../../utils/http-client/axiosClient";
import CustomSelect from "../../components/ui-main/selectBox";
import { useToast } from "../../utils/toast";
import SeatingPlan from "./SettingPlan";
import OuterModal from "../../components/Custommodal/OuterModal";

// ---- Types ----
type FormValues = {
  id?: string;
  name: string;
  lastName?: string | null;
  email: string;
  phoneNumber?: string | null;
  status: "en attente" | "Accepté" | "Refusé";
};

type EventResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
    startDateTime?: string;
    endDateTime?: string;
    status?: string;
    thumbnail?: string;
    description?: string;
    category?: string;
    address?: string;
    lat?: number | null;
    lng?: number | null;
    stats?: {
      total_budget?: number;
      used_budget?: number;
      total_guest?: number;
      total_guest_accepted?: number;
      total_task?: number;
      total_task_completed?: number;
      is_site_developed?: boolean;
    };
    tasks?: any[];
  };
};

type GuestRow = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  status: string | null;
  event?: { id: string; name: string };
};

type GuestListResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: GuestRow[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type GuestOverviewResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    eventId: number;
    total_guest: number;
    invited: number;
    pending: number;
    accepted: number;
    declined: number;
  };
};

const STATUS_VALUES = ["pending", "accepted", "declined"] as const;
const STATUS_LABELS: Record<StatusType, string> = {
  pending: "En attente",
  accepted: "Accepté",
  declined: "Refusé",
};

type FilterTab =
  | "all"
  | "accepted"
  | "pending"
  | "declined"
  // | "invited"
  | "joined";

const TabToStatusParam: Record<Exclude<FilterTab, "all">, string> = {
  accepted: "accepted",
  pending: "pending",
  declined: "declined",
  // invited: "invited",
  joined: "joined",
};

const schema: yup.SchemaOf<FormValues> = yup
  .object({
    id: yup.string().optional(),
    name: yup.string().required("Le nom de l’invité est obligatoire"),
    status: yup
      .mixed<FormValues["status"]>()
      .oneOf([...STATUS_VALUES], "Statut invalide")
      .required("Le statut est obligatoire"),
    // phoneNumber: yup.string().nullable().optional(),
    email: yup
      .string()
      .email("E-mail invalide")
      .required("L’e-mail de l’invité est obligatoire"),
    lastName: yup.string().nullable().optional(),
  })
  .required();

function TableSkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx} className="animate-pulse">
          <td className="px-3 py-4 border-b border-borderlight">
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </td>
          <td className="px-3 py-4 border-b border-borderlight">
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </td>
          <td className="px-3 py-4 border-b border-borderlight">
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </td>
          <td className="px-3 py-4 border-b border-borderlight">
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </td>
          <td className="px-3 py-4 border-b border-borderlight">
            <div className="h-6 w-20 bg-gray-200 rounded" />
          </td>
          <td className="px-3 py-4 border-b border-borderlight">
            <div className="h-4 w-12 bg-gray-200 rounded" />
          </td>
        </tr>
      ))}
    </>
  );
}

function StatCard({
  title,
  icon,
  color,
  used,
  total,
  unit,
  progress,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  color?: string;
  used?: number | string | null;
  total?: number | string | null;
  unit?: string;
  progress?: number;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-borderlight dark:border-neutral-700 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
              color ?? "bg-gray-200"
            }`}
          >
            {icon}
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-neutral-400">
              {title}
            </div>
            <div className="text-xl font-semibold dark:text-neutral-100">
              {used ?? 0} {unit ? unit : ""}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-400 dark:text-neutral-400">
          {total ?? "-"}
        </div>
      </div>
      {typeof progress === "number" && (
        <div className="w-full bg-gray-100 h-2 rounded-full mt-3">
          <div
            className="h-full rounded-full bg-green-500"
            style={{ width: `${Math.min(100, Math.round(progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

function Manageguest() {
  const { id } = useParams<{ id?: string }>();
  const eventId = id ?? null;
  const navigate = useNavigate();

  const [active, setActive] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [eventData, setEventData] = useState<EventResponse["data"] | null>(
    null,
  );
  const [guestRows, setGuestRows] = useState<GuestRow[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<FilterTab>("Tous");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  const [overviewLoading, setOverviewLoading] = useState(false);
  const [guestOverview, setGuestOverview] = useState<
    GuestOverviewResponse["data"] | null
  >(null);

  const toast = useToast();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onTouched",
    defaultValues: {
      id: undefined,
      name: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      status: "invited",
    },
  });

  const makeQueryString = (params: Record<string, any>) =>
    new URLSearchParams(
      Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
        if (v === undefined || v === null || v === "") return acc;
        acc[k] = String(v);
        return acc;
      }, {}),
    ).toString();
  const fetchEventById = useCallback(async () => {
    if (!eventId) return;
    try {
      setLoadingEvent(true);
      const res = await getRequest(`${PROVIDER.GET_EVENT_BY_ID}/${eventId}`);
      const parsed = res as EventResponse;
      setEventData(parsed?.data ?? null);
    } catch (e) {
      console.error("Failed to fetch event by id:", e);
      setEventData(null);
    } finally {
      setLoadingEvent(false);
    }
  }, [eventId]);

  const fetchGuestOverview = useCallback(async () => {
    if (!eventId) {
      setGuestOverview(null);
      return;
    }
    try {
      setOverviewLoading(true);
      const res = await getRequest(
        `${PROVIDER.GUEST_OVERVIEW}?eventId=${eventId}`,
      );
      const parsed = res as GuestOverviewResponse;

      setGuestOverview(parsed?.data?.data ?? null);
    } catch (e) {
      console.error("Failed to fetch guest overview:", e);
      setGuestOverview(null);
    } finally {
      setOverviewLoading(false);
    }
  }, [eventId]);

  const buildGuestParams = useCallback(() => {
    const params: Record<string, any> = { page, limit };
    if (eventId) params.eventId = eventId;
    if (activeTab !== "all") {
      params.status = TabToStatusParam[activeTab as Exclude<FilterTab, "all">];
    }
    return params;
  }, [activeTab, page, limit, eventId]);

  const fetchGuestDetails = useCallback(async () => {
    if (!eventId) {
      setGuestRows([]);
      return;
    }
    try {
      setLoadingGuests(true);
      setFetchError(null);
      const params = buildGuestParams();
      const qs = makeQueryString(params);
      const url = qs
        ? `${PROVIDER.GUEST_LIST}?${qs}`
        : `${PROVIDER.GUEST_LIST}?eventId=${eventId}`;
      const res = await getRequest(url);
      const parsed = res as GuestListResponse;

      const list = parsed?.data?.data?.data ?? parsed?.data ?? parsed;
      setGuestRows(Array.isArray(list) ? list : []);
    } catch (e: any) {
      console.error("Failed to fetch guests:", e);
      setFetchError("Failed to fetch guest list");
      setGuestRows([]);
    } finally {
      setLoadingGuests(false);
    }
  }, [buildGuestParams, eventId]);

  useEffect(() => {
    fetchEventById();
    fetchGuestOverview();
  }, [fetchEventById, fetchGuestOverview]);

  useEffect(() => {
    fetchGuestDetails();
  }, [fetchGuestDetails]);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [active]);

  const statusOptions = useMemo(
    () =>
      STATUS_VALUES.map((s) => ({
        value: s,
        label: STATUS_LABELS[s],
      })),
    [],
  );

  const onSubmit = async (values: FormValues) => {
    try {
      if (!eventId) {
        toast.error("Identifiant de l’événement manquant");
        return;
      }

      if (isEdit && values.id) {
        const payload = {
          name: values.name,
          email: values.email,
          // phoneNumber: values.phoneNumber,
          status: values.status,
          eventId,
        };
        const res = await patchRequest(
          `${PROVIDER.UPDATE_GUEST}/${values.id}`,
          payload,
        );
        if (res?.status === 200) {
          toast.success("Invité mis à jour avec succès");
          setActive(false);
          setIsEdit(false);
          fetchGuestDetails();
          fetchGuestOverview();
        } else {
          toast.error(
            "Échec de la mise à jour de l’invité. Veuillez réessayer.",
          );
        }
      } else {
        const payload = {
          eventId,
          name: values.name,
          email: values.email,
          // phoneNumber: values.phoneNumber,
          status: values.status,
        };
        const res = await postRequest(`${PROVIDER.ADD_GUEST}`, payload);
        if (res?.status === 201) {
          toast.success("Invité ajouté avec succès");
          setActive(false);
          fetchGuestDetails();
          fetchGuestOverview();
        } else {
          toast.error("Échec de l’ajout de l’invité. Veuillez réessayer.");
        }
      }
    } catch (error) {
      toast.error("L’action a échoué. Veuillez réessayer.");
      console.error("Guest submit error:", error);
    }
  };

  const tabBase =
    "px-5 py-1 flex-shrink-0 transition-all duration-300 capitalize cursor-pointer rounded-full text-sm";
  const isActiveTab = (tab: FilterTab) => activeTab === tab;

  const handleTabClick = async (tab: FilterTab) => {
    setActiveTab(tab);
    setPage(1);
    try {
      setLoadingGuests(true);
      const params: Record<string, any> = { page: 1, limit };
      if (eventId) params.eventId = eventId;
      if (tab !== "all")
        params.status = TabToStatusParam[tab as Exclude<FilterTab, "all">];
      const qs = makeQueryString(params);
      const url = qs
        ? `${PROVIDER.GUEST_LIST}?${qs}`
        : `${PROVIDER.GUEST_LIST}?eventId=${eventId}`;
      const res = await getRequest(url);
      const parsed = res as GuestListResponse;
      const list = parsed?.data?.data ?? parsed?.data ?? parsed;
      setGuestRows(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error("Failed to fetch guest list on tab click:", e);
      setFetchError("Failed to fetch guest list");
      setGuestRows([]);
    } finally {
      setLoadingGuests(false);
    }
  };

  const openAdd = () => {
    setIsEdit(false);
    reset({
      id: undefined,
      name: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      status: "invited",
    });
    setActive(true);
  };

  const openEdit = (row: GuestRow) => {
    setIsEdit(true);
    const normalizedStatus = (row.status ?? "").toLowerCase();
    const formStatus: FormValues["status"] = (
      ["invited", "pending", "accepted", "declined"].includes(normalizedStatus)
        ? (normalizedStatus as FormValues["status"])
        : "invited"
    ) as FormValues["status"];
    reset({
      id: row.id,
      name: row.name ?? "",
      lastName: "",

      email: row.email ?? "",
      phoneNumber: row.phoneNumber ?? "",
      status: formStatus,
    });
    setActive(true);
  };

  const handleDelete = async (guestId: string) => {
    if (!guestId) return;
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet invité ?"))
      return;
    try {
      const res = await deleteRequest(`${PROVIDER.DELETE_GUEST}/${guestId}`);
      if (res?.status === 200) {
        toast.success("Invité supprimé");
        fetchGuestDetails();
        fetchGuestOverview();
      } else {
        toast.error("Échec de la suppression de l’invité");
      }
    } catch (e) {
      console.error("Delete guest error:", e);
      toast.error("Failed to remove guest");
    }
  };

  const handleResendInvitationForGuest = async (guestId: string) => {
    if (!guestId) return;
    try {
      await postRequest(
        `${PROVIDER.RESEND_INVITATION}/${guestId}/resend-invitation`,
      );
      toast.success("Invitation renvoyée");
    } catch (e) {
      console.error("Échec du renvoi de l’invitation:", e);
      toast.error("Échec du renvoi de l’invitation");
    }
  };

  const resendPendingInvitations = async () => {
    try {
      const pending = guestRows.filter(
        (g) => (g.status ?? "").toLowerCase() === "pending",
      );
      if (pending.length === 0) {
        toast.info("Aucune invitation en attente trouvée");
        return;
      }
      for (const g of pending) {
        try {
          await postRequest(
            `${PROVIDER.RESEND_INVITATION}/${g.id}/resend-invitation`,
          );
        } catch (e) {
          console.error("Failed to resend for", g.id, e);
        }
      }
      toast.success("Tentatives de renvoi terminées");
    } catch (e) {
      console.error("Bulk resend failed:", e);
      toast.error("Échec du renvoi des invitations");
    }
  };

  const getProgress = (used?: number | null, total?: number | null) => {
    const u = Number(used || 0);
    const t = Number(total || 0) || 1;
    return t === 0 ? 0 : Math.round((u / t) * 100);
  };
  const [guestTab, setGuestTab] = useState("Aperçu");
  const [tables, setTables] = useState([]);
  const [unassignedGuests, setUnassignedGuests] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableModal, setTableModal] = useState(false);

  // INITIALIZE GUESTS INTO UNASSIGNED SECTION
  useEffect(() => {
    if (guestRows?.length > 0) {
      const unseated = guestRows.filter((g) => !g.tableId);
      setUnassignedGuests(unseated);
    }
  }, [guestRows]);

  // TABLE SIZE CAPACITY
  const SIZE_CAPACITY = {
    small: 4,
    medium: 6,
    large: 8,
  };

  // ADD TABLE
  const addTable = () => {
    const newTable = {
      id: "table-" + Date.now(),
      name: "Table " + (tables.length + 1),
      shape: "round",
      size: "medium",
      color: "#E5E5E5",
      rotation: 0,
      x: 300, // position
      y: 200,
      guests: [],
      capacity: SIZE_CAPACITY["medium"],
    };
    setTables([...tables, newTable]);
  };

  // UPDATE TABLE
  const updateTable = (updated) => {
    setTables((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // DELETE TABLE
  const deleteTable = (id) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
  };

  // DRAG TABLE
  const handleTableDrag = (e, tableId) => {
    const rect = e.target.getBoundingClientRect();
    const updatedTables = tables.map((t) => {
      if (t.id === tableId) {
        return {
          ...t,
          x: e.clientX - rect.width / 2,
          y: e.clientY - rect.height / 2,
        };
      }
      return t;
    });
    setTables(updatedTables);
  };

  // ASSIGN GUEST TO TABLE
  const seatGuest = (guest, tableId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId && t.guests.length < t.capacity) {
          return { ...t, guests: [...t.guests, guest] };
        }
        return t;
      }),
    );

    // remove from unassigned list
    setUnassignedGuests((prev) => prev.filter((g) => g.id !== guest.id));
  };

  // AUTO GENERATION — SPREAD EVENLY
  const autoGenerateSeating = () => {
    const guests = [...unassignedGuests];
    const updated = tables.map((t) => ({ ...t, guests: [] }));

    let tableIndex = 0;

    guests.forEach((guest) => {
      const t = updated[tableIndex];
      if (t.guests.length < t.capacity) {
        t.guests.push(guest);
      }

      tableIndex = (tableIndex + 1) % updated.length;
    });

    setTables(updated);
    setUnassignedGuests([]);
  };

  // SAVE PAYLOAD → CONSOLE
  const savePlan = () => {
    const payload = {
      eventId,
      tables: tables.map((t) => ({
        id: t.id,
        name: t.name,
        shape: t.shape,
        size: t.size,
        rotation: t.rotation,
        color: t.color,
        x: t.x,
        y: t.y,
        capacity: t.capacity,
        guests: t.guests.map((g) => ({
          guestId: g.id,
          name: g.name,
        })),
      })),
    };

    toast.success("Plan enregistré dans la console !");
  };

  return (
    <>
      
        <div className="mb-6 space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="flex gap-1 items-center mb-2 cursor-pointer text-sm hover:text-secondary bg-secondary hover:bg-tertiary !text-white px-3 py-1 rounded-lg"
            data-no-translate
          >
            {" "}
            <ArrowLeft size={16} /> Retour
          </button>
          <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0">
            Gérer les invités
          </h1>
          <p className="text-gray-600  dark:text-neutral-300">
            Gérez tout ce qui concerne vos invités, de l'invitation au
            placement.
          </p>
        </div>

        <div className="event-wrapper">
          <div className="flex p-1 bg-gray-100 dark:bg-darkmode rounded-lg">
            {["Aperçu", "Liste des invités", "Plan de table"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setGuestTab(tab)}
                className={`flex-1 py-1 text-center rounded-lg cursor-pointer font-medium capitalize ${
                  guestTab === tab
                    ? "bg-white text-secondary"
                    : "text-gray-500 hover:text-secondary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {guestTab === "Aperçu" && (
            <div className="mt-5 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                  title="Nombre total de clients"
                  icon={<Users size={20} />}
                  color="bg-blue-500"
                  used={guestOverview?.total_guest}
                  total={guestOverview?.total_guest}
                />

                <StatCard
                  title="Confirmé"
                  icon={<Users size={20} />}
                  color="bg-green-500"
                  used={guestOverview?.accepted}
                  total={guestOverview?.total_guest}
                  progress={getProgress(
                    guestOverview?.accepted,
                    guestOverview?.total_guest,
                  )}
                />

                <StatCard
                  title="En attente"
                  icon={<Users size={20} />}
                  color="bg-yellow-500"
                  used={guestOverview?.pending}
                  total={guestOverview?.total_guest}
                  progress={getProgress(
                    guestOverview?.pending,
                    guestOverview?.total_guest,
                  )}
                />

                <StatCard
                  title="Refusé"
                  icon={<Users size={20} />}
                  color="bg-red-500"
                  used={guestOverview?.declined}
                  total={guestOverview?.total_guest}
                  progress={getProgress(
                    guestOverview?.declined,
                    guestOverview?.total_guest,
                  )}
                />
                {/* 
                <StatCard
                  title="Invited"
                  icon={<Users size={20} />}
                  color="bg-purple-500"
                  used={guestOverview?.invited}
                  total={guestOverview?.total_guest}
                  progress={getProgress(
                    guestOverview?.invited,
                    guestOverview?.total_guest
                  )}
                /> */}
              </div>

              <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
                <span className="text-xl heading-font font-semibold mb-4 block dark:text-neutral-100">
                  Actions rapides
                </span>

                <div>
                  <Button size="medium" onClick={resendPendingInvitations}>
                    Envoyer les invitations en attente
                  </Button>
                </div>
              </div>
            </div>
          )}

          {guestTab === "Liste des invités" && (
            <div className="mt-6 space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
              <div className="flex flex-col-reverse lg:flex-row gap-3 justify-between lg:items-center">
                <div className="events-tabs flex flex-nowrap gap-3 overflow-x-auto w-full">
                  {(
                    [
                      "Tous",
                      "Accepté",
                      "En attente",
                      "Refusé",
                    ] as FilterTab[]
                  ).map((tab) => (
                    <span
                      key={tab}
                      className={`${tabBase} ${
                        isActiveTab(tab)
                          ? "bg-secondary text-white"
                          : "bg-gray-100 text-gray-600 dark:bg-[#0A0A0A] dark:text-neutral-300"
                      }`}
                      onClick={() => handleTabClick(tab)}
                    >
                      {tab}
                    </span>
                  ))}
                </div>

                <div className="shrink-0">
                  <Button variant="primary" size="medium" onClick={openAdd}>
                    <Plus size={18} /> Ajouter un invité
                  </Button>
                </div>
              </div>

              <div className="events-tabs__content space-y-6">
                <div className="overflow-x-auto rounded-3xl border border-borderlight dark:border-neutral-700">
                  <table className="w-full border-collapse text-left dark:text-neutral-300">
                    <thead>
                      <tr>
                        <th className="bg-white dark:bg-darkmode dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                          Nom
                        </th>
                        <th className="bg-white dark:bg-darkmode dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                          E-mail
                        </th>
                        <th className="bg-white dark:bg-darkmode dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                          Statut
                        </th>
                        <th className="bg-white dark:bg-darkmode dark:text-neutral-300 px-3 py-4 border-b border-borderlight dark:border-neutral-700 text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loadingGuests ? (
                        <TableSkeletonRows rows={5} />
                      ) : guestRows.length === 0 ? (
                        <tr>
                          <td
                            className="text-center px-3 py-4 border-b border-borderlight dark:border-neutral-700"
                            colSpan={4}
                          >
                            Aucun invité trouvé
                          </td>
                        </tr>
                      ) : (
                        guestRows.map((g) => (
                          <tr key={g.id}>
                            <td className="px-3 py-4 dark:text-neutral-300 border-b border-borderlight dark:border-neutral-700 text-sm">
                              {g.name}
                            </td>

                            <td className="px-3 py-4 dark:text-neutral-300 border-b border-borderlight dark:border-neutral-700 text-sm">
                              {g.email}
                            </td>

                            <td className="px-3 py-4 dark:text-neutral-300 border-b border-borderlight dark:border-neutral-700 text-sm">
                              {g.status ? (
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                    g.status === "accepted"
                                      ? "bg-green-100 text-green-700"
                                      : g.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : g.status === "declined"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {g.status}
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-md bg-gray-300 text-gray-700 dark:text-neutral-300 text-sm">
                                  N/A
                                </span>
                              )}
                            </td>

                            <td className="px-3 py-4 dark:text-neutral-300 border-b border-borderlight dark:border-neutral-700 text-sm">
                              <div className="flex gap-3">
                                <button
                                  className="text-blue-600 hover:underline cursor-pointer text-sm"
                                  onClick={() => openEdit(g)}
                                >
                                  Modifier
                                </button>
                                <button
                                  className="text-yellow-600 hover:underline cursor-pointer text-sm"
                                  onClick={() =>
                                    handleResendInvitationForGuest(g.id)
                                  }
                                >
                                  Renvoyer
                                </button>
                                <button
                                  className="text-red-600 hover:underline cursor-pointer text-sm"
                                  onClick={() => handleDelete(g.id)}
                                >
                                  Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {fetchError && (
                  <p className="text-red-500 text-sm mt-1">{fetchError}</p>
                )}
              </div>
            </div>
          )}

          {guestTab === "Plan de table" && (
            <SeatingPlan eventId={eventId} guests={guestRows} />
          )}
        </div>
      

      {/* MODAL  */}
      <OuterModal active={active} setActive={setActive}>
        <div className="w-full max-w-[calc(100%-16px)] md:max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          
		   <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => setActive(false)}
          />
          <div className="mb-6 space-y-4">
          <h2 className="text-2xl mb-0 font-bold text-center dark:text-neutral-300 capitalize">
            {isEdit ? "Modifier les invités" : "Inviter des invités"}
          </h2>

          <p className="text-gray-600 text-center dark:text-neutral-300">
            {isEdit
              ? "Mettre à jour les informations de l’invité"
              : "Renseignez les informations pour inviter l’invité"}
          </p>
          </div>

          <div className="event-create mt-10">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" {...register("id")} />

              <div>
                <InputGroup
                  label="Nom"
                  placeholder="Saisir le nom"
                  error={errors.name}
                  inputProps={register("name")}
                />
              </div>

              <div>
                <InputGroup
                  type="email"
                  label="E-mail"
                  placeholder="Saisir l’adresse e-mail"
                  error={errors.email}
                  inputProps={register("email")}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="status"
                  render={({ field: { onChange, value } }) => (
                    <CustomSelect
                      label="Statut"
                      placeholder="Sélectionnez un statut"
                      options={statusOptions}
                      value={
                        statusOptions.find((opt) => opt.value === value) || null
                      }
                      onChange={(opt: any) => {
                        const val = Array.isArray(opt)
                          ? "invited"
                          : ((opt?.value as FormValues["status"]) ?? "invited");
                        onChange(val);
                      }}
                      error={errors.status?.message}
                    />
                  )}
                />
              </div>

              <div className="flex gap-4 justify-between mt-10">
                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isEdit
                      ? "Mise à jour en cours..."
                      : "Soumission en cours..."
                    : isEdit
                      ? "Modifier les invités"
                      : "Ajouter un nouvel invité"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </OuterModal>
      
    </>
  );
}

export default Manageguest;
