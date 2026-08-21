import { NavLink, useLocation } from "react-router-dom";
import { Home, Map, Bell, PlusCircle, User, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Hide BottomNav on Login & Signup pages
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

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-30 px-4">
      <div
        className={`mx-auto max-w-sm rounded-2xl border backdrop-blur-lg px-3 py-2 shadow-xl transition-colors ${
          isAdmin
            ? "bg-slate-950/90 border-slate-800 text-slate-400"
            : "bg-white/90 border-slate-200/90 text-slate-500"
        }`}
      >
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-all duration-200 ${
                    isActive
                      ? isAdmin
                        ? "text-amber-400 font-bold scale-105"
                        : "text-indigo-600 font-bold scale-105"
                      : "hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className="mb-0.5" />
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        className={`absolute -bottom-1 h-1 w-1 rounded-full ${
                          isAdmin ? "bg-amber-400" : "bg-indigo-600"
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}