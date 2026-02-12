import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import {
  deleteRequest,
  postRequest,
} from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import { useToast } from "../../utils/toast";
import { RESPONSE_CODE } from "../../utils/constants";
import { useSelector } from "react-redux";

function MyFavorite({ id, setLoginActive, isFavorite }) {
  
  const [isFav, setIsFav] = useState(isFavorite || false);
  const [loading, setLoading] = useState(false);
  const login = useSelector((state) => state.login);
  const toast = useToast();

  useEffect(() => {
    setIsFav(isFavorite || false);
  }, [isFavorite]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!login?.user?.id) {
      return setLoginActive(true);
    }

    setIsFav(e.target.checked);
    setLoading(true);

    const payload = { businessId: id };

    if (e.target.checked) {
      try {
        const response = await postRequest(`${PROVIDER.FAVORITES}`, payload);
        if (response.status === RESPONSE_CODE[200]) {
          toast.success(t("addedToFavorites"));
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Error");
        setIsFav(false);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await deleteRequest(`${PROVIDER.FAVORITES}`, payload);

        if (response.status === RESPONSE_CODE[201]) {
          toast.success(t("removedFromFavorites"));
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Error");
        setIsFav(true); // rollback on error
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <label className="cursor-pointer absolute w-9 h-9 top-3 left-3 z-10 flex items-center justify-center text-sm rounded-full bg-white">
      {loading ? (
        <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
      ) : (
        <>
          <input
            type="checkbox"
            name="fav"
            className="hidden peer"
            checked={isFav}
            onChange={handleChange}
          />
          <Heart
            size={20}
            className="text-gray-600 peer-checked:text-yellow-400 peer-checked:fill-current transition-colors"
          />
        </>
      )}
    </label>
  );
}

export default MyFavorite;
