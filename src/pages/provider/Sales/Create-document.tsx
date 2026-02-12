import { useState } from "react";
import CustomSelect from "../../../components/ui-main/selectBox";
import Button from "../../../components/ui/Button";

const priority = [
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "late", label: "Late" },
];

const CreateDocument = () => {
  const [priorityValue, setPriorityValue] = useState("");
  return (
    <>
      <div className="min-h-screen">
        <div className="mb-6">
          <div className="flex flex-col items-start md:flex-row md:items-center gap-5 justify-between w-full">
            <div>
              <h1 className="text-2xl font-bold dark:text-neutral-300">
                create document from template
              </h1>
            </div>
          </div>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <div>
            <h2 className="text-xl font-bold tracking-wider capitalize dark:text-neutral-300">
              Create a new document
            </h2>
            <p className="text-gray-600 mt-1 dark:text-neutral-300">
              Follow the steps to generate your business document.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex shrink-0 items-center gap-1">
              <span className="w-10 h-10 rounded-full bg-secondary text-white flex shrink-0 justify-center items-center">
                1
              </span>
              Model selection
            </div>
            <div className="w-full h-0.5 bg-gray-600"></div>
            <div className="flex shrink-0 items-center gap-1 text-gray-600">
              <span className="w-10 h-10 rounded-full bg-gray-400 text-gray-600 flex shrink-0 justify-center items-center">
                2
              </span>
              Assignation Client
            </div>
          </div>

          <div>
            <h3 className="text-xl">Step 2: Associate a client</h3>

            <div className="p-8 border-gray-200 bg-white my-5 rounded-lg">
              <span className="text-xl heading-font font-bold">
                Contact Selection
              </span>
              <p className="text-sm text-gray-600">
                Choose the client or prospect for this document.
              </p>

              <CustomSelect
                label="Contact"
                options={priority}
                value={priorityValue}
                onChange={setPriorityValue}
                placeholder="Select a contact"
                className="w-full min-w-60 my-6"
              />

              <div className="flex justify-between gap-3">
                <Button variant="outline">Back</Button>
                <Button>Generate the document</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateDocument;
