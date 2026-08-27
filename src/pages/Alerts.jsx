import { useEffect, useState } from "react";
import { Bell, Plus, X } from "lucide-react";
import { apiGetAlerts, apiCreateAlert } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Alerts() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiGetAlerts()
      .then(setAlerts)
      .catch((err) => setError(err.message || "Could not load alerts."));
  }, []);

  async function handleCreateAlert(e) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setIsSubmitting(true);
    setError("");
    try {
      const newAlert = await apiCreateAlert({ title, message });
      setAlerts((prev) => [newAlert, ...prev]);
      setTitle("");
      setMessage("");
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Could not create alert.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-sm font-bold text-slate-900 sm:text-base">
            Municipal Alerts
          </h1>
          <p className="text-xs text-slate-500">Official public advisories</p>
        </div>

        {isAdmin && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
          >
            <Plus size={14} />
            <span>New Alert</span>
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <form
          onSubmit={handleCreateAlert}
          className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900">Post New Alert</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="cursor-pointer text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scheduled Water Maintenance"
              className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
              Message
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Details for the public..."
              className="w-full resize-none rounded-lg border border-slate-200 p-2.5 text-xs focus:border-indigo-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? "Posting..." : "Post Alert"}
          </button>
        </form>
      )}

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-center text-xs font-medium text-rose-600">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="space-y-1 rounded-xl border border-slate-200 bg-white p-3 shadow-xs sm:p-4"
          >
            <div className="flex items-center justify-between gap-2 text-indigo-600">
              <span className="flex min-w-0 items-center gap-1.5 text-xs font-bold">
                <Bell size={14} className="shrink-0" />
                <span className="truncate">{a.title}</span>
              </span>
              <span className="shrink-0 text-[10px] text-slate-400">
                {a.time}
              </span>
            </div>
            <p className="text-xs text-slate-600">{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
