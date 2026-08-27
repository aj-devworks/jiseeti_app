import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { apiGetReports } from "../api";

const DEFAULT_CENTER = [-1.286389, 36.817223];

// Backend doesn't store lat/lng yet, so derive a stable pseudo-position
// per report id so pins don't jump around between renders.
function fallbackCoords(id) {
  const seed = String(id)
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const jitter = ((seed % 100) / 100 - 0.5) * 0.02;
  const jitter2 = (((seed * 7) % 100) / 100 - 0.5) * 0.02;
  return [DEFAULT_CENTER[0] + jitter, DEFAULT_CENTER[1] + jitter2];
}

const STATUS_COLORS = {
  Resolved: "#10b981",
  "In Progress": "#f59e0b",
  Pending: "#f43f5e",
};

export default function MapView() {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    apiGetReports().then((reports) => {
      reports.forEach((item) => {
        const color = STATUS_COLORS[item.status] || STATUS_COLORS.Pending;
        const [lat, lng] =
          item.lat && item.lng ? [item.lat, item.lng] : fallbackCoords(item.id);

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

        L.marker([lat, lng], { icon: customIcon }).addTo(map).bindPopup(popup);
      });
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
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cursor-pointer text-slate-500 hover:text-slate-800"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-sm font-bold text-slate-900">
            Interactive Map View
          </h1>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Pending
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Active
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Resolved
          </span>
        </div>
      </div>

      <div className="relative z-0 h-[280px] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm sm:h-[350px] md:h-[420px]">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>
    </div>
  );
}
