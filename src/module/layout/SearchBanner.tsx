import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Search, Waypoints } from "lucide-react";
import CustomSelect from "../../components/ui-main/selectBox";
import { getRequest } from "../../utils/http-client/axiosClient";
import { PROVIDER } from "../../utils/endPoints";
import Autocomplete from "react-google-autocomplete";

// range slider
import { SimpleRangeSlider } from "react-range-slider-advanced";
import "react-range-slider-advanced/style.css";

function SearchBanner() {
  const navigate = useNavigate();

  // API data
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [locationText, setLocationText] = useState("");
  const [placeDetails, setPlaceDetails] = useState(null);
  const [radiusKm, setRadiusKm] = useState(0);
  const inputRef = useRef(null);

  // range slider
  const min = 0;
  const max = 100;

  const fetchCategories = async () => {
    try {
      setLoadingCats(true);
      const res = await getRequest(PROVIDER.GET_ALL_SERVICES);

      if (res?.status === 200 && Array.isArray(res?.data?.data?.services)) {
        const opts = res.data.data.services
          .map((c) => ({
            value: c.id,
            label: c.name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCategories(opts);
      } else {
        setCategories([]);
      }
    } catch (e) {
      setCategories([]);
    } finally {
      setLoadingCats(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSearch = () => {
    const params = new URLSearchParams();

    if (placeDetails?.geometry?.location) {
      const lat = placeDetails.geometry.location.lat();
      const lng = placeDetails.geometry.location.lng();
      params.set("lat", lat);
      params.set("long", lng);
      params.set("radius", String(radiusKm));
    }

    if (selectedCategory?.value) {
      params.set("services", String(selectedCategory.value));
      params.set("servicesLabel", selectedCategory.label);
    }

    if (selectedBudget?.value) {
      if (selectedBudget.value.from !== undefined)
        params.set("budgetFrom", selectedBudget.value.from);
      if (
        selectedBudget.value.to !== undefined &&
        selectedBudget.value.to !== ""
      )
        params.set("radius", selectedBudget.value.to);
    }

    navigate(`/partners?${params.toString()}`);
  };

  const googleOptions = useMemo(
    () => ({
      types: ["(cities)"],
      fields: [
        "formatted_address",
        "geometry.location",
        "place_id",
        "address_components",
        "name",
      ],
    }),
    []
  );

  return (
    <div className="container-large search-filter">
      <div className="bg-white px-2 py-4 rounded-2xl">
        <div className="flex items-start flex-col [@media(min-width:991px)]:flex-row gap-4">
          <div className="w-full pr-4 relative [@media(min-width:991px)]:border-r-[1px]  border-r-[#D4D4D4]">
            <div className="flex gap-3">
              <span className="w-11 h-11 rounded-full flex shrink-0 items-center justify-center bg-[#F2F2F2]">
                <Navigation />
              </span>
              <div>
                <span className="text-gray-500 text-sm">
                  Choisir votre localisation
                </span>
                <Autocomplete
                  apiKey={import.meta.env.VITE_PLACE_API}
                  onPlaceSelected={(place) => {
                    setPlaceDetails(place || null);
                    const text = place?.formatted_address || place?.name || "";
                    setLocationText(text);
                  }}
                  options={googleOptions}
                  value={locationText}
                  onChange={(e) => {
                    setLocationText(e.target.value);
                    setPlaceDetails(null);
                  }}
                  ref={inputRef}
                  className="bg-white w-full  text-sm sm:text-base outline-none placeholder:!text-[#0c1421]"
                  placeholder={"Rechercher par lieu"}
                />
              </div>
            </div>
          </div>

          <div className="w-full [@media(min-width:991px)]:px-4 [@media(min-width:991px)]:border-r-[1px]  border-r-[#D4D4D4]">
            <div className="flex gap-3 w-full">
              <span className="w-11 h-11 rounded-full flex shrink-0 items-center justify-center bg-[#F2F2F2]">
                <MapPin />
              </span>

              <div className="flex-1">
                <span className="text-gray-500 text-sm">
                  Choisir une catégorie
                </span>
                <CustomSelect
                  options={categories}
                  placeholder={
                    loadingCats ? "Loading..." : `Sélectionner une catégorie`
                  }
                  className="w-full custom-select rounded-full"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  isDisabled={loadingCats}
                  isClearable
                />
              </div>
            </div>
          </div>

          <div className="w-full [@media(min-width:991px)]:px-4">
            <div className="flex gap-3 w-full">
              <span className="w-11 h-11 rounded-full flex shrink-0 items-center justify-center bg-[#F2F2F2]">
                <Waypoints />
              </span>

              <div className="flex-1">
                <span className="text-gray-500 text-sm mb-2 block">
                  Sélectionner la distance
                </span>

                <SimpleRangeSlider
                  min={min}
                  max={max}
                  value={radiusKm}
                  step={10}
                  numberOfSections={10}
                  separator=" "
                  postfix="km"
                  showLabels={false}
                  onFinish={(val) => {
                    
                    setRadiusKm(val);
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={onSearch}
            className="flex gap-2 justify-center items-center h-12 w-full [@media(min-width:991px)]:w-[150px] bg-secondary text-white cursor-pointer rounded-lg shrink-0 transition-all duration-300 hover:bg-[#1f79aa]"
          >
            <Search size={20} /> <span>Rechercher</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBanner;
