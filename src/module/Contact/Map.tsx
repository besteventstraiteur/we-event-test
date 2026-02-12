import { GoogleMap, LoadScriptNext, MarkerF } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "1.5rem",
  overflow: "hidden",
};

const center = {
  lat: 43.5294963,
  lng: 6.4727052,
};

export default function OfficeMap() {
  const handleMarkerClick = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${center.lat},${center.lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  // Don't render map if API key is not configured
  const apiKey = import.meta.env.VITE_PLACE_API;
  
  if (!apiKey || apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
    return (
      <div className="w-full h-[450px] rounded-3xl bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-2">📍 Carte Google Maps</p>
          <p className="text-sm text-gray-400">Configuration de l'API en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScriptNext googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15} // controlled zoom, no auto zoom-in
        options={{
          disableDefaultUI: true,
          mapId: "we-event-map", // Required for Advanced Markers
        }}
      >
        <MarkerF position={center} onClick={handleMarkerClick} />
      </GoogleMap>
    </LoadScriptNext>
  );
}
