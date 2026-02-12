// DocumentTab.tsx
import { Filter, Pencil } from "lucide-react";
import Button from "../../../components/ui/Button";
import InputGroup from "../../../components/ui-main/InputGroup";
import CustomSelect from "../../../components/ui-main/selectBox";
import CustomDatePicker from "../../../components/DatePicker";
import DataTable from "../../../components/ui/Datatable";
import { useState } from "react";
import {
  DOCUMENT_STATUS_OPTIONS,
  documentColumns,
  useDocuments,
} from "./Document"; // adjust path if needed

const DocumentTab = ({ type, handleEdit }) => {
  const documentColumns = [
  {
    key: "number",
    label: "Numéro",
  },
  {
    key: "customerName",
    label: "Client",
  },
  {
    key: "status",
    label: "Statut",
    render: (row: any) => <span className="capitalize">{row.status}</span>,
  },
  {
    key: "totalAmount",
    label: "Total",
    render: (row: any) => `€ ${row.totalAmount}`,
  },
  {
    key: "createdAt",
    label: "Créé le",
    render: (row: any) => new Date(row.createdAt).toLocaleDateString(),
  },
  {
    key: "action",
    label: "Action",
    render: (row: any) => (
            <button
                  onClick={() => handleEdit(row)}
                  className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
                >
                  <Pencil size={14} className="text-gray-600 dark:text-neutral-300" />
                  <span
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2
                                             opacity-0 group-hover:opacity-100
                                             bg-gray-800 text-white text-xs px-2 py-1 rounded
                                             transition-opacity duration-300 whitespace-nowrap"
                  >
                    Modifier
                  </span>
                </button>

    ),
  },
];

  const [filters, setFilters] = useState({
    status: "",
    client: "",
    minAmount: "",
    createdDate: null,
    eventDate: null,
  });

  const { data, page, total, loading, setPage } = useDocuments(type, filters);

  return (
    <div className="space-y-6">
      {/* FILTERS */}
      <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
        <span className="flex items-center gap-2 text-xl heading-font font-bold tracking-wider capitalize dark:text-neutral-300">
          <Filter size={20} /> Filtrer
        </span>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <CustomSelect
              label="Filtrer"
              options={DOCUMENT_STATUS_OPTIONS}
              value={filters.status}
              onChange={(v) => setFilters((p) => ({ ...p, status: v }))}
              placeholder="Select Status"
            />
          </div>

          <div className="flex-1">
            <InputGroup
              label="Client"
              type="text"
              value={filters.client}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  client: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex-1">
            <InputGroup
              label="Montant minimum"
              type="number"
              value={filters.minAmount}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  minAmount: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex-1">
            <label className="block capitalize mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
              Date de création
            </label>
            <CustomDatePicker
               placeholderText="Sélectionner une date"
              className="w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border bg-inputbg rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
              selected={filters.createdDate}
              onChange={(date) =>
                setFilters((p) => ({
                  ...p,
                  createdDate: date ? date.toISOString().split("T")[0] : null,
                }))
              }
            />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setFilters({
              status: "",
              client: "",
              minAmount: "",
              createdDate: null,
              eventDate: null,
            })
          }
        >
        Réinitialiser le filtre
        </Button>
      </div>

      {/* TABLE */}
      <div className="space-y-4 bg-white dark:bg-darkmode p-4 rounded-2xl">
        <DataTable
          columns={documentColumns}
          data={data}
          loading={loading}
          total={total}
          page={page}
          limit={10}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default DocumentTab;
