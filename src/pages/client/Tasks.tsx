import { Check, Plus, X, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useEffect, useId, useState, useCallback } from "react";
import Button from "../../components/ui/Button";
import OuterModal from "../../components/Custommodal/OuterModal";
import { useParams } from "react-router-dom";
import {
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
} from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useToast } from "../../utils/toast";
import CreateTask from "./Createtasks";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: string;
  isCompleted: boolean;
}

const Task = () => {
  const { id } = useParams();
  const toast = useToast();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [btnloading, setbtnLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getRequest(`${PROVIDER.GET_TASKS}?eventId=${id}`);
      setTasks(res?.data?.data?.tasks || []);
    } catch (e) {
      toast.error("Échec de la récupération des tâches");
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmitTask = async (values: any) => {
    setbtnLoading(true);
    try {
      const payload = {
        title: values.title,
        description: values.description,
        date: values.date?.toISOString(),
        priority: values.priority,
        eventId: Number(id),
      };

      if (editMode && selectedTask) {
        await patchRequest(`${PROVIDER.TASKS}/${selectedTask.id}`, payload);
        toast.success("Tâche mise à jour avec succès");
      } else {
        await postRequest(`${PROVIDER.TASKS}`, payload);
        toast.success("Tâche ajoutée avec succès");
      }

      setActive(false);
      setEditMode(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      toast.error("Échec de l’enregistrement de la tâche");
    }
    setbtnLoading(false);
  };

  const handleDelete = async () => {
    setbtnLoading(true);
    if (!selectedTask) return;
    try {
      await deleteRequest(`${PROVIDER.TASKS}/${selectedTask.id}`);
      toast.success("Tâche supprimée avec succès");
      setConfirmDelete(false);
      setSelectedTask(null);
      fetchTasks();
    } catch {
      toast.error("Échec de la suppression de la tâche");
    }
    setbtnLoading(false);
  };

  const handleToggleComplete = async (task: TaskItem) => {
    try {
      await patchRequest(`${PROVIDER.TASKS}/${task.id}`, {
        ...task,
        isCompleted: !task.isCompleted,
        eventId: Number(id),
      });
      fetchTasks();
    } catch {
      toast.error("Échec de la mise à jour du statut");
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setSelectedTask(null);
    setActive(true);
  };

  const openEditModal = (task: TaskItem) => {
    setEditMode(true);
    setSelectedTask(task);
    setActive(true);
  };

  const closeModal = () => {
    setActive(false);
    setEditMode(false);
    setSelectedTask(null);
  };

  return (
    <>
      
        <div className="mb-6 space-y-4">
          <h1 className="text-2xl font-bold dark:text-neutral-100 mb-0 capitalize">Mes tâches</h1>
          <p className="text-gray-600 dark:text-neutral-300">
            For: <span className="text-secondary font-semibold">Event #{id}</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
            <button
              onClick={() => navigate(-1)}
              className="flex gap-1 items-center mb-2 cursor-pointer text-sm hover:text-secondary bg-secondary hover:bg-tertiary !text-white px-3 py-1 rounded-lg"
              data-no-translate
            >
              {" "}
              <ArrowLeft size={16} /> Retour
            </button>

            <div className="flex justify-between gap-2 items-center">
              <span className="text-xl heading-font font-semibold mb-4 block dark:text-neutral-100">
                Liste des tâches
              </span>
              <Button size="small" onClick={openCreateModal}>
                <Plus size={18} /> Ajouter une tâche
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    height={40}
                    baseColor="#e5e7eb"
                    highlightColor="#f3f4f6"
                    className="rounded-lg"
                  />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <p className="text-center py-5 text-gray-500 dark:text-neutral-300">
                Aucune tâche trouvée. Ajoutez-en une !
              </p>
            ) : (
              <>
                <p className="text-gray-600 dark:text-neutral-300 text-sm mb-6">
                  {tasks.filter((t) => t.isCompleted).length} Tâches terminées sur {tasks.length}
                </p>

                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col md:flex-row justify-between items-start gap-3 border-b border-gray-400 dark:border-neutral-700 pb-2"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          onClick={() => handleToggleComplete(task)}
                          className={`w-5 h-5 border rounded-sm flex items-center justify-center cursor-pointer ${
                            task.isCompleted
                              ? "bg-green-600 border-green-600"
                              : "border-gray-400"
                          }`}
                        >
                          {task.isCompleted && (
                            <Check className="text-white dark:text-neutral-300 w-4 h-4" />
                          )}
                        </span>

                        <div>
                          <p
                            className={`text-gray-800 dark:text-neutral-300 ${
                              task.isCompleted
                                ? "line-through text-gray-500"
                                : ""
                            }`}
                          >
                            {task.title}
                          </p>

                          <p className="text-gray-500 text-xs">
                            {task.description}
                          </p>
                          <span className="text-xs text-center px-2 py-1 rounded-full bg-gray-200 text-gray-600 capitalize mt-2 block">
                            {task.priority === "average"
                              ? "Normal"
                              : task.priority}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 dark:text-neutral-300 text-sm">
                          {new Date(task.date).toLocaleDateString()}
                        </span>

                        <button
                          className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer group relative"
                          onClick={() => openEditModal(task)}
                        >
                          <Edit size={14} />
                          <span
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                             opacity-0 group-hover:opacity-100
                             bg-gray-800 text-white text-xs px-2 py-1 rounded
                             transition-opacity duration-300 whitespace-nowrap"
                          >
                            Modifier
                          </span>
                        </button>

                        {/* <button
                          onClick={() => openEditModal(task)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </button> */}

                        <button
                          className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer group relative"
                          onClick={() => {
                            setSelectedTask(task);
                            setConfirmDelete(true);
                          }}
                        >
                          <Trash2 size={14} />
                          <span
                            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                             opacity-0 group-hover:opacity-100
                             bg-gray-800 text-white text-xs px-2 py-1 rounded
                             transition-opacity duration-300 whitespace-nowrap"
                          >
                            Supprimer
                          </span>
                        </button>

                        {/* <button
                          onClick={() => {
                            setSelectedTask(task);
                            setConfirmDelete(true);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button> */}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      

      {/* ---------------- CREATE / EDIT TASK MODAL ---------------- */}

      <OuterModal active={active} setActive={setActive}>
        <div className="w-full max-w-xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={closeModal}
          />
          <CreateTask
            onSubmit={handleSubmitTask}
            editMode={editMode}
            initialData={selectedTask}
            loading={btnloading}
          />
        </div>
      </OuterModal>

      {/* ---------------- DELETE CONFIRM MODAL ---------------- */}

      <OuterModal active={confirmDelete} setActive={setConfirmDelete}>
        <div className="w-full max-w-md mx-auto p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative text-center">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => setConfirmDelete(false)}
          />

          <div className="mb-6 space-y-3">
          <h2 className="text-2xl font-semibold mb-0 dark:text-neutral-100">
            Confirm Deletion
          </h2>
          <p className="text-gray-600 dark:text-neutral-300">
            Are you sure you want to delete this task?
          </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <Button
             className="flex-1"
            variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
            className="flex-1"
              loading={btnloading}
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default Task;
