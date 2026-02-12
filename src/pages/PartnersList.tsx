import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CircleX,
  Euro,
  Heart,
  LayoutGridIcon,
  LayoutList,
  MapPin,
  MapPinCheck,
  MapPinIcon,
  Route,
  Search,
  SlidersHorizontal,
  StarIcon,
  Tag,
  Users,
  UserStar,
  CheckCircle2,
} from "lucide-react";
import Autocomplete from "react-google-autocomplete";
import { motion } from "motion/react";
import CustomSelect from "../components/ui-main/selectBox";
import Button from "../components/ui/Button";
import { getRequest } from "../utils/http-client/axiosClient";
import { PROVIDER } from "../utils/endPoints";
import women from "../../src/assets/images/women.jpg";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import MyFavorite from "../components/ui/MyFavorite";
import { SimpleRangeSlider } from "react-range-slider-advanced";
import "react-range-slider-advanced/style.css";
import { fakePartners, fakeCategories } from "../data/fakePartners";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "36px",
    height: "36px",
    boxShadow: "none",
    paddingTop: "1px",
    fontSize: "14px",
    borderColor: state.isFocused ? "#d4d7e3" : "#d4d7e3",
    "&:hover": { borderColor: "#d4d7e3" },
  }),
};

const PartnersList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [partners, setPartners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [radiusKm, setRadiusKm] = useState(0);
  const [locationText, setLocationText] = useState("");
  const [searchName, setSearchName] = useState("");
  const [latLng, setLatLng] = useState({ lat: "", long: "" });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState({ from: "", to: "" });
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedSortBy, setSelectedSortBy] = useState(null);
  const [selectedLimit, setSelectedLimit] = useState({
    value: 10,
    label: "10",
  });
  const [paginationData, setPaginationData] = useState();
  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");

  const inputRef = useRef(null);

  // const budgetOptions = [
  //   { value: { from: 0, to: 500 }, label: "0 - 500" },
  //   { value: { from: 500, to: 1000 }, label: "500 - 1000" },
  //   { value: { from: 1000, to: 5000 }, label: "1000 - 5000" },
  //   { value: { from: 5000, to: "" }, label: "5000+" },
  // ];
  // const distance = [
  //   { value: "50", label: "50 km" },
  //   { value: "100", label: "100 km" },
  //   { value: "200", label: "200 km" },
  // ];

  const sortOptions = [
    { value: "recent", label: "Plus récents" },
    { value: "toprated", label: "Mieux notés" },
    { value: "popular", label: "Plus populaires" },
  ];

  const limitOptions = [
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 20, label: "20" },
  ];

  const googleOptions = useMemo(
    () => ({
      types: ["(cities)"],
      fields: ["formatted_address", "geometry.location", "place_id", "name"],
    }),
    []
  );
  const login = useSelector((state) => state?.login);
  
  // Parse query params
  const parseQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      page: parseInt(params.get("page")) || 1,
      lat: params.get("lat") || "",
      long: params.get("long") || "",
      radius:
        params.get("radius") !== null ? Number(params.get("radius")) : null,
      services: params.get("services") || "",
      rating: params.get("rating") || "",
      budgetFrom: params.get("budgetFrom") || "",
      budgetTo: params.get("budgetTo") || "",
      sort: params.get("sort") || "",
      limit: parseInt(params.get("limit")) || 10,
      uid: login?.user?.id || null,
    };
  };

  const updateQueryParams = (updates) => {
    const params = new URLSearchParams(location.search);
    const current = parseQueryParams();

    // Always keep radius unless explicitly removed
    if (!("radius" in updates) && current.radius !== null) {
      params.set("radius", current.radius);
    }

    Object.entries(updates).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });

    navigate({ search: params.toString() }, { replace: true });
  };

  // Fetch Profiles
  const fetchProfiles = async (append = false) => {
    try {
      setLoadingData(true);
      const {
        page,
        lat,
        long,
        radius,
        services,
        rating,
        budgetFrom,
        budgetTo,
        sort,
        limit,
      } = parseQueryParams();
      const uId = login?.user?.id || null;
      const res = await getRequest(
        `${PROVIDER.GET_ALL_PROFILES}?page=${page}&limit=${limit}&lat=${lat}&long=${long}&radius=${radius}&services=${services}&rating=${rating}&budgetFrom=${budgetFrom}&budgetTo=${budgetTo}&sort=${sort}&uid=${uId}`
      );

      if (res?.status === 200 && Array.isArray(res?.data?.data?.businesses)) {
        setPartners((prev) =>
          append
            ? [...prev, ...res.data?.data?.businesses]
            : res.data?.data?.businesses
        );
        setPaginationData(res?.data?.data);
        setHasMore(res?.data?.data?.businesses?.length > 0);
      } else {
        if (!append) setPartners([]);
        setHasMore(false);
      }
    } catch (err) {
      // Use fake data when API is not available
      if (import.meta.env.DEV) {
        console.debug('API not available - using fake partner data');
        let filteredPartners = [...fakePartners];
        
        // Filter by search name if provided
        if (searchName && searchName.trim() !== '') {
          filteredPartners = filteredPartners.filter(p => 
            p.name.toLowerCase().includes(searchName.toLowerCase())
          );
        }
        
        setPartners(filteredPartners);
        setPaginationData({ 
          totalCount: filteredPartners.length, 
          currentPage: 1, 
          totalPages: 1 
        });
        setHasMore(false);
      } else {
        if (!append) setPartners([]);
        setHasMore(false);
      }
    } finally {
      setLoadingData(false);
    }
  };

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
      }
    } catch (err) {
      // Use fake categories when API is not available
      if (import.meta.env.DEV) {
        console.debug('API not available - using fake categories');
        const opts = fakeCategories.map(c => ({
          value: c.id,
          label: c.name
        }));
        setCategories(opts);
      }
    } finally {
      setLoadingCats(false);
    }
  };

  useEffect(() => {
    const {
      page,
      lat,
      long,
      services,
      budgetFrom,
      budgetTo,
      rating,
      sort,
      limit,
      radius,
    } = parseQueryParams();

    setPage(page);

    setSelectedLimit(
      limitOptions.find((l) => l.value === limit) || { value: 10, label: "10" }
    );

    if (lat && long) setLatLng({ lat, long });
    if (radius !== null && !isNaN(radius)) setRadiusKm(radius);

    if (services && categories.length) {
      const found = categories.find(
        (c) => String(c.value) === String(services)
      );
      setSelectedCategory(found || null);
    }

    if (budgetFrom || budgetTo)
      setSelectedBudget({ from: budgetFrom, to: budgetTo });
    if (rating) setSelectedRating(rating);

    if (sort) {
      const foundSort = sortOptions.find((s) => s.value === sort);
      setSelectedSortBy(foundSort || null);
    }

    setPartners([]);
    setLoadingData(true);
    fetchProfiles(false);
  }, [location.search, categories]);

  // useEffect(() => {
  //   const query = parseQueryParams();

  //   if (query.radius !== null && !isNaN(query.radius)) {
  //     setRadiusKm(query.radius);
  //     setRadius(query.radius);
  //   }

  //   fetchProfiles(query.page > 1);
  // }, [location.search, categories]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const selectedFilters = [
    locationText && { type: "location", label: locationText },
    selectedCategory && { type: "services", label: selectedCategory.label },
    (selectedBudget.from || selectedBudget.to) && {
      type: "budget",
      label: `${selectedBudget.from} - ${selectedBudget.to || "∞"}`,
    },
    selectedRating && { type: "rating", label: `${selectedRating}+ stars` },
  ].filter(Boolean);

  const removeFilter = (type) => {
    if (type === "location") {
      setLocationText("");
      setLatLng({ lat: "", long: "" });
      updateQueryParams({ lat: "", long: "" });
    }
    if (type === "services") {
      setSelectedCategory(null);
      updateQueryParams({ services: "" });
    }
    if (type === "budget") {
      setSelectedBudget({ from: "", to: "" });
      updateQueryParams({ budgetFrom: "", budgetTo: "" });
    }
    if (type === "rating") {
      setSelectedRating(null);
      updateQueryParams({ rating: "" });
    }
  };

  
  
  return (
    <div className="pt-32 pb-12 md:pb-24 md:pt-36">
      <section className="max-w-[768px] mx-auto mb-10">
        <div className="container-1180">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-3xl sm:text-4xl md:text-4xl text-center font-bold font-inter"
          >
            Découvrez notre sélection de professionnels pour tous types
            d’événements
          </motion.h1>
        </div>
      </section>

      <section>
        <div className="container-large">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            <motion.aside
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.3 }}
              className="bg-white rounded-md p-5 border border-gray-200 space-y-5 w-full lg:w-3/12 lg:sticky top-[95px]"
            >
              <span className="text-xl flex gap-2 items-center font-semibold mb-4">
                <SlidersHorizontal size={16} /> Filtrer par
              </span>
              
              {/* Search by Name */}
              <div>
                <span className="flex gap-2 items-center font-medium mb-2">
                  <Search size={16} /> Rechercher par nom
                </span>
                <div className="relative flex-1 w-full">
                  <Search
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => {
                      setSearchName(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        fetchProfiles();
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 text-sm outline-none placeholder:text-gray-400 border border-gray-300 rounded-lg focus:border-we-green focus:ring-2 focus:ring-we-green/20 transition-all"
                    placeholder="Nom de l'entreprise..."
                  />
                  {searchName && (
                    <button
                      onClick={() => {
                        setSearchName("");
                        fetchProfiles();
                      }}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      <CircleX size={18} />
                    </button>
                  )}
                </div>
                {searchName && (
                  <button
                    onClick={() => fetchProfiles()}
                    className="mt-2 w-full py-2 bg-we-green text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    Rechercher
                  </button>
                )}
              </div>
              
              <div>
                <span className="flex gap-2 items-center font-medium mb-2">
                  <MapPinIcon size={16} /> Lieu
                </span>
                <div className="relative flex-1 w-full custom-search">
                  <Search
                    className="absolute left-3 top-4 text-gray-400"
                    size={20}
                  />
                  <Autocomplete
                    apiKey={import.meta.env.VITE_PLACE_API}
                    onPlaceSelected={(place, input) => {
                      const text =
                        place?.formatted_address ||
                        place?.name ||
                        input?.value ||
                        "";
                      setLocationText(text);
                      const lat = place?.geometry?.location?.lat();
                      const lng = place?.geometry?.location?.lng();
                      if (lat && lng) {
                        setLatLng({ lat, long: lng });
                        updateQueryParams({ lat, long: lng, page: 1 });
                      }
                    }}
                    options={googleOptions}
                    value={locationText}
                    onChange={(e) => {
                      setLocationText(e.target.value);
                      if (!e.target.value)
                        updateQueryParams({ lat: "", long: "" });
                    }}
                    ref={inputRef}
                    className="w-full px-10 py-3 text-sm sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder rounded-lg focus:border-secondary dark:bg-inputdarkbg dark:text-neutral-300"
                    placeholder={"Rechercher par lieu"}
                    libraries={["places"]}
                  />
                </div>
              </div>

              <div>
                <span className="flex gap-2 items-center font-medium mb-2">
                  <Tag size={16} /> Catégorie
                </span>
                <CustomSelect
                  options={categories}
                  placeholder={
                    loadingCats ? "Loading..." : `Sélectionner une catégorie`
                  }
                  className="w-full custom-select rounded-full"
                  value={selectedCategory}
                  onChange={(val) => {
                    setSelectedCategory(val);
                    updateQueryParams({ services: val?.value || "", page: 1 });
                  }}
                  isDisabled={loadingCats}
                  isClearable
                />
              </div>

              <div className="flex-1">
                <span className="flex gap-2 items-center font-medium mb-2">
                  <Route size={16} /> Sélectionner la distance
                </span>

                <SimpleRangeSlider
                  min={0}
                  max={200}
                  value={radiusKm}
                  step={10}
                  numberOfSections={10}
                  separator=" "
                  postfix="km"
                  showLabels={false}
                  onFinish={(val) => {
                    
                    setRadiusKm(val);
                    updateQueryParams({ radius: val, page: 1 });
                  }}
                />
              </div>

              <div>
                <span className="flex gap-2 items-center font-medium mb-2">
                  <UserStar size={18} /> Évaluation
                </span>
                {[4.5, 4, 3].map((r, i) => (
                  <label key={i} className="flex items-center gap-2 my-1">
                    <input
                      type="radio"
                      name="rating"
                      value={r}
                      checked={Number(selectedRating) === r}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSelectedRating(val);
                        updateQueryParams({ rating: val, page: 1 });
                      }}
                      className="accent-primary w-4 h-4"
                    />
                    <span>{r} et plus</span>
                    <StarIcon
                      size={14}
                      className="text-yellow-500 fill-yellow-500"
                    />
                  </label>
                ))}
              </div>
            </motion.aside>

            <div className="w-full lg:w-3/4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between mb-3 border-b border-gray-200 pb-3">
                <span className="flex gap-2 items-center text-gray-600">
                  <Users size={16} /> {partners.length} résultats
                </span>
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Limit Dropdown */}
                  <CustomSelect
                    options={limitOptions}
                    value={selectedLimit}
                    onChange={(val) => {
                      setSelectedLimit(val);
                      setPage(1);
                      updateQueryParams({ limit: val?.value || 10, page: 1 });
                    }}
                    placeholder="Limit"
                    styles={customStyles}
                    className="w-full sm:w-[100px]"
                  />
                  <CustomSelect
                    options={sortOptions}
                    value={selectedSortBy}
                    onChange={(val) => {
                      setSelectedSortBy(val);
                      updateQueryParams({ sort: val?.value || "", page: 1 });
                    }}
                    placeholder="Trier par"
                    styles={customStyles}
                    className="w-full sm:w-[200px] relative z-30"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setView("grid")}
                      className={`w-9 h-9 rounded-md flex justify-center items-center cursor-pointer ${
                        view === "grid"
                          ? "bg-secondary hover:bg-tertiary text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      <LayoutGridIcon size={20} />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={`w-9 h-9 rounded-md flex justify-center items-center cursor-pointer ${
                        view === "list"
                          ? "bg-secondary hover:bg-tertiary text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      <LayoutList size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 my-4">
                {selectedFilters.map((f, i) => (
                  <div
                    key={i}
                    className="mb-2.5 flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-400 hover:bg-gray-200"
                  >
                    {f.type === "location" && <MapPinCheck size={16} />}
                    {f.type === "services" && <Tag size={16} />}
                    {f.type === "budget" && <Euro size={16} />}
                    {f.type === "rating" && <StarIcon size={16} />}
                    {f.label}
                    <CircleX
                      size={22}
                      onClick={() => removeFilter(f.type)}
                      className="text-white fill-secondary cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              {loadingData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-4 bg-white rounded-md shadow">
                      <Skeleton height={200} />
                      <Skeleton count={3} style={{ marginTop: 10 }} />
                    </div>
                  ))}
                </div>
              ) : partners.length === 0 ? (
                <div className="text-center text-gray-500 py-10 text-lg font-medium">
                  Aucune donnée trouvée
                </div>
              ) : view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partners.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
                    >
                      {/* Favorite Button */}
                      <div className="absolute top-4 left-4 z-20">
                        <MyFavorite id={p?.id} isFavorite={p?.isFavorite} />
                      </div>

                      {/* Verified Badge */}
                      {p.verified && (
                        <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                          <span className="text-xs font-semibold text-we-green flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Vérifié
                          </span>
                        </div>
                      )}

                      <Link
                        to={`/partners/${p.id}`}
                        className="block h-full"
                      >
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={p.portfolioImages?.[0] || women}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Arrow Button */}
                          <div className="absolute bottom-4 right-4 w-12 h-12 bg-we-green group-hover:bg-green-600 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-xl">
                            <ArrowRight
                              size={22}
                              className="text-white"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-3">
                          {/* Services Tags */}
                          <div className="flex flex-wrap gap-2">
                            {p.services?.slice(0, 2).map((item, idx) => (
                              <span
                                key={idx}
                                className="text-xs font-medium text-we-green bg-green-50 px-3 py-1 rounded-full border border-green-100"
                              >
                                {item}
                              </span>
                            ))}
                            {p.services?.length > 2 && (
                              <span className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                +{p.services.length - 2}
                              </span>
                            )}
                          </div>

                          {/* Name */}
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-we-green transition-colors line-clamp-1">
                            {p.name}
                          </h3>

                          {/* Location */}
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                            <span className="text-sm line-clamp-2">{p.city || p.address || ""}</span>
                          </div>

                          {/* Rating & Stats */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <StarIcon
                                size={18}
                                className="text-amber-400 fill-amber-400"
                              />
                              <span className="text-sm font-bold text-gray-900">
                                {p.rating?.averageRating || 0}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({p.rating?.totalReviews || 0})
                              </span>
                            </div>
                            
                            {p.completedEvents && (
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <CheckCircle2 size={14} className="text-we-green" />
                                {p.completedEvents} événements
                              </div>
                            )}
                          </div>

                          {/* Response Time Badge */}
                          {p.responseTime && (
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-gray-600">Répond en {p.responseTime}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {partners.map((p) => (
                    <div key={p.id} className="provider__blk relative">
                      <label className="cursor-pointer absolute z-10 w-9 h-9 top-5 left-5 flex gap-1 items-center text-sm rounded-full bg-white px-2 py-1 text-white">
                        <input
                          type="checkbox"
                          name="fav"
                          className="hidden peer"
                        />
                        <Heart
                          size={20}
                          className="text-gray-600 peer-checked:text-yellow-400 peer-checked:fill-current"
                        />
                      </label>
                      <Link
                        to={`/partners/${p.id}`}
                        className="property-listing flex flex-col sm:flex-row items-center group w-full relative bg-white border border-gray-200 p-3 rounded-2xl hover:border-primary"
                      >
                        <div className="w-full sm:w-2/6">
                          <div className="w-full h-[200px] overflow-hidden image-effect !rounded-[20px]">
                            <img
                              src={p.portfolioImages?.[0] || women}
                              alt={p.name}
                              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-120"
                            />
                          </div>
                        </div>
                        <div className="w-full sm:w-2/3 flex flex-col items-start py-4 px-5 gap-1 bg-white">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {p.services?.map((item, idx) => (
                              <span
                                key={idx}
                                className="text-gray-600 text-xs border border-gray-200 bg-gray-100 px-2 py-1 rounded-full"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                          <span className="text-xl md:text-2xl font-semibold capitalize mb-4 relative before:content-[''] before:w-full before:h-[2px] before:bg-primary before:absolute before:transition-transform before:duration-300 before:origin-right before:left-0 before:-bottom-0 before:scale-x-0 group-hover:before:scale-x-100 group-hover:before:origin-left">
                            {p.name}
                          </span>
                          <div className="flex flex-wrap divide-x divide-borderlight gap-x-3">
                            <span className="text-gray-600 flex items-center gap-1 pr-3">
                              <MapPin size={14} /> {p.address || p.city || ""}
                            </span>
                            <span className="text-gray-600 flex items-center gap-1 pr-3">
                              <Euro size={14} /> {p.budget}
                            </span>
                            <span className="flex items-center gap-1">
                              <StarIcon
                                size={14}
                                className="text-yellow-400 fill-yellow-400"
                              />{" "}
                              {p.rating?.averageRating || 0}
                            </span>
                          </div>
                          <Button
                            variant="primary"
                            size="medium"
                            className="mt-4"
                          >
                            Sélectionner
                          </Button>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {partners.length < paginationData?.total && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => {
                      const nextLimit =
                        Number(selectedLimit?.value || 3) +
                        Number(selectedLimit?.value || 3);

                      const newLimitObj = limitOptions.find(
                        (l) => l.value === nextLimit
                      ) || {
                        value: nextLimit,
                        label: String(nextLimit),
                      };

                      setSelectedLimit(newLimitObj);
                      updateQueryParams({ limit: nextLimit });
                    }}
                  >
                    Voir plus
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersList;
