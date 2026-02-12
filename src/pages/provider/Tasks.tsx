import { Check, DollarSign, Plus, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import Button from "../../components/ui/Button";
import OuterModal from "../../components/Custommodal/OuterModal";
import CreateTask from "../client/Createtasks";

const Task = () => {
  const labelID = useId();

  // modal
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
  }, [active]);

  return (
    <>
      <div className="min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold dark:text-neutral-300">My Tasks</h1>
          <p className="text-gray-600 mt-1 dark:text-neutral-300">
            For:<span className="text-primary">test</span>
          </p>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
            <div className="flex justify-between gap-2 items-center">
              <span className="text-2xl font-semibold mb-4 block dark:text-neutral-300">
                Task list
              </span>
              <Button size="small" onClick={() => setActive(true)}>
                <Plus size={18} /> Add task
              </Button>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              0 out of 1 tasks completed
            </p>

            <div className="space-y-4">
              <label className="flex justify-between items-center gap-3 cursor-pointer">
                <div className="flex gap-2">
                  <input type="checkbox" className="hidden peer" />

                  <span className="w-5 h-5 border border-gray-400 rounded-sm peer-checked:bg-blue-600 peer-checked:border-green-600 flex items-center justify-center">
                    <Check className="text-white w-4 h-4" />
                  </span>
                  <span className="text-gray-700 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </span>
                </div>

                <span className="text-gray-700 text-sm">12/11/2025</span>
              </label>

              <label className="flex justify-between items-center gap-3 cursor-pointer">
                <div className="flex gap-2">
                  <input type="checkbox" className="hidden peer" />

                  <span className="w-5 h-5 border border-gray-400 rounded-sm peer-checked:bg-blue-600 peer-checked:border-green-600 flex items-center justify-center">
                    <Check className="text-white w-4 h-4" />
                  </span>
                  <span className="text-gray-700 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </span>
                </div>

                <span className="text-gray-700 text-sm">12/11/2025</span>
              </label>

              <label className="flex justify-between items-center gap-3 cursor-pointer">
                <div className="flex gap-2">
                  <input type="checkbox" className="hidden peer" />

                  <span className="w-5 h-5 border border-gray-400 rounded-sm peer-checked:bg-blue-600 peer-checked:border-green-600 flex items-center justify-center">
                    <Check className="text-white w-4 h-4" />
                  </span>
                  <span className="text-gray-700 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </span>
                </div>

                <span className="text-gray-700 text-sm">12/11/2025</span>
              </label>

              <label className="flex justify-between items-center gap-3 cursor-pointer">
                <div className="flex gap-2">
                  <input type="checkbox" className="hidden peer" />

                  <span className="w-5 h-5 border border-gray-400 rounded-sm peer-checked:bg-blue-600 peer-checked:border-green-600 flex items-center justify-center">
                    <Check className="text-white w-4 h-4" />
                  </span>
                  <span className="text-gray-700 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </span>
                </div>

                <span className="text-gray-700 text-sm">12/11/2025</span>
              </label>

              <label className="flex justify-between items-center gap-3 cursor-pointer">
                <div className="flex gap-2">
                  <input type="checkbox" className="hidden peer" />

                  <span className="w-5 h-5 border border-gray-400 rounded-sm peer-checked:bg-blue-600 peer-checked:border-green-600 flex items-center justify-center">
                    <Check className="text-white w-4 h-4" />
                  </span>
                  <span className="text-gray-700 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </span>
                </div>

                <span className="text-gray-700 text-sm">12/11/2025</span>
              </label>

              <label className="flex justify-between items-center gap-3 cursor-pointer">
                <div className="flex gap-2">
                  <input type="checkbox" className="hidden peer" />

                  <span className="w-5 h-5 border border-gray-400 rounded-sm peer-checked:bg-blue-600 peer-checked:border-green-600 flex items-center justify-center">
                    <Check className="text-white w-4 h-4" />
                  </span>
                  <span className="text-gray-700 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </span>
                </div>

                <span className="text-gray-700 text-sm">12/11/2025</span>
              </label>

              <label className="flex justify-between items-center gap-3 cursor-pointer">
                <div className="flex gap-2">
                  <input type="checkbox" className="hidden peer" />

                  <span className="w-5 h-5 border border-gray-400 rounded-sm peer-checked:bg-blue-600 peer-checked:border-green-600 flex items-center justify-center">
                    <Check className="text-white w-4 h-4" />
                  </span>
                  <span className="text-gray-700 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </span>
                </div>

                <span className="text-gray-700 text-sm">12/11/2025</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <OuterModal active={active} setActive={setActive}>
        <div className="w-full max-w-xl mx-auto p-10 border-2 border-secondary rounded-2xl bg-white dark:bg-black relative">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setActive(false);
            }}
          />
          <CreateTask />
        </div>
      </OuterModal>
    </>
  );
};

export default Task;
