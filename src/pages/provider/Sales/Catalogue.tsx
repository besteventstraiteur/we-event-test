import { useEffect, useRef, useState } from "react";
import { LayoutGrid, LayoutList, Pencil, Trash2, X } from "lucide-react";
import Button from "../../../components/ui/Button";
import image from "../../../assets/images/property.jpg";
import CustomSelect from "../../../components/ui-main/selectBox";
import OuterModal from "../../../components/Custommodal/OuterModal";
import CreateCataloge from "./CreateCataloge";
import {
  deleteRequest,
  getRequest,
  postRequest,
} from "../../../utils/http-client/axiosClient";
import { PROVIDER } from "../../../utils/endPoints";
import DataTable from "../../../components/ui/Datatable";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useToast } from "../../../utils/toast";
import { uploadFile } from "../../../utils/uploadfile";

const Catalogue = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productModal, setproductModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  const pricingColumns = [
    {
      key: "createdAt",
      label: "Date",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "oldPrice",
      label: "Ancien prix",
      render: (row) => (row.oldPrice ? `${row.oldPrice} €` : "-"),
    },
    {
      key: "newPrice",
      label: "Nouveau prix",
      render: (row) => <span className="text-green-500">{row.newPrice} €</span>,
    },
    {
      key: "vatRate",
      label: "TVA",
      render: (row) => `${row.vatRate}%`,
    },
    {
      key: "reason",
      label: "Raison",
    },
  ];
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingPriceHistory, setLoadingPriceHistory] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [deleteId, setDeleteId] = useState(null);
  const [priceModal, setPriceModal] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await getRequest(`${PROVIDER.CATELOGUE}/unique-categories`);
      const data = res.data.data || [];

      setCategories(
        data.map((cat) => ({
          value: cat,
          label: cat,
        })),
      );
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Veuillez sélectionner un fichier CSV valide.");
      return;
    }

    setImportLoading(true);

    try {
      const uploaded = await uploadFile(file);

      await postRequest(`${PROVIDER.CATELOGUE}/import`, {
        fileKey: uploaded.file,
      });

      toast.success("CSV importé avec succès !");
      fetchProducts(1, selectedCategory);
    } catch (error) {
      console.error("CSV upload error:", error);
      toast.error("Échec de l'importation du CSV.");
    }

    setImportLoading(false);
    e.target.value = "";
  };

  const fetchProducts = async (pageNo = 1, category = null) => {
    setLoadingProducts(true);
    try {
      let url = `${PROVIDER.CATELOGUE}/list?page=${pageNo}&limit=${limit}`;

      if (category?.value) {
        url += `&category=${category.value}`;
      }

      const res = await getRequest(url);
      const data = res.data.data;

      setProducts(data.catalogues || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products", error);
    }
    setLoadingProducts(false);
  };

  const fetchPriceHistory = async (id, name) => {
    setLoadingPriceHistory(true);
    setLoadingProducts(true);

    try {
      const res = await getRequest(
        `${PROVIDER.CATELOGUE}/${id}/get-pricing-history`,
      );
      setPriceHistory(res.data.data || []);
      setSelectedProductName(name);
      setPriceModal(true);
    } catch (error) {
      console.error("Error fetching price history", error);
    }
    setLoadingPriceHistory(false);
    setLoadingProducts(false);
  };

  const toast = useToast();
  const handleDelete = async () => {
    setBtnLoading(true);
    try {
      await deleteRequest(`${PROVIDER.CATELOGUE}/${deleteId}`);
      setDeleteModal(false);
      fetchProducts();
      toast.success("Supprimé avec succès");
    } catch (error) {
      toast.error("Une erreur s'est produite, veuillez réessayer.");
    }
    setBtnLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(1);
  }, [productModal]);

  useEffect(() => {
    fetchProducts(page, selectedCategory);
  }, [page, selectedCategory]);

  return (
    <>
        <div className="bg-white dark:bg-darkmode rounded-2xl p-4">
          <div className="flex flex-col xl:flex-row xl:items-start lg:justify-between gap-5">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-wider capitalize dark:text-neutral-100 mb-0">
                Catalogue de produits et services
              </h2>
              <p className="text-gray-600 dark:text-neutral-300">
                Gérez vos produits, services et revenus pour leur utilisation
                dans vos documents commerciaux.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button
                className="ml-2"
                size="medium"
                variant="outline"
                loading={importLoading}
                onClick={() => fileInputRef.current?.click()}
              >
                Importer
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCSVUpload}
              />
              <Button
                className="ml-2"
                size="medium"
                onClick={() => {
                  setEditData(null);
                  setproductModal(true);
                }}
              >
                Nouveau produit
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center my-7">
            <div>
              <CustomSelect
                options={categories}
                value={selectedCategory}
                onChange={(val) => {
                  setPage(1);
                  setSelectedCategory(val);
                }}
                placeholder="Sélectionner une catégorie"
                className="w-full min-w-60"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-9 h-9 rounded-md flex justify-center items-center ${
                  viewMode === "grid"
                    ? "bg-secondary text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <LayoutGrid size={18} />
              </button>

              <button
                onClick={() => setViewMode("list")}
                className={`w-9 h-9 rounded-md flex justify-center items-center ${
                  viewMode === "list"
                    ? "bg-secondary text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {loadingProducts
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 flex flex-col gap-4"
                    >
                      <Skeleton height={240} />
                      <div className="p-4 space-y-3">
                        <Skeleton width={120} height={20} />
                        <Skeleton height={20} />
                        <Skeleton count={2} />
                      </div>
                    </div>
                  ))
                : products.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 flex flex-col justify-between gap-4 relative overflow-hidden"
                    >
                      <div>
                        <div className="relative h-60 overflow-hidden rounded-t-xl">
                          <div className="absolute top-8 right-8">
                            <button
                              className="p-2 bg-gray-100 rounded-md"
                              onClick={() => {
                                setDeleteId(item.id);
                                setDeleteModal(true);
                              }}
                            >
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>

                          <img
                            src={item.imageUrl || image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-4">
                          <span className="bg-gray-200 px-3 py-1 rounded-full text-xs">
                            {item.category}
                          </span>

                          <h3 className="text-lg font-bold mt-2 capitalize dark:text-neutral-100">
                            {item.name}
                          </h3>

                          <p className="text-sm text-gray-600 dark:text-neutral-400 mb-3">
                            {item.description}
                          </p>

                          <span className="text-xl font-medium dark:text-neutral-300">
                            {item.unitPrice} €{" "}
                            <span className="text-sm">HT</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 px-4 pb-4">
                        <Button
                          className="flex-1"
                          size="small"
                          onClick={() => fetchPriceHistory(item.id, item.name)}
                        >
                          Historique des prix
                        </Button>
                        <Button
                          className="flex-1"
                          size="small"
                          variant="outline"
                          onClick={() => {
                            setEditData(item);
                            setproductModal(true);
                          }}
                        >
                          Modifier
                        </Button>
                      </div>
                    </div>
                  ))}
            </div>
          ) : (
            <div className="space-y-4">
              {loadingProducts
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height={80} />
                  ))
                : products.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 bg-white dark:bg-neutral-800"
                    >
                      <div className="flex flex-col sm:flex-row gap-3">
                      <img
                        src={item.imageUrl || image}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />

                      <div className="flex-1">
                        <h3 className="font-bold dark:text-neutral-100 capitalize">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {item.description}
                        </p>

                        <div className="flex gap-3 mt-2 text-sm">
                          <span className="text-sm dark:text-gray-400">
                            {item.unitPrice} € HT
                          </span>
                          <span className="bg-blue-100 px-2 rounded-full text-sm">
                            TVA {item.vatRate}%
                          </span>
                          <span className="bg-gray-200 px-2 rounded-full text-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      </div>

                      <div className="flex gap-2 sm:ms-auto">
                        <Button
                          size="small"
                          onClick={() => fetchPriceHistory(item.id, item.name)}
                        >
                          Prix
                        </Button>

                        <button
                          onClick={() => {
                            setEditData(item);
                            setproductModal(true);
                          }}
                          className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
                        >
                          <Pencil
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
                          onClick={() => {
                            setDeleteId(item.id);
                            setDeleteModal(true);
                          }}
                          className="p-2 bg-gray-100 dark:bg-neutral-600 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700 rounded-md cursor-pointer group relative"
                        >
                          <Trash2
                            size={14}
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
                  ))}
            </div>
          )}

          {/* ✅ PAGINATION */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              size="small"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>

            {/* <span className="text-sm dark:text-neutral-300 flex items-center">
              Page {page} of {totalPages}
            </span> */}

            <Button
              variant="outline"
              size="small"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>

      <CreateCataloge
        active={productModal}
        setActive={setproductModal}
        editData={editData}
      />

      <OuterModal active={priceModal} setActive={setPriceModal} showClose>
        <div className="max-w-3xl mx-auto p-5 md:p-8 border-2 border-transparent dark:border-[#2F2F2F] rounded-2xl bg-white dark:bg-[#1E1E1E] relative">
          <h2 className="text-2xl font-bold mb-4 dark:text-neutral-100">
            Historique des prix - {selectedProductName}
          </h2>

          <button
          className="absolute top-4 right-4 cursor-pointer"
          aria-label="Fermer la fenêtre Historique des prix"
          onClick={() => setPriceModal(false)}>
             <X
            className="dark:text-neutral-300"
            
          /></button>    
          <DataTable
            columns={pricingColumns}
            data={priceHistory}
            loading={loadingPriceHistory}
            emptyText="Aucun historique trouvé"
          />
        </div>
      </OuterModal>
      <OuterModal active={deleteModal} setActive={setDeleteModal}>
        <div className="max-w-xl mx-auto border-2 border-transparent dark:border-[#2F2F2F] bg-white dark:bg-[#1E1E1E] p-5 md:p-12 rounded-2xl text-center">
          {/* <h2 className="text-xl font-bold mb-4 text-red-600">Warning</h2> */}

          <p className="text-xl text-gray-600 dark:text-neutral-100">
            Êtes-vous sûr de vouloir supprimer ce produit ?
          </p>

          <div className="flex justify-center gap-4 mt-10">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDeleteModal(false)}
            >
              Annuler
            </Button>

            <Button
              variant="danger"
              className="flex-1"
              loading={btnLoading}
              onClick={() => {
                handleDelete();
              }}
            >
              Oui, supprimer
            </Button>
          </div>
        </div>
      </OuterModal>
    </>
  );
};

export default Catalogue;
