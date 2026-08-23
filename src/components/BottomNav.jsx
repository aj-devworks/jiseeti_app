import { NavLink, useLocation } from "react-router-dom";
import { Home, Map, Bell, PlusCircle, User, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  if (["/login", "/signup"].includes(location.pathname)) return null;

  const navItems = [
    { to: "/home", label: "Feed", icon: Home },
    { to: "/map", label: "Map", icon: Map },
    isAdmin
      ? { to: "/admin", label: "Moderation", icon: ShieldCheck }
      : { to: "/create", label: "Report", icon: PlusCircle },
    { to: "/alerts", label: "Alerts", icon: Bell },
    { to: "/profile", label: "Profile", icon: User },
  ];

  const containerTheme = isAdmin
    ? "bg-slate-950/90 border-slate-800 text-slate-400 shadow-slate-950/20"
    : "bg-white/90 border-slate-200/90 text-slate-500 shadow-slate-200/50";

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-30 px-4">
      <div
        className={`mx-auto max-w-sm rounded-2xl border backdrop-blur-lg px-3 py-2 shadow-xl transition-all duration-300 ${containerTheme}`}
      >
        <div className="flex items-center justify-around">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex flex-col items-center px-2 py-1 text-[10px] font-semibold transition-all duration-200 ${
                  isActive
                    ? isAdmin
                      ? "scale-105 font-bold text-amber-400"
                      : "scale-105 font-bold text-indigo-600"
                    : "hover:text-slate-900 dark:hover:text-slate-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className="mb-0.5 shrink-0" />
                  <span className="leading-none">{label}</span>
                  {isActive && (
                    <span
                      className={`absolute -bottom-1 h-1 w-1 rounded-full transition-all ${
                        isAdmin ? "bg-amber-400" : "bg-indigo-600"
                      }`}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
