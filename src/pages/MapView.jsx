import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getReports } from "../data/mockReports";

const DEFAULT_CENTER = [-1.286389, 36.817223];

export default function MapView() {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null); // <-- Added missing 'const' here

  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    const reports = getReports();
    const map = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    reports.forEach((item) => {
      const color =
        item.status === "Resolved"
          ? "#10b981"
          : item.status === "In Progress"
            ? "#f59e0b"
            : "#f43f5e";

      const customIcon = L.divIcon({
        className: "custom-pin",
        html: `<div style="background-color:${color}; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
      });

      const popup = `
        <div style="font-family: sans-serif; padding: 2px;">
          <strong style="color:${color}; font-size:10px; text-transform:uppercase;">${item.status}</strong>
          <h4 style="margin:2px 0; font-size:12px; font-weight:bold;">${item.title}</h4>
          <p style="margin:0; font-size:10px; color:#64748b;">${item.location?.label || ""}</p>
        </div>
      `;

      L.marker([item.lat, item.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(popup);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-sm font-bold text-slate-900">
            Interactive Map View
          </h1>
        </div>

        <div className="flex gap-2 text-[10px] font-semibold">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>Active
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Resolved
          </span>
        </div>
      </div>

      <div className="h-[420px] w-full rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative z-0">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>
    </div>
  );
}