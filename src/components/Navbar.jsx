import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, ShieldAlert, Building2 } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  // Hide Navbar on Login & Signup pages
  if (["/login", "/signup"].includes(location.pathname)) return null;

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-300 ${
        isAdmin
          ? "bg-slate-950/90 border-slate-800 text-slate-100 shadow-xl shadow-slate-950/10"
          : "bg-white/80 border-slate-200/80 text-slate-900 shadow-xs"
      }`}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link to="/home" className="flex items-center gap-2.5 group">
          <div
            className={`p-2 rounded-xl transition-transform duration-200 group-hover:scale-105 ${
              isAdmin
                ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                : "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
            }`}
          >
            <ShieldAlert size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-sm leading-tight">
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  isAdmin
                    ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-500/40"
                    : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/80"
                }`}
              >
                {isAdmin ? (
                  <Building2 size={13} className="text-amber-400" />
                ) : (
                  <User size={13} className="text-indigo-600" />
                )}
                <span className="font-semibold text-xs tracking-tight">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 transition-colors cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-xs hover:bg-indigo-700 transition"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}