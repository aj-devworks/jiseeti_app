import { Bell, Info } from "lucide-react";

export default function Alerts() {
  const alerts = [
    {
      id: 1,
      title: "Scheduled Water Maintenance",
      body: "Central Ward water shutdown on Friday 8:00 AM - 12:00 PM.",
      time: "1 hour ago",
    },
    {
      id: 2,
      title: "Road Closure Notice",
      body: "Main Avenue lane restriction active due to repairs.",
      time: "1 day ago",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-base font-bold text-slate-900">Municipal Alerts</h1>
        <p className="text-xs text-slate-500">Official public advisories</p>
      </div>

      <div className="space-y-3">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-1"
          >
            <div className="flex items-center justify-between text-indigo-600">
              <span className="flex items-center gap-1.5 text-xs font-bold">
                <Bell size={14} />
                {a.title}
              </span>
              <span className="text-[10px] text-slate-400">{a.time}</span>
            </div>
            <p className="text-xs text-slate-600">{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}