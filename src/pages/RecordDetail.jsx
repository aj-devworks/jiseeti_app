import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Edit3,
  Trash2,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getReportById,
  updateReportDetails,
  deleteReport,
  updateReportStatus,
} from "../data/mockReports";
import StatusBadge from "../components/StatusBadge";

export default function RecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [report, setReport] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editLocation, setEditLocation] = useState("");

  useEffect(() => {
    const data = getReportById(id);
    if (data) {
      setReport(data);
      setEditTitle(data.title);
      setEditDesc(data.description);
      setEditLocation(data.location?.label || "");
    }
  }, [id]);

  if (!report) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        Report record not found.
      </div>
    );
  }

  const isCitizen = user?.role === "citizen" || !user?.role;
  const isAdmin = user?.role === "admin";

  // Citizen Actions
  function handleSaveDetails(e) {
    e.preventDefault();
    updateReportDetails(id, {
      title: editTitle,
      description: editDesc,
      locationLabel: editLocation,
    });
    setReport({
      ...report,
      title: editTitle,
      description: editDesc,
      location: { label: editLocation },
    });
    setIsEditing(false);
  }

  function handleDelete() {
    if (confirm("Are you sure you want to delete this report?")) {
      deleteReport(id);
      navigate("/home");
    }
  }

  // Admin Action
  function handleStatusChange(newStatus) {
    updateReportStatus(id, newStatus);
    setReport({ ...report, status: newStatus });
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-sm font-bold text-slate-900">Report Details</h1>
        </div>

        {/* Citizen Edit & Delete Buttons */}
        {isCitizen && !isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
            {report.type}
          </span>
          <StatusBadge status={report.status} />
        </div>

        {/* CITIZEN EDIT FORM */}
        {isEditing ? (
          <form onSubmit={handleSaveDetails} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-600 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Location
              </label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 cursor-pointer"
              >
                <X size={13} />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                <Check size={13} />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        ) : (
          /* READ-ONLY DISPLAY */
          <>
            <h2 className="text-base font-bold text-slate-900">
              {report.title}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {report.description}
            </p>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                {report.location?.label || "Unspecified Location"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {new Date(report.createdAt).toLocaleString()}
              </span>
            </div>
          </>
        )}

        {/* ADMIN STATUS CONTROLS */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 bg-amber-50/50 p-3 rounded-lg border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <ShieldCheck size={15} />
              <span>Admin Moderation: Change Status</span>
            </div>
            <div className="flex gap-2">
              {["Pending", "In Progress", "Resolved"].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-semibold cursor-pointer border transition ${
                    report.status === st
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}