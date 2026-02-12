import { useState } from "react";

import {
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
import CustomSelect from "../../components/ui-main/selectBox";
import Button from "../../components/ui/Button";

function Statistics() {
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
          <h1 className="text-2xl font-bold dark:text-neutral-300">
            Global Statistics
          </h1>
          <p className="text-gray-600 mt-1 dark:text-neutral-300">
            Detailed analysis of your platform's performance
          </p>
        </div>

        <div className="flex justify-end gap-3 mb-6">
          <CustomSelect
            options={Filter}
            value={Filter.find((opt) => opt.value === status) || null} // only selected value
            onChange={(option) => setStatus(option?.value || "")}
            placeholder="Last 30 Days"
            className="w-96 min-w-60"
          />

          <Button variant="primary" size="medium" className="flex-shrink-0">
            Export CSV
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="flex rounded-2xl bg-cyan-600 text-white dark:bg-darkmode p-3">
            <div className="flex w-100">
              <div className="flex justify-center items-center w-16 shrink-0 border-r border-white/55">
                <Euro size={30} />
              </div>
              <div className="ps-3.5 flex-1">
                <div className="text-4xl font-bold mb-1">0</div>
                <p className="capitalize mb-0">Total Revenues</p>
                <p className="text-white/80 text-xs">+24% vs previous period</p>
              </div>
            </div>
          </div>

          <div className="flex rounded-2xl bg-emerald-600  text-white dark:bg-darkmode p-3">
            <div className="flex w-100">
              <div className="flex justify-center items-center w-16 shrink-0 border-r border-white/55">
                <Users size={30} />
              </div>
              <div className="ps-3.5 flex-1">
                <div className="text-4xl font-bold mb-1">11</div>
                <p className="capitalize mb-0">Active Customers</p>
                <p className="text-white/80 text-xs">+12% this month</p>
              </div>
            </div>
          </div>

          <div className="flex rounded-2xl bg-slate-600  text-white dark:bg-darkmode p-3">
            <div className="flex w-100">
              <div className="flex justify-center items-center w-16 shrink-0 border-r border-white/55">
                <TrendingUp size={30} />
              </div>
              <div className="ps-3.5 flex-1">
                <div className="text-4xl font-bold mb-1">11%</div>
                <p className="capitalize mb-0">Conversion Rate</p>
                <p className="text-white/80 text-xs">Reservations/Requests</p>
              </div>
            </div>
          </div>

          <div className="flex rounded-2xl bg-indigo-600 text-white dark:bg-darkmode p-3">
            <div className="flex w-100">
              <div className="flex justify-center items-center w-16 shrink-0 border-r border-white/55">
                <Calendar1 size={30} />
              </div>
              <div className="ps-3.5 flex-1">
                <div className="text-4xl font-bold mb-1">11</div>
                <p className="capitalize mb-0">Average basket</p>
                <p className="text-white/80 text-xs">Per transaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="w-full bg-white rounded-2xl p-4">
            <h2 className="font-semibold text-2xl mb-4">Evolution of Income</h2>
            <img src={graph} alt="Evolution of Income" />
          </div>

          <div className="w-full bg-white rounded-2xl p-4">
            <h2 className="font-semibold text-2xl mb-4">New Users</h2>
            <img src={graph} alt="New Users" />
          </div>

          <div className="w-full bg-white rounded-2xl p-4">
            <h2 className="font-semibold text-2xl mb-4">
              Distribution by Category
            </h2>
            <img src={graph} alt="Distribution by Category" />
          </div>

          <div className="w-full bg-white rounded-2xl p-4">
            <h2 className="font-semibold text-2xl mb-4">Detailed Metrics</h2>
            <img src={graph} alt="Detailed Metrics" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Statistics;
