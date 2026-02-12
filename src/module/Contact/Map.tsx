import { GoogleMap, LoadScriptNext, Marker } from "@react-google-maps/api";

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

  return (
    <LoadScriptNext googleMapsApiKey={import.meta.env.VITE_PLACE_API}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15} // controlled zoom, no auto zoom-in
        options={{
          disableDefaultUI: true,
        }}
      >
        <Marker position={center} onClick={handleMarkerClick} />
      </GoogleMap>
    </LoadScriptNext>
  );
}
