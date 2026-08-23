import { useAuth } from "../context/AuthContext";
import {
  User,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Award,
  FileText,
} from "lucide-react";
import { getReports } from "../data/mockReports";

export default function Profile() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const reports = getReports();

  const totalReports = reports.length;
  const resolvedReports = reports.filter((r) => r.status === "Resolved").length;

  if (isAdmin) {
    return (
      <div className="mx-auto max-w-md space-y-4">
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-base font-bold">{user?.name}</h1>
              <p className="text-xs font-medium text-amber-400">
                Municipal Official ID: #GOV-4821
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-center">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-lg font-bold text-white">{totalReports}</p>
              <p className="text-[10px] font-semibold uppercase text-slate-400">
                Managed Reports
              </p>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-3">
              <p className="text-lg font-bold text-emerald-400">
                {resolvedReports}
              </p>
              <p className="text-[10px] font-semibold uppercase text-slate-400">
                Resolved Cases
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Official Access Scope
          </h2>
          <div className="space-y-2 text-xs text-slate-600">
            <p className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-amber-600" /> Status
              Modification Clearance
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-amber-600" /> Municipal
              Triage Rights
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-slate-900 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-base font-bold">{user?.name}</h1>
            <p className="text-xs font-medium text-indigo-600">
              Active Community Citizen
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-indigo-100 pt-3 text-center">
          <div className="rounded-xl border border-indigo-100 bg-white p-3">
            <p className="text-lg font-bold text-slate-900">3</p>
            <p className="text-[10px] font-semibold uppercase text-slate-500">
              Submitted Issues
            </p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-white p-3">
            <p className="text-lg font-bold text-indigo-600">22</p>
            <p className="text-[10px] font-semibold uppercase text-slate-500">
              Community Impact Points
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Citizen Badges
        </h2>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
            <Award size={14} /> Local Watchdog
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 font-semibold text-blue-700">
            <FileText size={14} /> Reporter
          </div>
        </div>
      </div>
    </div>
  );
}
