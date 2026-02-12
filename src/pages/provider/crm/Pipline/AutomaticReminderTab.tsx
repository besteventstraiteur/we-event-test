import {
  AlertCircle,
  BellDot,
  Clock,
  Edit,
  Euro,
  Plus,
  Target,
  Trash,
  TrendingUp,
  X,
} from "lucide-react";
import Staticscard from "../../Sales/Statics-card";
import Button from "../../../../components/ui/Button";
import OuterModal from "../../../../components/Custommodal/OuterModal";
import CustomSelect from "../../../../components/ui-main/selectBox";
import InputGroup from "../../../../components/ui-main/InputGroup";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { PROVIDER } from "../../../../utils/endPoints";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "../../../../utils/http-client/axiosClient";

interface Props {
  onCreate: () => void;
}

const reminderSchema = yup.object({
  documentType: yup.string().required(),
  reminderType: yup.string().required(),
  delayDays: yup.number().required().min(1),
  maxRetries: yup.number().required().min(1),
  intervalDays: yup.number().required().min(1),
  customSubject: yup.string().optional(),
  customMessage: yup.string().optional(),
  isActive: yup.boolean(),
});

type ReminderFormValues = yup.InferType<typeof reminderSchema>;

const documentOptions = [
  { label: "Devis", value: "quote" },
  { label: "Facture", value: "invoice" },
];

const reminderTypeOptions = [
  { label: "Sans réponse", value: "no_response" },
  { label: "Expire bientôt", value: "expires_soon" },
];

