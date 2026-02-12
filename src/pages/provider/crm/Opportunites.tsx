import {
  Clock,
  Euro,
  File,
  FileStack,
  Filter,
  Plus,
  Settings,
  Target,
  TrendingUp,
  X,
  Edit,
} from "lucide-react";

import Button from "../../../components/ui/Button";
import Globaltabs from "../Sales/Globaltabs";
import Staticscard from "../Sales/Statics-card";
import InputGroup from "../../../components/ui-main/InputGroup";
import CustomSelect from "../../../components/ui-main/selectBox";
import { useEffect, useState } from "react";
import OuterModal from "../../../components/Custommodal/OuterModal";
import CustomDatePicker from "../../../components/DatePicker";
import { useNavigate } from "react-router-dom";
import {
  getRequest,
  patchRequest,
  postRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "../../../utils/toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DashboardKpi from "./Kpi";

const opportunitySchema = yup.object({
  name: yup.string().required("Le nom est obligatoire"),
  contactId: yup.string().required("Le contact est obligatoire"),
  pipelineId: yup.string().required("Le pipeline est obligatoire"),
  stageId: yup.string().required("L’étape est obligatoire"),
  value: yup.number().required().min(1),
  probability: yup.number().min(0).max(100),
  expectedClose: yup.string().required(),
  description: yup.string().optional(),
});

const Opportunites = () => {
  const [priorityValue, setPriorityValue] = useState("");
  const [opportunityModal, setOpportunityModal] = useState(false);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(
    null
  );
  const [pageLoading, setPageLoading] = useState(false);
  const [moveLoading, setMoveLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(opportunitySchema),
  });

  const [stages, setStages] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [editingOpportunity, setEditingOpportunity] = useState<any | null>(
    null
  );

  // DATE PICKER
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const fetchPipline = async () => {
    setPageLoading(true);
    try {
      const res = await getRequest(`${PROVIDER.PIPLINE}/list`);
      const list = res.data?.data || [];

      setPipelines(list);

      // ✅ AUTO SELECT FIRST PIPELINE
      if (list.length && !selectedPipelineId) {
        setSelectedPipelineId(list[0].id);
        fetchStages(list[0].id);
        fetchOpportunities(list[0].id);
      }
    } finally {
      setPageLoading(false);
    }
  };

  const pipelineOptions = pipelines.map((p) => ({
    label: p.name,
    value: p.id,
  }));
  const fetchStages = async (pipelineId: string) => {
    setPageLoading(true);
    try {
      const res = await getRequest(
        `${PROVIDER.PIPLINE}/${pipelineId}/stages/list`
      );
      setStages(res.data.data || []);
    } finally {
      setPageLoading(false);
    }
  };

  const fetchOpportunities = async (pipelineId: string) => {
    setPageLoading(true);
    try {
      const res = await getRequest(
        `${PROVIDER.OPPURTINITES}/${pipelineId}/list`
      );
      setOpportunities(res.data.data || []);
    } finally {
      setPageLoading(false);
    }
  };

  const opportunitiesByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = opportunities.filter((opp) => opp.stageId === stage.id);
    return acc;
  }, {} as Record<string, any[]>);

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setMoveLoading(true);

    try {
      await postRequest(`${PROVIDER.OPPURTINITES}/move`, {
        opportunityId: draggableId,
        stageId: destination.droppableId,
      });

      await fetchOpportunities(selectedPipelineId!);
    } finally {
      setMoveLoading(false);
    }
  };

  const fetchContacts = async () => {
    const res = await getRequest(`${PROVIDER.GET_CONTACTS}?page=1&limit=50`);
    setContacts(res?.data?.data?.records || []);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    fetchPipline();
  }, []);

  const contactOptions = contacts.map((c) => ({
    label: `${c.name} (${c.email})`,
    value: c.id,
  }));
  const pipelineSelectOptions = pipelines.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  const stageSelectOptions = stages.map((s) => ({
    label: s.name,
    value: s.id,
  }));
  const toast = useToast();

  const onSubmit = async (data: any) => {
    setSubmitLoading(true);

    try {
      const payload = {
        name: data.name,
        contactId: data.contactId,
        pipelineId: data.pipelineId,
        stageId: data.stageId,
        value: data.value,
        probability: data.probability,
        expectedClose: data.expectedClose,
        description: data.description,
      };

      if (editingOpportunity) {
        await patchRequest(
          `${PROVIDER.OPPURTINITES}/${editingOpportunity.id}`,
          payload
        );
        toast.success("Opportunité mise à jour avec succès");
      } else {
        await postRequest(`${PROVIDER.OPPURTINITES}`, payload);
        toast.success("Opportunité créée avec succès");
      }

      await fetchOpportunities(selectedPipelineId!);
      setOpportunityModal(false);
      setEditingOpportunity(null);
      reset();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Échec de l’enregistrement de l’opportunité"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const openEditOpportunity = (opp: any) => {
    setEditingOpportunity(opp);

    reset({
      name: opp.name,
      contactId: opp.contact?.id,
      pipelineId: selectedPipelineId,
      stageId: opp.stageId,
      value: opp.value,
      probability: opp.probability,
      expectedClose: opp.expectedClose,
      description: opp.description || "",
    });

    fetchStages(selectedPipelineId!);

    setOpportunityModal(true);
  };

  const navigate = useNavigate();
  return (
    <>
      

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold tracking-wider capitalize dark:text-neutral-100">
              Opportunités et pipeline
              </h2>
            </div>

            <div className="flex flex-row flex-wrap items-center gap-3">
              <div className="bg-gray-200 text-sm text-gray-600 py-1 px-2 rounded-lg">
                {contacts?.length}  contact(s) disponible(s)
              </div>
              {pageLoading ? (
                <Skeleton height={38} width={240} borderRadius={20} />
              ) : (
                <CustomSelect
                  options={pipelineOptions}
                  value={pipelineOptions.find(
                    (p) => p.value === selectedPipelineId
                  )}
                  onChange={(val) => {
                    setSelectedPipelineId(val?.value);
                    fetchStages(val?.value);
                    fetchOpportunities(val?.value);
                  }}
                  placeholder="Sélectionner un pipeline"
                  className="min-w-60"
                />
              )}

              <Button size="medium" onClick={() => setOpportunityModal(true)}>
                <Plus size={18} /> Nouvelle opportunité
              </Button>

              <Button
                size="medium"
                variant="outline"
                onClick={() => navigate("/provider/automation")}
              >
                <Settings size={18} />
                Gestion des pipelines
              </Button>
            </div>
          </div>

          <Globaltabs
            tabs={[
              {
                label: "Vue du pipeline",
                content: (
                  <>
                    <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
                     
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <div
                          className={`flex gap-4 overflow-x-auto ${
                            moveLoading ? "pointer-events-none opacity-70" : ""
                          }`}
                        >
                          {/* 🔥 FETCH LOADING SKELETON */}
                          {pageLoading
                            ? Array.from({ length: 6 }).map((_, colIndex) => (
                                <div
                                  key={colIndex}
                                  className="w-72 bg-gray-100 dark:bg-neutral-800 rounded-xl p-3 shrink-0"
                                >
                                  <div className="flex justify-between mb-3">
                                    <Skeleton width={120} height={18} />
                                    <Skeleton width={20} height={18} />
                                  </div>

                                  <div className="space-y-3">
                                    {Array.from({ length: 2 }).map(
                                      (_, cardIndex) => (
                                        <Skeleton
                                          key={cardIndex}
                                          height={80}
                                          borderRadius={12}
                                        />
                                      )
                                    )}
                                  </div>
                                </div>
                              ))
                            : stages.map((stage) => (
                                <Droppable
                                  droppableId={stage.id}
                                  key={stage.id}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className="w-72 bg-gray-100 dark:bg-neutral-800 rounded-xl p-3 shrink-0"
                                    >
                                      {/* COLUMN HEADER */}
                                      <div className="flex justify-between mb-3">
                                        <span className="font-semibold dark:text-neutral-300">
                                          {stage.name}
                                        </span>
                                        <span className="dark:text-neutral-300">
                                          {opportunitiesByStage[stage.id]
                                            ?.length || 0}
                                        </span>
                                      </div>

                                      {/* CARDS */}
                                      {opportunitiesByStage[stage.id]?.map(
                                        (opp, index) => (
                                          <Draggable
                                            draggableId={opp.id}
                                            index={index}
                                            key={opp.id}
                                            isDragDisabled={moveLoading}
                                          >
                                            {(provided) => (
                                              <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="mb-3"
                                              >
                                                {moveLoading ? (
                                                  <Skeleton
                                                    height={80}
                                                    borderRadius={12}
                                                  />
                                                ) : (
                                                  <div className="bg-white dark:bg-neutral-700 p-3 rounded-lg">
                                                    <div className="flex justify-between items-start">
                                                      <div className="font-semibold dark:text-neutral-100">
                                                        {opp.contact?.name}
                                                      </div>

                                                      <button
                                                        onClick={() =>
                                                          openEditOpportunity(
                                                            opp
                                                          )
                                                        }
                                                        className="text-gray-500 dark:text-neutral-100 hover:text-gray-700 cursor-pointer"
                                                      >
                                                        <Edit size={16} />
                                                      </button>
                                                    </div>

                                                    <div className="text-sm text-gray-600 dark:text-neutral-100">
                                                      {opp.name}
                                                    </div>

                                                    <div className="flex justify-between text-sm mt-2 dark:text-neutral-400">
                                                      <span>€ {opp.value}</span>
                                                      <span>
                                                        {new Date(
                                                          opp.expectedClose
                                                        ).toLocaleDateString()}
                                                      </span>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </Draggable>
                                        )
                                      )}

                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              ))}
                        </div>
                      </DragDropContext>

                      {pipelines.length === 0 && (
                        <div className="flex flex-col items-center bg-white dark:bg-darkmode p-12 rounded-lg">
                          <File size={50} className="text-gray-400 dark:text-neutral-100" />
                          <span className="text-xl mt-5 dark:text-neutral-100">
                           Aucun pipeline ajouté
                          </span>
                          <p className="text-gray-600 dark:text-neutral-300">
                            Créez votre premier pipeline pour gérer vos opportunités.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ),
              },
              {
                label: "Tableau de bord et indicateurs clés de performance (KPI)",
                content: (
                  <>
                    <DashboardKpi pipelineId={selectedPipelineId} />
                  </>
                ),
              },
            ]}
          />
        </div>
      

      <OuterModal active={opportunityModal} setActive={setOpportunityModal}>
        <div className="w-full max-w-3xl mx-auto relative border-2 border-transparent dark:border-[#2F2F2F] p-5 md:p-8 rounded-2xl bg-white dark:bg-[#1E1E1E]">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setOpportunityModal(false);
            }}
          />

          <div className="mb-6">
            <h2 className="text-2xl font-bold dark:text-neutral-100">
              {editingOpportunity ? "Edit opportunity" : "Nouvelle opportunité"}
            </h2>
            <p className="text-gray-600 dark:text-neutral-300">
             Créez une nouvelle opportunité commerciale pour suivre votre pipeline de ventes.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <InputGroup
                  label="Nom de l'opportunité*"
                  placeholder="Ex : Mariage Dupont - Juin 2024"
                  error={errors.name}
                  inputProps={{
                    ...register("name"),
                  }}
                />
              </div>

              <div>
                <CustomSelect
                  label="Contact associé*"
                  placeholder="Sélectionner..."
                  options={contactOptions}
                  value={contactOptions.find(
                    (c) => c.value === watch("contactId")
                  )}
                  onChange={(val) => {
                    setValue("contactId", val?.value, {
                      shouldValidate: true,
                    });
                    clearErrors("contactId");
                  }}
                  error={errors.contactId?.message}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <InputGroup
                    label="Valeur (€)*"
                    placeholder="5000"
                    type="number"
                    error={errors.value}
                    inputProps={{
                      ...register("value", { valueAsNumber: true }),
                    }}
                  />
                </div>

                <div className="flex-1">
                  <InputGroup
                    label="Probabilité (%)"
                    type="number"
                    error={errors.probability}
                    inputProps={{
                      ...register("probability", { valueAsNumber: true }),
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <CustomSelect
                    label="Pipeline*"
                    placeholder="Sélectionner..."
                    options={pipelineSelectOptions}
                    value={pipelineSelectOptions.find(
                      (p) => p.value === watch("pipelineId")
                    )}
                    onChange={(val) => {
                      setValue("pipelineId", val?.value, {
                        shouldValidate: true,
                      });
                      clearErrors("pipelineId");
                      fetchStages(val?.value);
                    }}
                    error={errors.pipelineId?.message}
                  />
                </div>
                <div className="flex-1">
                  <CustomSelect
                    label="Stage*"
                    placeholder="Sélectionner..."
                    options={stageSelectOptions}
                    value={stageSelectOptions.find(
                      (s) => s.value === watch("stageId")
                    )}
                    onChange={(val) => {
                      setValue("stageId", val?.value, { shouldValidate: true });
                      clearErrors("stageId");
                    }}
                    error={errors.stageId?.message}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
                    Date de clôture prévue
                  </label>
                  <CustomDatePicker
                  placeholderText="Sélectionner une date"
                    selected={
                      watch("expectedClose")
                        ? new Date(watch("expectedClose"))
                        : null
                    }
                    onChange={(date: Date) => {
                      setValue("expectedClose", date.toISOString(), {
                        shouldValidate: true,
                      });
                    }}
                    className="w-full px-3 py-3 border rounded-lg bg-inputbg dark:bg-inputdarkbg border-inputborder dark:text-neutral-300"
                  />
                  {errors.expectedClose && (
                    <p className="text-red-500 text-sm mt-1">
                      La date de clôture prévue est obligatoire
                    </p>
                  )}
                </div>
              </div>

              <div>
                <InputGroup
                  label="Description"
                  placeholder="Détails de l'opportunité..."
                  type="textarea"
                  inputProps={{
                    ...register("description"),
                  }}
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between mt-7">
                <Button
                  className="flex-1"
                  type="button"
                  variant="outline"
                  disabled={submitLoading}
                  onClick={() => {
                    setOpportunityModal(false);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1"
                  type="submit"
                  disabled={submitLoading}
                >
                  {submitLoading
                    ? editingOpportunity
                      ? "Mise à jour en cours..."
                      : "Création en cours..."
                    : editingOpportunity
                    ? "Mettre à jour l’opportunité"
                    : "Créer l’opportunité"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default Opportunites;
