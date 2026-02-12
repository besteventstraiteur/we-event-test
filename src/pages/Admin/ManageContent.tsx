import { Link } from "react-router-dom";
import { getRequest } from "../../utils/http-client/axiosClient";
import { ADMIN } from "../../utils/endPoints";
import { useEffect, useState } from "react";

const ManageAllContent = () => {
  
  const [allContent, setAllContent] = useState([]);

  // Helper function to format the date string
  const formatLastUpdated = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString)
      .toLocaleString("en-US", options)
      .replace(" at", " at");
  };

  const fetchAllContent = async () => {
    try {
      const resp = await getRequest(`${ADMIN.GET_ALL_PAGES}`);
      
      // Assuming the response structure is { success: true, data: { data: [...] } }
      if (resp.status === 200) {
        setAllContent(resp?.data?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  useEffect(() => {
    fetchAllContent();
  }, []);

  return (
    <>
      <div className="min-h-screen">

        {/* Header */}

        <div className="mb-6">
          <div className="flex items-center gap-5 justify-between w-full">
            <div>
              <h1 className="text-2xl font-bold dark:text-neutral-300">Gérer le contenu</h1>
              <p className="text-gray-600 mt-1 dark:text-neutral-300">Modifiez, mettez à jour et surveillez votre contenu en toute simplicité.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Content Table */}

        <div className="guest mb-6">
          <div className="overflow-x-auto rounded-3xl border border-borderlight">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                    SNO
                  </th>
                  <th className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                    Page
                  </th>
                  <th className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                    Dernière mise à jour
                  </th>
                  <th className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {allContent.length > 0 ? (
                  allContent.map((item, index) => (
                    <tr key={item.id}>
                      <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                        {index + 1}
                      </td>
                      <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                        {item.title}
                      </td>
                      <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                        {formatLastUpdated(item.updatedAt)}
                      </td>
                      <td className="bg-white dark:bg-[#121417] dark:text-neutral-300 px-3 py-4 border-b border-borderlight text-sm">
                        <Link
                          to={`/admin/manage-${item.slug.replace(/-/g, "")}/${
                            item.id
                          }`}
                          className="hover:text-secondary underline"
                        >
                          Gérer le contenu
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4 dark:text-neutral-300">
                      Aucun contenu trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAllContent;
