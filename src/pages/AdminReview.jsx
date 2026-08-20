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
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6 space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <ShieldAlert size={24} />
        </div>
        <h2 className="text-base font-bold text-slate-900">
          Access Restricted
        </h2>
        <p className="text-xs text-slate-500 max-w-xs">
          Only registered Government Officials can access report status
          moderation.
        </p>
        <Link
          to="/home"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
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
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-amber-600" />
            Official Moderation Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Live analytics and status control
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-center">
          <AlertCircle size={16} className="mx-auto text-rose-600 mb-1" />
          <p className="text-base font-extrabold text-rose-700">
            {pendingCount}
          </p>
          <p className="text-[10px] font-bold text-rose-600 uppercase">
            Pending
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-center">
          <Clock size={16} className="mx-auto text-amber-600 mb-1" />
          <p className="text-base font-extrabold text-amber-700">
            {inProgressCount}
          </p>
          <p className="text-[10px] font-bold text-amber-600 uppercase">
            In Progress
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center">
          <CheckCircle2 size={16} className="mx-auto text-emerald-600 mb-1" />
          <p className="text-base font-extrabold text-emerald-700">
            {resolvedCount}
          </p>
          <p className="text-[10px] font-bold text-emerald-600 uppercase">
            Resolved
          </p>
        </div>
      </div>

      {/* Report List */}
      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {reports.map((item) => (
          <div
            key={item.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">
                  {item.type}
                </span>
                <StatusBadge status={item.status} />
              </div>
              <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
              <p className="text-[11px] text-slate-500">
                {item.location?.label}
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs">
              {["Pending", "In Progress", "Resolved"].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(item.id, st)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer border transition ${
                    item.status === st
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
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