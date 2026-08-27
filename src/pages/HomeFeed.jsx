import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Filter, Plus, MapPin, ThumbsUp } from "lucide-react";
import { apiGetReports } from "../api";
import StatusBadge from "../components/StatusBadge";

export default function HomeFeed() {
  const [filter, setFilter] = useState("All");
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    apiGetReports()
      .then((data) => {
        if (!cancelled) setReports(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load reports.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredReports = reports.filter((report) => {
    if (filter === "All") return true;
    return report.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner with Responsive Row/Col Layout */}
      <div className="flex flex-col gap-4 rounded-2xl bg-slate-900 p-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Live Municipal Network
          </span>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Community Reports Feed
          </h1>
          <p className="max-w-xl text-xs text-slate-300 leading-relaxed">
            Real-time community reporting platform. Submit local issues and
            upvote critical reports.
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
        >
          <Plus size={16} />
          <span>Submit Report</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={16} className="mr-1 text-slate-400" />
          {["All", "Pending", "In Progress", "Resolved"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition ${
                filter === tab
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <span className="text-xs font-medium text-slate-400">
          {filteredReports.length}{" "}
          {filteredReports.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-600">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="p-8 text-center text-xs text-slate-400">
          Loading reports...
        </div>
      )}

      {/* Responsive Grid Layout: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!isLoading && filteredReports.map((item) => (
          <Link
            key={item.id}
            to={`/record/${item.id}`}
            className="flex flex-col justify-between space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                <span>{item.type || "INTERVENTION"}</span>
                <span className="font-normal text-slate-400">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Aug 22"}
                </span>
              </div>
              <h3 className="line-clamp-1 text-sm font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-2">
              <div className="flex items-center gap-1 truncate text-[11px] text-slate-400">
                <MapPin size={13} className="shrink-0" />
                <span className="truncate">
                  {item.location?.label || "GPS Location"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <StatusBadge status={item.status} />
                <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  <ThumbsUp size={13} />
                  {item.upvotes || 0}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
