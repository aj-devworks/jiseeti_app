export default function StatusBadge({ status = "Pending" }) {
  const normalized = status.toLowerCase();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";
  if (normalized === "resolved") {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (normalized === "in progress") {
    styles = "bg-amber-50 text-amber-700 border-amber-200";
  }

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold border shrink-0 ${styles}`}
    >
      {status}
    </span>
  );
}