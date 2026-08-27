import { useAuth } from "../context/AuthContext";
import {
  User,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Award,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiGetReports } from "../api";

export default function Profile() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [reports, setReports] = useState([]);

  useEffect(() => {
    apiGetReports().then(setReports).catch(() => setReports([]));
  }, []);

  const totalReports = reports.length;
  const resolvedReports = reports.filter((r) => r.status === "Resolved").length;
  const myReports = reports.filter((r) => r.userId === user?.id);
  const myTotalReports = myReports.length;
  const myImpactPoints = myReports.reduce((sum, r) => sum + (r.upvotes || 0), 0);

  if (isAdmin) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Official Profile
          </h1>
          <p className="text-xs text-slate-500">
            Municipal authority details and administrative metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Main Card */}
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-white shadow-md md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400">
                <Building2 size={28} />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {user?.name || "Official User"}
                </h2>
                <p className="text-xs font-medium text-amber-400">
                  Municipal Official ID: #GOV-4821
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 text-center">
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-4">
                <p className="text-2xl font-bold text-white">{totalReports}</p>
                <p className="text-[10px] font-semibold uppercase text-slate-400">
                  Managed Reports
                </p>
              </div>
              <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-4">
                <p className="text-2xl font-bold text-emerald-400">
                  {resolvedReports}
                </p>
                <p className="text-[10px] font-semibold uppercase text-slate-400">
                  Resolved Cases
                </p>
              </div>
            </div>
          </div>

          {/* Scope Panel */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 md:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Official Access Scope
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <ShieldCheck size={16} className="shrink-0 text-amber-600" />
                <span>Status Modification Clearance</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0 text-amber-600" />
                <span>Municipal Triage Rights</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          User Profile
        </h1>
        <p className="text-xs text-slate-500">
          Community participation stats and earned achievement badges.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main Card */}
        <div className="space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-slate-900 shadow-xs md:col-span-2">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {user?.name || "Citizen User"}
              </h2>
              <p className="text-xs font-medium text-indigo-600">
                Active Community Citizen
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-indigo-100 pt-4 text-center">
            <div className="rounded-xl border border-indigo-100 bg-white p-4">
              <p className="text-2xl font-bold text-slate-900">{myTotalReports}</p>
              <p className="text-[10px] font-semibold uppercase text-slate-500">
                Submitted Issues
              </p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-white p-4">
              <p className="text-2xl font-bold text-indigo-600">{myImpactPoints}</p>
              <p className="text-[10px] font-semibold uppercase text-slate-500">
                Community Impact Points
              </p>
            </div>
          </div>
        </div>

        {/* Badges Panel */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 md:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Citizen Badges
          </h3>
          <div className="flex flex-col gap-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 font-semibold text-emerald-700">
              <Award size={16} />
              <span>Local Watchdog</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 font-semibold text-blue-700">
              <FileText size={16} />
              <span>Reporter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
