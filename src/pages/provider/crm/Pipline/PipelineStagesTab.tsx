import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Edit,
  GitBranch,
  Plus,
  Trash,
} from "lucide-react";
import Button from "../../../../components/ui/Button";

interface Props {
  steps: string[];
  onAddPipeline: () => void;
  onAddStep: () => void;
}

const PipelineStagesTab = ({ steps, onAddPipeline, onAddStep }: Props) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 border border-gray-200 p-4 rounded-lg bg-white">
        <AlertCircle size={20} className="text-gray-600 shrink-0" />
        <p className="text-sm text-gray-600">
          <span className="font-bold">Pipelines</span> allow you to organize your
          sales opportunities into stages.
        </p>
      </div>

      <div className="flex justify-between items-start gap-3">
        <div>
          <span className="text-xl font-bold tracking-wider capitalize dark:text-neutral-300">
            Mes Pipelines
          </span>
          <p className="text-sm text-gray-600">Manage your sales journeys</p>
        </div>
        <Button onClick={onAddPipeline}>
          <Plus /> New pipeline
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="border border-borderlight dark:border-black p-6 rounded-lg bg-white dark:bg-darkmode relative pr-8"
          >
            <div className="absolute flex gap-2 top-6 right-6">
              <button className="p-2 bg-gray-100 dark:bg-black rounded-md">
                <Edit size={14} />
              </button>
              {i === 2 && (
                <button className="p-2 bg-gray-100 dark:bg-black rounded-md">
                  <Trash size={14} />
                </button>
              )}
            </div>

            <div className="flex gap-2 mb-2">
              <GitBranch className="text-blue-600 shrink-0" />
              <span className="text-xl font-semibold dark:text-neutral-300">Rst</span>
            </div>

            {i !== 2 && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                <CheckCircle2 size={16} /> Par défaut
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-start gap-3">
        <div>
          <span className="text-xl font-bold tracking-wider capitalize dark:text-neutral-300">
            Pipeline steps: rtst
          </span>
          <p className="text-sm text-gray-600">
            Define the different stages of your sales process
          </p>
        </div>
        <Button onClick={onAddStep}>
          <Plus /> Add Step
        </Button>
      </div>

      <div className="flex flex-nowrap overflow-x-auto items-center gap-3 pt-4 pb-3">
        {steps.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="bg-white w-48 shrink-0 p-4 rounded-lg relative">
              <span className="text-xs py-1 px-3 rounded-full border inline-block">
                #{index + 1}
              </span>
              <div className="text-sm mt-2 capitalize">{item}</div>
            </div>
            {index !== steps.length - 1 && (
              <ArrowRight className="text-gray-600 shrink-0" size={18} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineStagesTab;
