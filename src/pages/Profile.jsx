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
    /* GOVERNMENT OFFICIAL PROFILE */
    return (
      <div className="mx-auto max-w-md space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-base font-bold">{user?.name}</h1>
              <p className="text-xs text-amber-400 font-medium">
                Municipal Official ID: #GOV-4821
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
              <p className="text-lg font-bold text-white">{totalReports}</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">
                Managed Reports
              </p>
            </div>
            <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/50">
              <p className="text-lg font-bold text-emerald-400">
                {resolvedReports}
              </p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">
                Resolved Cases
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
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

  /* CITIZEN PROFILE */
  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-base font-bold">{user?.name}</h1>
            <p className="text-xs text-indigo-600 font-medium">
              Active Community Citizen
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-indigo-100 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl bg-white p-3 border border-indigo-100">
            <p className="text-lg font-bold text-slate-900">3</p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">
              Submitted Issues
            </p>
          </div>
          <div className="rounded-xl bg-white p-3 border border-indigo-100">
            <p className="text-lg font-bold text-indigo-600">22</p>
            <p className="text-[10px] text-slate-500 uppercase font-semibold">
              Community Impact Points
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Citizen Badges
        </h2>
        <div className="flex items-center gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-700 px-3 py-1.5 border border-emerald-200 font-semibold">
            <Award size={14} /> Local Watchdog
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50 text-blue-700 px-3 py-1.5 border border-blue-200 font-semibold">
            <FileText size={14} /> Reporter
          </div>
        </div>
      </div>
    </div>
  );
}
