import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Edit,
  GitBranch,
  Plus,
  Trash,
  X,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Globaltabs from "../Sales/Globaltabs";
import InputGroup from "../../../components/ui-main/InputGroup";
import CustomSelect from "../../../components/ui-main/selectBox";
import { Fragment, useEffect, useState } from "react";
import OuterModal from "../../../components/Custommodal/OuterModal";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "../../../utils/toast";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import AutomaticReminderTab from "./Pipline/AutomaticReminderTab";
import HistoricalTab from "./Pipline/HistoricalTab";

const priority = [
  { value: "paid", label: "Payé" },
  { value: "unpaid", label: "Impayé" },
  { value: "late", label: "En retard" },
];
export const pipelineSchema = yup.object({
  name: yup.string().required("Le nom du pipeline est requis"),
  isDefault: yup.boolean().optional(),
});

type Stage = {
  id: string;
  name: string;
  order: number;
};

const Automation = () => {
  const [btnLoading, setButtonLoading] = useState(false);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  type PipelineFormValues = {
    name: string;
    isDefault: boolean;
  };
  type Pipeline = {
    id: string;
    name: string;
    isDefault: boolean;
  };
  const [priorityValue, setPriorityValue] = useState("");
  const [pipelineModal, setPipelineModal] = useState(false);
  const [stepsModal, setstepsModal] = useState(false);
  const [restartModal, setRestartModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(
    null,
  );
  const [stages, setStages] = useState<Stage[]>([]);
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PipelineFormValues>({
    resolver: yupResolver(pipelineSchema),
    defaultValues: {
      name: "",
      isDefault: false,
    },
  });

  const {
    register: stageRegister,
    handleSubmit: handleStageSubmit,
    reset: resetStageForm,
  } = useForm<{ name: string; order: number }>({
    defaultValues: {
      name: "",
      order: 1,
    },
  });

  const toast = useToast();

  // submit (add + edit)
  const onSubmitPipeline = async (data: PipelineFormValues) => {
    setButtonLoading(true);

    const payload = {
      name: data.name,
      isDefault: data.isDefault,
    };

    try {
      if (editingPipeline) {
        await patchRequest(
          `${PROVIDER.PIPLINE}/${editingPipeline.id}`,
          payload,
        );
      } else {
        await postRequest(PROVIDER.PIPLINE, payload);
      }

      setPipelineModal(false);
      setEditingPipeline(null);
      reset();
      fetchPipline();
    } catch (err) {
      toast.error(err?.response?.data?.message || "L’action sur le pipeline a échoué");
    } finally {
      setButtonLoading(false);
    }
  };

  const fetchPipline = async () => {
    setloading(true);
    try {
      const res = await getRequest(`${PROVIDER.PIPLINE}/list`);
      const list = res.data?.data || [];

      setPipelines(list);

      if (list.length && !selectedPipelineId) {
        setSelectedPipelineId(list[0].id);
        fetchStages(list[0].id);
      }
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchPipline();
  }, []);

  const openAddPipeline = () => {
    setEditingPipeline(null);
    reset({ name: "", isDefault: false });
    setPipelineModal(true);
  };

  const openEditPipeline = (item: Pipeline) => {
    setEditingPipeline(item);
    reset({
      name: item.name,
      isDefault: item.isDefault,
    });
    setPipelineModal(true);
  };

  const fetchStages = async (pipelineId: string) => {
    try {
      const res = await getRequest(
        `${PROVIDER.STAGE}/${pipelineId}/stages/list`,
      );
      setStages(res.data.data.sort((a, b) => a.order - b.order));
    } catch (err) {
      toast.error("Impossible de récupérer les étapes");
    }
  };

  const handleSaveStage = async (data: { name: string; order: number }) => {
    if (!selectedPipelineId) {
      toast.error("Veuillez d’abord sélectionner un pipeline");
      return;
    }

    setButtonLoading(true);

    try {
      if (editingStage) {
        await patchRequest(
          `${PROVIDER.PIPLINE}/${selectedPipelineId}/stages/${editingStage.id}`,
          data,
        );
      } else {
        await postRequest(
          `${PROVIDER.PIPLINE}/${selectedPipelineId}/stages`,
          data,
        );
      }

      setStageModalOpen(false);
      setEditingStage(null);
      fetchStages(selectedPipelineId);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Échec de l’enregistrement de l’étape");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    setButtonLoading(true);

    if (!selectedPipelineId) return;

    try {
      await deleteRequest(
        `${PROVIDER.PIPLINE}/${selectedPipelineId}/stages/${stageId}`,
      );
      fetchStages(selectedPipelineId);
    } catch (err) {
      toast.error("Échec de la suppression de l’étape");
    }
    setButtonLoading(false);
  };

  useEffect(() => {
    if (!stageModalOpen) return;

    if (editingStage) {
      resetStageForm({
        name: editingStage.name,
        order: editingStage.order,
      });
    } else {
      resetStageForm({
        name: "",
        order: stages.length + 1,
      });
    }
  }, [stageModalOpen, editingStage]);

  return (
    <>
  
        <div className="mb-6 space-y-4">
          <h2 className="text-2xl font-bold tracking-wider capitalize dark:text-neutral-100 mb-0">
            Automatisation et pipelines
          </h2>
          <p className="text-gray-600 dark:text-neutral-300">
            Gérez vos entonnoirs de vente et configurez vos suivis automatisés.
          </p>
        </div>

        <div className="space-y-6">
          <Globaltabs
            tabs={[
              {
                label: "Pipeline et étapes",
                content: (
                  <>
                    <div className="space-y-6">
                      <div className="flex gap-2 border border-gray-200 dark:border-neutral-700 p-4 rounded-lg bg-white dark:bg-neutral-600">
                        <AlertCircle
                          size={20}
                          className="text-gray-600 dark:text-neutral-300 shrink-0"
                        />
                        <p className="text-sm text-gray-600 dark:text-neutral-300">
                          <span className="font-bold">Pipelines</span> Vous
                          pouvez ainsi organiser vos opportunités de vente par
                          étapes. Créez un pipeline pour chaque type d'activité
                          (par exemple, mariages, événements d'entreprise) avec
                          des étapes personnalisées.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div>
                          <span className="text-xl font-bold tracking-wider capitalize dark:text-neutral-100">
                            Mes Pipelines
                          </span>
                          <p className="text-sm text-gray-600 dark:text-neutral-300 mt-1">
                            Gérez vos parcours de vente
                          </p>
                        </div>

                        <div>
                          <Button onClick={() => setPipelineModal(true)}>
                            <Plus size={18} />
                            Nouveau pipeline
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {pipelines?.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setSelectedPipelineId(item.id);
                              fetchStages(item.id);
                            }}
                            role="button"
                            className={`border border-borderlight dark:border-neutral-800 p-6 rounded-lg  relative pr-8
  ${selectedPipelineId === item.id ? "border-secondary bg-gray-100 dark:bg-darkmode" : "bg-white dark:bg-neutral-800 "}`}
                          >
                            <div className="absolute flex gap-2 top-6 right-6">
                              <button
                                onClick={() => openEditPipeline(item)}
                                className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
                              >
                                <Edit size={14} className="text-gray-600 dark:text-neutral-300" />
                                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                  Modifier
                                </span>
                              </button>
                            </div>

                            <div className="flex gap-2 mb-2">
                              <GitBranch className="text-blue-600 shrink-0" />
                              <span className="text-base capitalize dark:text-neutral-300">
                                {item.name}
                              </span>
                            </div>

                            {item.isDefault && (
                              <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                                <CheckCircle2 size={16} /> Par défaut
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <span className="text-xl font-bold tracking-wider capitalize dark:text-neutral-100">
                              Étapes du pipeline
                            </span>
                            <p className="text-sm text-gray-600 dark:text-neutral-300 mt-1">
                              Définissez les différentes étapes de votre
                              processus de vente
                            </p>
                          </div>

                          <div>
                            <Button
                              onClick={() => {
                                setEditingStage(null);
                                setStageModalOpen(true);
                              }}
                            >
                              <Plus size={18} />
                              Ajouter une étape
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-nowrap overflow-x-auto items-center gap-3 pt-4 pb-3">
                        {stages.map((stage, index) => (
                          <Fragment key={stage.id}>
                            <div className="bg-white dark:bg-neutral-800 w-48 shrink-0  border-gray-200 dark:border-neutral-700 p-4 rounded-lg relative">
                              <div className="flex flex-col items-start gap-2">
                                <span className="text-xs py-1 px-3 rounded-full border dark:text-neutral-300">
                                  #{stage.order}
                                </span>
                                <div className="text-sm pr-10 capitalize dark:text-neutral-300">
                                  {stage.name}
                                </div>
                              </div>

                              {/* ACTIONS */}
                              <div className="flex gap-2 absolute top-4 right-4">
                                <button
                                  onClick={() => {
                                    setEditingStage(stage);
                                    setStageModalOpen(true);
                                  }}
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

                                <button
                                  onClick={() => handleDeleteStage(stage.id)}
                                  className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
                                >
                                  <Trash size={14}
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

                            {index !== stages.length - 1 && (
                              <ArrowRight size={18} />
                            )}
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                ),
              },
              {
                label: "Rappel automatique",
                content: (
                  <>
                    <AutomaticReminderTab />
                  </>
                ),
              },
              {
                label: "Historique",
                content: (
                  <>
                    <HistoricalTab />
                  </>
                ),
              },
            ]}
          />
        </div>


      <OuterModal active={pipelineModal} setActive={setPipelineModal}>
        <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden mx-auto relative p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F]  rounded-2xl bg-white dark:bg-[#1E1E1E]">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-white"
            onClick={() => setPipelineModal(false)}
          />

          <div className="mb-6 space-y-4">
            <h2 className="text-xl font-bold dark:text-neutral-100 mb-0">
              {" "}
              {editingPipeline ? "Modifier le pipeline" : "Nouveau pipeline"}
            </h2>
            <p className="text-gray-600 dark:text-neutral-300">
              Un pipeline représente votre processus de vente avec ses
              différentes étapes.
            </p>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            <form
              className="space-y-3"
              onSubmit={handleSubmit(onSubmitPipeline)}
            >
              <div>
              <InputGroup
                label="Nom du pipeline*"
                placeholder="Ex : Pipeline Mariages 2024"
                error={errors.name}
                inputProps={{
                  ...register("name"),
                }}
              />
              </div> 

              <div>
              <label className="flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  {...register("isDefault")}
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-secondary transition-colors"></div>
                <div className="absolute ml-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></div>
                <span className="ms-2 text-sm dark:text-neutral-300">Pipeline par défaut</span>
              </label>
              </div>    

              <div className="flex flex-col sm:flex-row gap-3 justify-between mt-10">
                <Button
                  className="flex-1"
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPipelineModal(false);
                    reset();
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
        </div>
      </OuterModal>

      <OuterModal active={stepsModal} setActive={setstepsModal}>
        <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden mx-auto relative p-5 md:p-8 rounded-2xl bg-white dark:bg-black">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setstepsModal(false);
            }}
          />

          <div className="mb-6">
            <h2 className="text-2xl font-bold dark:text-neutral-300">
              New stage
            </h2>
            <p className="text-gray-600 text-sm">
              Define a step in your sales process
            </p>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            <form className="space-y-3">
              <div>
                <InputGroup
                  type="text"
                  label="Step name *"
                  placeholder="Example: Quote sent"
                />
              </div>

              <div>
                <InputGroup type="number" label="Order *" placeholder="1" />
              </div>
              <p className="text-gray-600 text-xs">
                Position of this step in the pipeline (1, 2, 3...)
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between mt-7">
                <Button
                  className="flex-1"
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setstepsModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button loading={btnLoading} className="flex-1" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </OuterModal>

      <OuterModal active={restartModal} setActive={setRestartModal}>
        <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden mx-auto relative p-5 md:p-8 rounded-2xl bg-white dark:bg-black">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setRestartModal(false);
            }}
          />

          <div className="mb-6">
            <h2 className="text-2xl font-bold dark:text-neutral-300">
              New automatic restart
            </h2>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            <form className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <CustomSelect
                    label="Document type"
                    options={priority}
                    value={priorityValue}
                    onChange={setPriorityValue}
                    placeholder="Select Pipeline"
                    className="w-full min-w-60"
                  />
                </div>
                <div className="flex-1">
                  <CustomSelect
                    label="Type of stimulus"
                    options={priority}
                    value={priorityValue}
                    onChange={setPriorityValue}
                    placeholder="Select stage"
                    className="w-full min-w-60"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <InputGroup
                    type="number"
                    label="Delivery time (days)"
                    placeholder=""
                  />
                </div>
                <div className="flex-1">
                  <InputGroup
                    type="number"
                    label="Maximum number of reminders"
                    placeholder=""
                  />
                </div>

                <div className="flex-1">
                  <InputGroup
                    type="number"
                    label="Interval (days)"
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <InputGroup
                  type="text"
                  label="Custom item (optional)"
                  placeholder="Example: Follow-up regarding your quote..."
                />
              </div>

              <div>
                <div>
                  <InputGroup
                    label="Personalized message (optional)"
                    type="textarea"
                    placeholder="Example: Hello, we are getting back to you regarding..."
                  />
                </div>
                <p className="text-gray-600 text-xs">
                  If empty, a default message will be used.
                </p>
              </div>

              <label className="flex items-center cursor-pointer relative">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-secondary transition-colors"></div>
                <div className="absolute ml-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-transform"></div>
                <span className="ms-2 text-sm">Activate this restart</span>
              </label>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between mt-7">
                <Button
                  className="flex-1"
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRestartModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </OuterModal>

      {/* stage */}

      <OuterModal active={stageModalOpen} setActive={setStageModalOpen}>
        <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden mx-auto relative p-5 md:p-8 rounded-2xl border-2 border-transparent dark:border-[#2F2F2F] bg-white dark:bg-[#1E1E1E]">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-white"
            onClick={() => setStageModalOpen(false)}
          />
          <div className="mb-6">
            <h2 className="text-2xl font-bold dark:text-neutral-100">
              {editingStage ? "Étape de modification" : "Nouvelle étape"}
            </h2>
          </div>
          <form
            onSubmit={handleStageSubmit(handleSaveStage)}
            className="space-y-3"
          >
            <div>
              <InputGroup
                label="Nom de l'étape*"
                inputProps={{
                  ...stageRegister("name", { required: true }),
                }}
              />
            </div>

            <div>
              <InputGroup
                type="number"
                label="Commande*"
                inputProps={{
                  ...stageRegister("order", { valueAsNumber: true }),
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-between mt-10">
              <Button
                variant="outline"
                type="button"
                className="flex-1"
                onClick={() => setStageModalOpen(false)}
              >
                Annuler
              </Button>
              <Button className="flex-1" type="submit" loading={btnLoading}>
                Sauvegarder
              </Button>
            </div>
          </form>
        </div>
      </OuterModal>
    </>
  );
};

export default Automation;
