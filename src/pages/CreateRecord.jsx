import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Navigation,
  Camera,
  Loader2,
  X,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createReport, REPORT_TYPES } from "../data/mockReports";

export default function CreateRecord() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [type, setType] = useState(REPORT_TYPES.RED_FLAG);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [coords, setCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Prevents screen flash before redirecting
  }

  // GPS Auto-Detection
  const handleGetLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation is not supported.");
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setLocationLabel(
          `GPS (${latitude.toFixed(3)}, ${longitude.toFixed(3)})`,
        );
        setIsLocating(false);
      },
      () => {
        alert("Unable to fetch location.");
        setIsLocating(false);
      },
    );
  };

  // Image Upload Handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    createReport({
      type,
      title,
      description,
      locationLabel,
      lat: coords?.lat,
      lng: coords?.lng,
      imageUrl: imagePreview,
    });
    navigate("/home");
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="text-sm font-bold text-slate-900">Submit Civic Issue</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Choice */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
            Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType(REPORT_TYPES.RED_FLAG)}
              className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                type === REPORT_TYPES.RED_FLAG
                  ? "border-rose-600 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              Red-Flag (Hazard)
            </button>
            <button
              type="button"
              onClick={() => setType(REPORT_TYPES.INTERVENTION)}
              className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                type === REPORT_TYPES.INTERVENTION
                  ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              Intervention
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Title
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Broken Pavement"
            className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context or severity details..."
            className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none resize-none"
          />
        </div>

        {/* Location + GPS */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Location
          </label>
          <div className="flex gap-2">
            <input
              value={locationLabel}
              onChange={(e) => setLocationLabel(e.target.value)}
              placeholder="Street or Ward"
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="flex items-center gap-1 shrink-0 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition cursor-pointer"
            >
              {isLocating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Navigation size={14} />
              )}
              <span>GPS</span>
            </button>
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Attach Photo Evidence
          </label>
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 h-32">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 rounded-full bg-slate-900/70 p-1 text-white hover:bg-slate-900 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition">
              <Camera size={20} className="text-slate-400 mb-1" />
              <span className="text-[11px] text-slate-500 font-medium">
                Click to upload photo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white hover:bg-indigo-700 transition cursor-pointer shadow-sm"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}