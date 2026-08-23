export default function StatusBadge({ status = "Pending" }) {
  const normalized = status.toLowerCase();

  const STATUS_STYLES = {
    resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "in progress": "bg-amber-50 text-amber-700 border-amber-200",
  };

  const badgeStyles =
    STATUS_STYLES[normalized] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-block shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${badgeStyles}`}
    >
      {status}
    </span>
  );
}
