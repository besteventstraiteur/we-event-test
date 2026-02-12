import { useState } from "react";
import {
  File,
  FileStack,
  Filter,
  Funnel,
  FunnelPlus,
  X,
  Zap,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Staticscard from "../Sales/Statics-card";
import InputGroup from "../../../components/ui-main/InputGroup";
import CustomSelect from "../../../components/ui-main/selectBox";
import OuterModal from "../../../components/Custommodal/OuterModal";
import { useNavigate } from "react-router-dom";

const priority = [
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "late", label: "Late" },
];

const Scoring = () => {
  const [priorityValue, setPriorityValue] = useState("");

  const [detailModal, setDetailModal] = useState(false);

  // DATE PICKER
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const navigate = useNavigate();

  const goToContact = () => {
    navigate("/contacts");
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="mb-6">
          <div className="flex flex-col items-start md:flex-row md:items-center gap-5 justify-between w-full">
            <div>
              <h1 className="text-2xl font-bold dark:text-neutral-300">
                Scoring des Leads
              </h1>
              <p className="text-gray-600 mt-1 dark:text-neutral-300">
                Manage all your business documents: quotes, invoices, purchase
                orders and delivery notes
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h2 className="text-xl font-bold tracking-wider capitalize dark:text-neutral-300">
                Scoring des Leads
              </h2>
              <p className="text-gray-600 mt-1 dark:text-neutral-300">
                Prioritize your sales efforts with automatic scoring
              </p>
            </div>

            <Button size="medium" onClick={() => setDetailModal(true)}>
              Recalculate all scores
            </Button>
          </div>

          <div className="grid grid-cols-5 gap-3">
            <Staticscard
              heading="Total Leads"
              value={3}
              subheading=""
              color="bg-blue-500"
              icon={<Funnel size={20} />}
            />

            <Staticscard
              heading="Hot Leads"
              value={1}
              subheading="Grade A+/A"
              color="bg-green-500"
              icon={<FunnelPlus size={20} />}
            />

            <Staticscard
              heading="Warm Leads"
              value={1}
              subheading="Grade B"
              color="bg-orange-500"
              icon={<FunnelPlus size={20} />}
            />

            <Staticscard
              heading="Leads Froids"
              value={1}
              subheading="Grade C/D"
              color="bg-purple-500"
              icon={<Funnel size={20} />}
            />

            <Staticscard
              heading="Critical Priority"
              value={1}
              subheading="Urgent action"
              color="bg-red-500"
              icon={<Funnel size={20} />}
            />
          </div>

          <div className="space-y-6 mt-6">
            <div className="bg-white dark:bg-darkmode p-4 rounded-2xl">
              <div className="flex gap-3">
                <div className="flex-2">
                  <InputGroup type="text" placeholder="Search for contact." />
                </div>
                <div className="flex-1">
                  <CustomSelect
                    options={priority}
                    value={priorityValue}
                    onChange={setPriorityValue}
                    placeholder="All ranks"
                    className="w-full min-w-60"
                  />
                </div>

                <div className="flex-1">
                  <CustomSelect
                    options={priority}
                    value={priorityValue}
                    onChange={setPriorityValue}
                    placeholder="All prorities"
                    className="w-full min-w-60"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-darkmode p-4 rounded-2xl space-y-6">
              <div>
                <span className="text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-300">
                  Scores des Leads
                </span>
                <p className="text-gray-600">
                  Click on a lead to see the details of the score calculation.
                </p>
              </div>

              <div>
                <p className="text-center">Add table here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OuterModal active={detailModal} setActive={setDetailModal}>
        <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden mx-auto relative p-5 md:p-10 border-2 border-secondary rounded-2xl bg-white dark:bg-black">
          <X
            className="absolute top-4 right-4 cursor-pointer dark:text-neutral-300"
            onClick={() => {
              setDetailModal(false);
            }}
          />

          <h2 className="text-xl font-bold mb-6 dark:text-neutral-300 tracking-wider">
            Score Details: Marie & Thomas Dupont
          </h2>

          <div className="max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-5xl font-bold">87/100</span>
              </div>
              <div className="flex justify-center gap-2">
                <span className="text-sm bg-green-600 text-white px-3 py-1 rounded-full">
                  Grade A+
                </span>

                <span className="text-sm bg-red-600 text-white px-3 py-1 rounded-full">
                  Critical Priority
                </span>
              </div>

              <p className="text-center text-gray-600 mt-4 text-sm">
                Probabilité de conversion :{" "}
                <span className="font-bold">85%</span>
              </p>

              <div>
                <p className="text-lg font-bold heading-font tracking-wider mb-2">
                  Score Breakdown
                </p>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between gap-2 text-sm">
                      <span>Qualification</span>
                      <span>35/40</span>
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full my-2">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{ width: "90%" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between gap-2 text-sm">
                      <span>Engagement</span>
                      <span>28/35</span>
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full my-2">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{ width: "80%" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between gap-2 text-sm">
                      <span>Value</span>
                      <span>24/25</span>
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full my-2">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{ width: "95%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-lg font-bold heading-font tracking-wider mb-2">
                  Detailed Calculation
                </p>

                <div className="bg-slate-50 p-4 space-y-3 text-gray-600">
                  {[
                    {
                      label: "Budget points",
                      points: "15",
                    },
                    {
                      label: "Date urgency points",
                      points: "10",
                    },
                    {
                      label: "Source quality points",
                      points: "6",
                    },
                    {
                      label: "Profile completeness points",
                      points: "7",
                    },
                    {
                      label: "Email interactions points",
                      points: "12",
                    },
                    {
                      label: "Response time points",
                      points: "10",
                    },
                    {
                      label: "Meetings points",
                      points: "8",
                    },
                    {
                      label: "Returning client bonus",
                      points: "10",
                    },
                  ].map((elem, index) => (
                    <div
                      key={index}
                      className="flex justify-between gap-3 text-sm"
                    >
                      <span>{elem.label}</span>
                      <span>{elem.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-lg font-bold heading-font tracking-wider mb-2">
                  Recommended Actions
                </p>

                <div className="space-y-3">
                  {[
                    {
                      label: "Highly qualified lead, prioritize follow-up",
                    },
                    {
                      label: "Propose a meeting quickly",
                    },
                  ].map((elem, index) => (
                    <div className="bg-blue-50 p-2 text-gray-600 flex items-start gap-2 text-sm rounded-lg">
                      <Zap size={18} />
                      <p>{elem.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 mt-6">
                <p className="text-gray-600 text-sm">Last updated: 28/11/2025 12:29:16</p>
                <Button onClick={goToContact} size="medium">See the contact</Button>
              </div>
            </div>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default Scoring;
