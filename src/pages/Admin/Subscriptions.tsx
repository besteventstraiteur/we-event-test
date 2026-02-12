import { useState } from "react";

import {
  Award,
  Calendar1,
  CircleCheckBig,
  Clock,
  Euro,
  Heart,
  Lightbulb,
  Plus,
  Rocket,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import graph from "../../assets/images/graph.jpg";
import freetrial from "../../assets/images/free-trial.svg";
import CustomSelect from "../../components/ui-main/selectBox";
import Button from "../../components/ui/Button";
import InputGroup from "../../components/ui-main/InputGroup";

function Subscriptions() {
  const [status, setStatus] = useState(null);

  const Filter = [
    { value: "Last 30 Days", label: "Last 30 Days" },
    { value: "Last 3 Months", label: "Last 3 Months" },
    { value: "Last 6 Months", label: "Last 6 Months" },
  ];

  return (
    <>
      <div className="min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold dark:text-neutral-300">Subscriptions</h1>
          <p className="text-gray-600 mt-1 dark:text-neutral-300">
            Overview of admin subscriptions
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="flex rounded-2xl bg-cyan-600 text-white dark:bg-darkmode p-3">
            <div className="flex w-100">
              <div className="flex justify-center items-center w-16 shrink-0 border-r border-white/55">
                <Award size={30} />
              </div>
              <div className="ps-3.5 flex-1">
                <div className="text-4xl font-bold mb-1">0</div>
                <p className="capitalize mb-0">Total</p>
              </div>
            </div>
          </div>

          <div className="flex rounded-2xl bg-emerald-600  text-white dark:bg-darkmode p-3">
            <div className="flex w-100">
              <div className="flex justify-center items-center w-16 shrink-0 border-r border-white/55">
                <Award size={30} />
              </div>
              <div className="ps-3.5 flex-1">
                <div className="text-4xl font-bold mb-1">11</div>
                <p className="capitalize mb-0">Active</p>
              </div>
            </div>
          </div>

          <div className="flex rounded-2xl bg-slate-600  text-white dark:bg-darkmode p-3">
            <div className="flex w-100">
              <div className="flex justify-center items-center w-16 shrink-0 border-r border-white/55">
                <img src={freetrial} alt="free trial" className="max-w-12" />
              </div>
              <div className="ps-3.5 flex-1">
                <div className="text-4xl font-bold mb-1">11%</div>
                <p className="capitalize mb-0">Trial</p>
              </div>
            </div>
          </div>

          <div className="flex rounded-2xl bg-indigo-600 text-white dark:bg-darkmode p-3">
            <div className="flex w-100">
              <div className="flex justify-center items-center w-16 shrink-0 border-r border-white/55">
                <TrendingUp size={30} />
              </div>
              <div className="ps-3.5 flex-1">
                <div className="text-4xl font-bold mb-1">11</div>
                <p className="capitalize mb-0">revenue</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-darkmode rounded-2xl p-4 flex justify-end gap-3 mb-6">
          <div className="relative flex-2">
            <Search
              size={20}
              className="absolute left-2.5 top-[15px]  text-gray-500"
            />
            <InputGroup
              type="search"
              placeholder="Search Subscriptions"
              className="pl-9 bg-white"
            />
          </div>

          <CustomSelect
            options={Filter}
            value={Filter.find((opt) => opt.value === status) || null} // only selected value
            onChange={(option) => setStatus(option?.value || "")}
            placeholder="Status"
            className="w-96 flex-1"
          />

          <CustomSelect
            options={Filter}
            value={Filter.find((opt) => opt.value === status) || null} // only selected value
            onChange={(option) => setStatus(option?.value || "")}
            placeholder="Plans"
            className="w-96 flex-1"
          />
        </div>

        <div className="overflow-x-auto rounded-3xl border border-borderlight">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                  User
                </th>
                <th className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                  Plan
                </th>
                <th className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                  Price
                </th>
                <th className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                  Status
                </th>
                <th className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                  Date
                </th>
                <th className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm capitalize">
                  Onkar chand
                </td>
                <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm capitalize">
                  Basic
                </td>
                <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                  $200
                </td>
                <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                  <span className="px-3 py-1 rounded font-medium bg-green-100 text-green-700">
                    Active
                  </span>
                </td>
                <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                  12/03/2025
                </td>
                <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                  View
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Subscriptions;