const AutomaticReminderTab = ({ onCreate }: Props) => {
  const [restartModal, setRestartModal] = useState(false);
  const [priorityValue, setPriorityValue] = useState("");
  const [reminders, setReminders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [btnloading, setBtnLoading] = useState(false);

  const [editingReminder, setEditingReminder] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ReminderFormValues>({
    resolver: yupResolver(reminderSchema),
    defaultValues: {
      documentType: "invoice",
      reminderType: "expires_soon",
      delayDays: 7,
      maxRetries: 3,
      intervalDays: 7,
      customSubject: "",
      customMessage: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: ReminderFormValues) => {
    setBtnLoading(true);
    const payload = {
      ...data,
    };

    if (editingReminder) {
      await patchRequest(
        `${PROVIDER.PIPLINE}/reminder/${editingReminder.id}`,
        payload,
      );
    } else {
      await postRequest(`${PROVIDER.PIPLINE}/reminder`, payload);
    }

    setRestartModal(false);
    setEditingReminder(null);
    reset();
    fetchReminders();
    setBtnLoading(false);
  };

  const toggleReminder = async (id: string) => {
    await patchRequest(`${PROVIDER.PIPLINE}/reminder/${id}/toggle`);
    fetchReminders();
  };

  const deleteReminder = async (id: string) => {
    await deleteRequest(`${PROVIDER.PIPLINE}/reminder/${id}`);
    fetchReminders();
  };

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await getRequest(`${PROVIDER.PIPLINE}/reminder`);
      setReminders(res.data.data.configs || []);
      setStats(res.data.data.stats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const openEditReminder = (item: any) => {
    setEditingReminder(item);

    reset({
      documentType: item.documentType,
      reminderType: item.reminderType,
      delayDays: item.delayDays,
      maxRetries: item.maxRetries,
      intervalDays: item.intervalDays,
      customSubject: item.customSubject,
      customMessage: item.customMessage,
      isActive: item.isActive,
    });

    setRestartModal(true);
  };

  return (
    <>
      {" "}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <Staticscard
            heading="Configurations"
            value={stats?.configurations?.total || 0}
            subheading={`${stats?.configurations?.active || 0} actifs`}
            bgcolor="bg-blue-100"
            icon={<Euro size={20} />}
            iconcolor="text-blue-600"
          />

          <Staticscard
            heading="Rappels envoyés"
            value={stats?.remindersSent || 0}
            subheading="total"
            bgcolor="bg-green-100"
            icon={<Target size={20} />}
            iconcolor="text-green-600"
          />

          <Staticscard
            heading="Se désabonner"
            value={stats?.unsubscriptions || 0}
            subheading="les clients se désinscrivent"
            bgcolor="bg-yellow-100"
            icon={<Clock size={20} />}
            iconcolor="text-yellow-600"
          />

          <Staticscard
            heading="Taux de désabonnement"
            value={`${stats?.optOutRate || 0}%`}
            subheading="taux"
            bgcolor="bg-purple-100"
            icon={<TrendingUp size={20} />}
            iconcolor="text-purple-600"
          />
        </div>

        <div className="flex gap-2 border border-gray-200 dark:border-neutral-700 p-4 rounded-lg bg-white dark:bg-neutral-600">
          <AlertCircle
            size={20}
            className="text-gray-600 dark:text-neutral-300 shrink-0"
          />
          <p className="text-sm text-gray-600 dark:text-neutral-300">
            <span className="font-bold">Conformité au RGPD:</span> Tous les
            e-mails de suivi incluent automatiquement un lien de désabonnement
            permettant à vos clients de se désinscrire des suivis automatisés.
          </p>
        </div>

        <div>
          <div className="flex justify-between items-start gap-3">
            <div>
              <span className="text-xl font-bold tracking-wider capitalize dark:text-neutral-100">
                Paramètres de redémarrage
              </span>
            </div>

            <div>
              <Button onClick={() => setRestartModal(true)}>
                <Plus size={18} />
                Nouveau lancement
              </Button>
            </div>
          </div>
        </div>

        {reminders.length > 0 ? (
          <div className="space-y-4">
            {reminders.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between gap-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-4 rounded-lg"
              >
                <div>
                  <div className="flex gap-2 mb-3">
                    <span className="bg-amber-100 px-3 py-1 text-sm rounded-full capitalize">
                      {item.reminderType.replace("_", " ")}
                    </span>
                    <span className="bg-gray-100 border border-borderlight px-3 py-1 text-sm rounded-full capitalize">
                      {item.documentType}
                    </span>
                  </div>

                  <h4 className="font-semibold dark:text-neutral-100">
                    Redémarrer après {item.delayDays} jours
                  </h4>

                  <p className="text-gray-600 dark:text-neutral-400 text-sm">
                    Maximum: {item.maxRetries} reminders • {item.intervalDays}-
                    Intervalle de jours
                  </p>

                  {item.customSubject && (
                    <p className="text-gray-600 dark:text-neutral-400 text-sm">
                      Suivi: {item.customSubject}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* TOGGLE */}
                  <label className="flex items-center cursor-pointer relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.isActive}
                      onChange={() => toggleReminder(item.id)}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-secondary transition-colors"></div>
                    <div className="absolute ml-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
                  </label>

                  {/* EDIT */}

                  <button
                    onClick={() => openEditReminder(item)}
                    className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
                  >
                    <Edit
                      size={14}
                      className="text-gray-600 dark:text-neutral-300"
                    />

                    <span
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                                                         opacity-0 group-hover:opacity-100
                                                         bg-gray-800 text-white text-xs px-2 py-1 rounded
                                                         transition-opacity duration-300 whitespace-nowrap"
                    >
                      Modifier
                    </span>
                  </button>

                  {/* DELETE */}

                  <button
                    onClick={() => deleteReminder(item.id)}
                    className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
                  >
                    <Trash
                      size={14}
                      className="text-gray-600 dark:text-neutral-300"
                    />

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
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 p-5 md:p-12">
            <BellDot size={50} className="text-gray-400" />
            <span className="text-xl dark:text-neutral-100 mt-5">Aucun rappel configuré</span>
            <p className="text-gray-600 dark:text-neutral-300 mb-6">
              Créez votre premier rappel automatique pour les devis ou factures.
            </p>
            <Button onClick={() => setRestartModal(true)}>
              <Plus /> Créer une relance
            </Button>
          </div>
        )}
      </div>
      <OuterModal active={restartModal} setActive={setRestartModal}>
        <div className="w-full max-w-4xl mx-auto relative p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] bg-white dark:bg-[#1E1E1E] rounded-2xl">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-white"
            onClick={() => setRestartModal(false)}
          />

          <div className="mb-6">
          <h2 className="text-2xl font-bold mb-0 dark:text-neutral-100">
            Nouveau redémarrage automatique
          </h2>
          </div>  

          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* SELECTS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <CustomSelect
                  label="Type de document"
                  options={documentOptions}
                  value={documentOptions.find(
                    (opt) => opt.value === watch("documentType"),
                  )}
                  onChange={(val) => {
                    setValue("documentType", val?.value as string, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  error={errors.documentType?.message}
                />
              </div>

              <div className="flex-1">
                <CustomSelect
                  label="Type de stimulus"
                  options={reminderTypeOptions}
                  value={reminderTypeOptions.find(
                    (opt) => opt.value === watch("reminderType"),
                  )}
                  onChange={(val) => {
                    setValue("reminderType", val?.value as string, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                  error={errors.reminderType?.message}
                />
              </div>
            </div>

            {/* NUMBERS */}
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1">
                <InputGroup
                  type="number"
                  label="Délai de livraison (jours)"
                  error={errors.delayDays}
                  inputProps={{
                    ...register("delayDays", { valueAsNumber: true }),
                  }}
                />
              </div>
              <div className="flex-1">
                <InputGroup
                  type="number"
                  label="Nombre maximal de rappels"
                  error={errors.maxRetries}
                  inputProps={{
                    ...register("maxRetries", { valueAsNumber: true }),
                  }}
                />
              </div>
              <div className="flex-1">
                <InputGroup
                  type="number"
                  error={errors.intervalDays}
                  label="Intervalle (jours)"
                  inputProps={{
                    ...register("intervalDays", { valueAsNumber: true }),
                  }}
                />
              </div>
            </div>

            <div>
              <InputGroup
                label="Article personnalisé (facultatif)"
                error={errors.customSubject}
                inputProps={{
                  ...register("customSubject"),
                }}
              />
            </div>

            <div>
              <InputGroup
                type="textarea"
                label="Message personnalisé (facultatif)"
                error={errors.customMessage}
                inputProps={{
                  ...register("customMessage"),
                }}
              />
            </div>

            <label className="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register("isActive")}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-secondary transition-colors"></div>
              <div className="absolute ml-1 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
              <span className="ms-2 text-sm dark:text-neutral-300">
                Activez ce redémarrage
              </span>
            </label>

            {/* ACTIONS */}
            <div className="flex flex-col md:flex-row gap-3 mt-7">
              <Button
                type="button"
                className="flex-1"
                variant="outline"
                onClick={() => setRestartModal(false)}
              >
                Annuler
              </Button>
              <Button className="flex-1" loading={btnloading} type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>
    </>
  );
};

export default AutomaticReminderTab;
