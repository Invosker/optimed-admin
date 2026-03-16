import  { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// const fnGetDetails = async (lat: number, lng: number) => {
//   const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
//   if (!response.ok) {
//     console.error("Nominatim error:", response.status, response.statusText);
//     return null;
//   }
//   const data = await response.json();
//   return data;
// };

function LocationPicker({
  position,
  setPosition,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} icon={defaultIcon} /> : null;
}

export default function LocationModal({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pos: [number, number], address?: string) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>("");

  // Set initial position from geolocation
  useEffect(() => {
    if (isOpen && !position) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setPosition([10.48322013617697, -66.85801595449449]), // fallback: Caracas
        { enableHighAccuracy: true }
      );
    }
    if (!isOpen) {
      setPosition(null);
      setAddress("");
    }
  }, [isOpen]);

  // Fetch address when position changes
  useEffect(() => {
    if (!position) return;
    setAddress("Buscando dirección...");
    // fnGetDetails(position[0], position[1]).then((data) => {
    //   setAddress(data?.display_name || "Dirección no encontrada");
    // });
  }, [position]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg p-4 w-full max-w-lg relative">
        <button className="absolute top-2 right-2" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-lg font-bold mb-2">Selecciona tu ubicación</h2>
        <div style={{ height: 350, width: "100%" }}>
          {position && (
            <MapContainer center={position} zoom={16} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationPicker position={position} setPosition={setPosition} />
            </MapContainer>
          )}
        </div>
        {/* {address && (
          <div className="mt-2 text-sm text-gray-700">
            <strong>Dirección:</strong> {address}
          </div>
        )} */}
        <button
          className="mt-4 bg-emerald-900 text-gg px-4 py-2 rounded"
          onClick={() => position && onSelect(position, address)}
        >
          Confirmar ubicación
        </button>
      </div>
    </div>
  );
}
