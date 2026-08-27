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
import { apiGetReports, apiUpdateReportStatus } from "../api";
import StatusBadge from "../components/StatusBadge";

export default function AdminReview() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") return;
    apiGetReports()
      .then(setReports)
      .catch((err) => setError(err.message || "Could not load reports."));
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
        <p className="max-w-sm text-xs text-slate-500 sm:text-sm">
          Only registered Government Officials can access report status
          moderation.
        </p>
        <Link
          to="/home"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Return to Feed
        </Link>
      </div>
    );
  }

  async function handleStatusChange(id, status) {
    try {
      const updatedReport = await apiUpdateReportStatus(id, status);
      setReports((prev) =>
        prev.map((r) => (r.id === updatedReport.id ? updatedReport : r)),
      );
    } catch (err) {
      setError(err.message || "Could not update status.");
    }
  }

  const pendingCount = reports.filter((r) => r.status === "Pending").length;
  const inProgressCount = reports.filter(
    (r) => r.status === "In Progress",
  ).length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;

  const STATS = [
    {
      label: "Pending",
      count: pendingCount,
      icon: AlertCircle,
      cardBorder: "border-rose-200/80 bg-rose-50/50",
      iconColor: "text-rose-600",
      textColor: "text-rose-700",
      labelColor: "text-rose-600",
    },
    {
      label: "In Progress",
      count: inProgressCount,
      icon: Clock,
      cardBorder: "border-amber-200/80 bg-amber-50/50",
      iconColor: "text-amber-600",
      textColor: "text-amber-700",
      labelColor: "text-amber-600",
    },
    {
      label: "Resolved",
      count: resolvedCount,
      icon: CheckCircle2,
      cardBorder: "border-emerald-200/80 bg-emerald-50/50",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-700",
      labelColor: "text-emerald-600",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="flex items-center gap-2 text-base font-bold text-slate-900 sm:text-xl">
            <ShieldCheck size={22} className="shrink-0 text-amber-500" />
            <span>Official Moderation Dashboard</span>
          </h1>
          <p className="pt-0.5 text-xs text-slate-500">
            Live analytics and status triage
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-600">
          {error}
        </div>
      )}

      {/* Analytics Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {STATS.map((stat) => {
          const StatIcon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-2xl border p-3 text-center shadow-xs sm:p-4 ${stat.cardBorder}`}
            >
              <StatIcon
                size={18}
                className={`mx-auto mb-1 ${stat.iconColor}`}
              />
              <p className={`text-lg font-black sm:text-2xl ${stat.textColor}`}>
                {stat.count}
              </p>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider sm:text-xs ${stat.labelColor}`}
              >
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Report List */}
      <div className="divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs">
        {reports.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 p-4 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between sm:p-5"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {item.type}
                </span>
                <span className="text-slate-300">•</span>
                <StatusBadge status={item.status} />
              </div>
              <h3 className="truncate text-sm font-bold text-slate-900 sm:text-base">
                {item.title}
              </h3>
              <p className="truncate text-xs text-slate-500">
                {item.location?.label || "Unspecified Location"}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-1.5 text-xs">
              {["Pending", "In Progress", "Resolved"].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(item.id, st)}
                  className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    item.status === st
                      ? "bg-slate-900 text-white shadow-xs"
                      : "border border-slate-200/80 bg-slate-50 text-slate-600 hover:bg-slate-100"
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
