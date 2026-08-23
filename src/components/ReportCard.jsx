import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { REPORT_TYPES } from "../data/mockReports";

function timeAgo(dateString) {
  const days = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 86400000,
  );
  if (days <= 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 24) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function ReportCard({ report }) {
  const isRedFlag = report.type === REPORT_TYPES.RED_FLAG;

  return (
    <Link
      to={`/records/${report.id}`}
      className="block rounded-2xl bg-cream-card p-4 shadow-sm ring-1 ring-black/5 transition hover:ring-black/10"
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className={`text-xs font-semibold tracking-wide ${
            isRedFlag ? "text-brand" : "text-intervention"
          }`}
        >
          {report.id}
        </span>
        <StatusBadge status={report.status} />
      </div>
      <h3 className="text-navy mb-2 text-sm font-semibold leading-snug">
        {report.title}
      </h3>
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>{report.location.label}</span>
        <span>{timeAgo(report.createdAt)}</span>
      </div>
    </Link>
  );
}
