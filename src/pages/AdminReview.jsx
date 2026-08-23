import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getReports, updateReportStatus } from "../data/mockReports";
import StatusBadge from "../components/StatusBadge";

export default function AdminReview() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(getReports());
  }, []);

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
          Only registered Government Officials can access report status
          moderation.
        </p>
        <Link
          to="/home"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm"
        >
          Return to Feed
        </Link>
      </div>
    );
  }

  function handleStatusChange(id, status) {
    const updated = updateReportStatus(id, status);
    setReports(updated);
  }

  const pendingCount = reports.filter((r) => r.status === "Pending").length;
  const inProgressCount = reports.filter(
    (r) => r.status === "In Progress",
  ).length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="border-b border-slate-200/80 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={22} className="text-amber-500 shrink-0" />
            <span>Official Moderation Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 pt-0.5">
            Live analytics and status triage
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-3 sm:p-4 text-center shadow-xs">
          <AlertCircle size={18} className="mx-auto text-rose-600 mb-1" />
          <p className="text-lg sm:text-2xl font-black text-rose-700">
            {pendingCount}
          </p>
          <p className="text-[10px] sm:text-xs font-bold text-rose-600 uppercase tracking-wider">
            Pending
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-3 sm:p-4 text-center shadow-xs">
          <Clock size={18} className="mx-auto text-amber-600 mb-1" />
          <p className="text-lg sm:text-2xl font-black text-amber-700">
            {inProgressCount}
          </p>
          <p className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase tracking-wider">
            In Progress
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-3 sm:p-4 text-center shadow-xs">
          <CheckCircle2 size={18} className="mx-auto text-emerald-600 mb-1" />
          <p className="text-lg sm:text-2xl font-black text-emerald-700">
            {resolvedCount}
          </p>
          <p className="text-[10px] sm:text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Resolved
          </p>
        </div>
      </div>

      {/* Report List */}
      <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {reports.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  {item.type}
                </span>
                <span className="text-slate-300">•</span>
                <StatusBadge status={item.status} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {item.location?.label || "Unspecified Location"}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs shrink-0 flex-wrap">
              {["Pending", "In Progress", "Resolved"].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(item.id, st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    item.status === st
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}