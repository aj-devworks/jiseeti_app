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

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5">
      {/* Banner Card */}
      <div
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 border transition-all ${
          isAdmin
            ? "bg-slate-950 border-slate-800 text-white shadow-2xl shadow-slate-950/20"
            : "bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border-indigo-900/50 shadow-xl shadow-indigo-950/10"
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/10 text-indigo-200 border border-white/10 backdrop-blur-md">
              <Activity size={10} className="animate-pulse text-indigo-400" />
              <span>Live Municipal Network</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 pt-1">
              {isAdmin ? (
                <ShieldCheck className="text-amber-400 shrink-0" size={22} />
              ) : null}
              {isAdmin ? "Official Incident Triage" : "Community Reports Feed"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              {isAdmin
                ? "Manage municipal incident workflows, verify public submissions, and escalate status updates."
                : "Real-time community reporting platform. Submit local issues and upvote critical reports."}
            </p>
          </div>

          {!isAdmin && (
            <button
              onClick={() => navigate("/create")}
              className="self-start sm:self-center flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.98] cursor-pointer shrink-0"
            >
              <Plus size={16} />
              <span>Submit Report</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto text-xs scrollbar-none py-0.5">
          <div className="p-1.5 text-slate-400 shrink-0">
            <Filter size={15} />
          </div>
          {["all", "pending", "in progress", "resolved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`shrink-0 rounded-xl px-3.5 sm:px-4 py-1.5 capitalize text-xs font-semibold cursor-pointer transition-all duration-150 ${
                filter === tab
                  ? isAdmin
                    ? "bg-amber-400 text-slate-950 shadow-xs"
                    : "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap shrink-0">
          {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* Report Feed Cards - 2 Columns on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <Link
            key={item.id}
            to={`/record/${item.id}`}
            className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block"
          >
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold">
                <span className="text-indigo-600 uppercase tracking-wider">
                  {item.type}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-400 font-normal">
                  <Clock size={12} />
                  {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                <span className="truncate">{item.title}</span>
                <ArrowUpRight
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 shrink-0"
                />
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 font-normal">
                {item.description}
              </p>

              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 pt-1">
                <MapPin size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">
                  {item.location?.label || "Unspecified Location"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t pt-3 border-slate-100 shrink-0">
              <StatusBadge status={item.status} />

              {isAdmin ? (
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80 flex-wrap">
                  {["Pending", "In Progress", "Resolved"].map((st) => (
                    <button
                      key={st}
                      onClick={(e) => handleQuickStatusChange(e, item.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
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
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer active:scale-95"
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