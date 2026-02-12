import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Euro, Heart, MapPin, StarIcon } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { PROVIDER } from "../../utils/endPoints";
import { getRequest } from "../../utils/http-client/axiosClient";
import MyFavorite from "../../components/ui/MyFavorite";

const Favourite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorite = async () => {
    try {
      setLoading(true);
      const res = await getRequest(PROVIDER?.FAVORITES);
      if (res?.status === 200 && Array.isArray(res?.data?.data)) {
        setFavorites(res.data?.data);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorite();
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-neutral-100 capitalize">
          Fournisseurs préférés
        </h1>
      </div>

      <div className="layout-grid mt-6">
        {loading ? (
          // Show Skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 provider">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="provider__blk relative">
                <Skeleton height={200} />
                <div className="p-4">
                  <Skeleton width={120} height={20} />
                  <Skeleton width={180} height={15} />
                  <Skeleton width={100} height={15} />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          // No Data Found
          <div className="text-center text-gray-500 dark:text-neutral-400 mt-10">Aucune donnée trouvée</div>
        ) : (
          // Show Favorite Providers
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 provider">
            {favorites.map((fav) => (
              <div key={fav.id} className="provider__blk relative z-1 h-full">
                {/* <label className="cursor-pointer absolute z-10 w-9 h-9 top-3 left-3 flex items-center justify-center rounded-full bg-white shadow">
                  <input
                    type="checkbox"
                    name="fav"
                    className="hidden peer"
                    defaultChecked={fav.isFavorite}
                  />
                  <Heart
                    size={20}
                    className={`${
                      fav.isFavorite
                        ? "text-yellow-400 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                </label> */}
                <MyFavorite id={fav.id} isFavorite={fav.isFavorite} />

                <Link
                  to={`/provider-details/${fav.id}`}
                  className="property-listing group w-full h-full block relative before:w-full before:h-[calc(100%-120px)] before:bottom-0 before:bg-white before:absolute before:content-[ ] before:-z-1 before:rounded-b-lg"
                >
                  <div className="absolute transition-transform duration-300 top-0 right-0 w-12 h-12 bg-secondary rounded-full flex justify-center items-center group-hover:bg-tertiary">
                    <ArrowRight
                      size={20}
                      className="relative transition-transform duration-300 rotate-0 origin-center text-white group-hover:rotate-[-45deg]"
                    />
                  </div>

                    <div className="w-full h-[120px] overflow-hidden image-effect">
                    <img
                      src={
                        fav.portfolioImages?.[0] ||
                        "https://via.placeholder.com/400x200?text=No+Image"
                      }
                      alt={fav.name}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-col items-start py-4 px-5 gap-1">
                    <span className="text-xl dark:text-neutral-100 font-bold capitalize mb-0">
                      {fav.name}
                    </span>

                    {fav.address && (
                      <span className="text-gray-600 dark:text-neutral-400 text-sm flex items-center gap-1">
                        <MapPin size={16} /> {fav.address}
                      </span>
                    )}

                    {fav.rating && (
                      <span className="text-gray-600 dark:text-neutral-400 text-sm flex items-center gap-1">
                        <StarIcon
                          size={16}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        {fav.rating.averageRating} ({fav.rating.totalCount}{" "}
                        Avis clients)
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Favourite;
