import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  MapPin,
  Clock,
  ThumbsUp,
  ShieldCheck,
  Filter,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getReports,
  upvoteReport,
  updateReportStatus,
} from "../data/mockReports";
import StatusBadge from "../components/StatusBadge";

export default function HomeFeed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setReports(getReports());
  }, []);

  const handleUpvote = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setReports(upvoteReport(id));
  };

  const handleQuickStatusChange = (e, id, status) => {
    e.preventDefault();
    e.stopPropagation();
    setReports(updateReportStatus(id, status));
  };

  const filtered = reports.filter((item) => {
    if (filter === "all") return true;
    return (item?.status || "").toLowerCase() === filter.toLowerCase();
  });

  const bannerTheme = isAdmin
    ? "bg-slate-950 border-slate-800 text-white shadow-2xl shadow-slate-950/20"
    : "bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border-indigo-900/50 shadow-xl shadow-indigo-950/10";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      {/* Banner Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 transition-all sm:rounded-3xl sm:p-8 ${bannerTheme}`}
      >
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-200 backdrop-blur-md">
              <Activity size={10} className="animate-pulse text-indigo-400" />
              <span>Live Municipal Network</span>
            </div>
            <h1 className="flex items-center gap-2 pt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
              {isAdmin && (
                <ShieldCheck className="shrink-0 text-amber-400" size={22} />
              )}
              {isAdmin ? "Official Incident Triage" : "Community Reports Feed"}
            </h1>
            <p className="max-w-xl text-xs font-normal leading-relaxed text-slate-300 sm:text-sm">
              {isAdmin
                ? "Manage municipal incident workflows, verify public submissions, and escalate status updates."
                : "Real-time community reporting platform. Submit local issues and upvote critical reports."}
            </p>
          </div>

          {!isAdmin && (
            <button
              onClick={() => navigate("/create")}
              className="flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-xl bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-400 active:scale-[0.98] sm:self-center sm:text-sm"
            >
              <Plus size={16} />
              <span>Submit Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto py-0.5 text-xs sm:gap-2">
          <div className="shrink-0 p-1.5 text-slate-400">
            <Filter size={15} />
          </div>
          {["all", "pending", "in progress", "resolved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`shrink-0 cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-all duration-150 sm:px-4 ${
                filter === tab
                  ? isAdmin
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "bg-slate-900 text-white shadow-xs"
                  : "border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-100/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="shrink-0 whitespace-nowrap text-xs font-semibold text-slate-400">
          {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* Report Feed Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <Link
            key={item.id}
            to={`/record/${item.id}`}
            className="group relative block flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold sm:text-xs">
                <span className="uppercase tracking-wider text-indigo-600">
                  {item.type}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 font-normal text-slate-400">
                  <Clock size={12} />
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h3 className="flex items-center gap-1 text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                <span className="truncate">{item.title}</span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </h3>

              <p className="line-clamp-2 text-xs font-normal leading-relaxed text-slate-500 sm:text-sm">
                {item.description}
              </p>

              <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-slate-400">
                <MapPin size={13} className="shrink-0 text-slate-400" />
                <span className="truncate">
                  {item.location?.label || "Unspecified Location"}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <StatusBadge status={item.status} />

              {isAdmin ? (
                <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50 p-1">
                  {["Pending", "In Progress", "Resolved"].map((st) => (
                    <button
                      key={st}
                      onClick={(e) => handleQuickStatusChange(e, item.id, st)}
                      className={`cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                        item.status === st
                          ? "bg-slate-900 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {st === "In Progress" ? "Active" : st}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={(e) => handleUpvote(e, item.id)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95"
                >
                  <ThumbsUp size={14} />
                  <span>{item.upvotes || 0}</span>
                </button>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
