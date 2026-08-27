import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Navigation, Camera, Loader2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiCreateReport } from "../api";

const REPORT_TYPES = { RED_FLAG: "Red-flag", INTERVENTION: "Intervention" };

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
  const [photoFile, setPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setError("");
    setIsSubmitting(true);

    try {
      await apiCreateReport({
        type,
        title,
        description,
        locationLabel,
        photoFile,
      });
      navigate("/home");
    } catch (err) {
      setError(err.message || "Could not submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="cursor-pointer text-slate-500 hover:text-slate-800"
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="text-sm font-bold text-slate-900">Submit Civic Issue</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Choice */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-400">
            Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType(REPORT_TYPES.RED_FLAG)}
              className={`cursor-pointer rounded-xl border p-2.5 text-xs font-semibold transition ${
                type === REPORT_TYPES.RED_FLAG
                  ? "border-rose-600 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Red-Flag (Hazard)
            </button>
            <button
              type="button"
              onClick={() => setType(REPORT_TYPES.INTERVENTION)}
              className={`cursor-pointer rounded-xl border p-2.5 text-xs font-semibold transition ${
                type === REPORT_TYPES.INTERVENTION
                  ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Intervention
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
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
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context or severity details..."
            className="w-full resize-none rounded-lg border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
          />
        </div>

        {/* Location + GPS */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
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
              className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:opacity-50"
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
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Attach Photo Evidence
          </label>
          {imagePreview ? (
            <div className="relative h-32 overflow-hidden rounded-xl border border-slate-200">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 cursor-pointer rounded-full bg-slate-900/70 p-1 text-white hover:bg-slate-900"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 transition hover:bg-slate-50">
              <Camera size={20} className="mb-1 text-slate-400" />
              <span className="text-[11px] font-medium text-slate-500">
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

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
