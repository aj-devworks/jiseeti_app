import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, ShieldAlert, Building2 } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  if (["/login", "/signup"].includes(location.pathname)) return null;

  const headerTheme = isAdmin
    ? "bg-slate-950/90 border-slate-800 text-slate-100 shadow-xl shadow-slate-950/10"
    : "bg-white/80 border-slate-200/80 text-slate-900 shadow-xs";

  const brandBadgeTheme = isAdmin
    ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
    : "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30";

  const userBadgeTheme = isAdmin
    ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500/40"
    : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/80";

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-300 ${headerTheme}`}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link to="/home" className="group flex items-center gap-2.5">
          <div
            className={`rounded-xl p-2 transition-transform duration-200 group-hover:scale-105 ${brandBadgeTheme}`}
          >
            <ShieldAlert size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold leading-tight tracking-tight">
              JISETI
            </span>
            <span
              className={`text-[9px] font-bold uppercase tracking-widest ${
                isAdmin ? "text-amber-400" : "text-indigo-600"
              }`}
            >
              {isAdmin ? "Gov Official Console" : "Public Safety Portal"}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-xs">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 ${userBadgeTheme}`}
              >
                {isAdmin ? (
                  <Building2 size={13} className="text-amber-400" />
                ) : (
                  <User size={13} className="text-indigo-600" />
                )}
                <span className="text-xs font-semibold tracking-tight">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                title="Sign Out"
                className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50/50 hover:text-rose-500"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-indigo-600 px-3.5 py-1.5 font-semibold text-white shadow-xs transition hover:bg-indigo-700"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
