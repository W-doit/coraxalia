import React, { useEffect, useState } from "react";
import {
  LogOut,
  User,
  Music,
  Calendar,
  FileText,
  CreditCard,
  Settings,
  Users,
  BarChart,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/client";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

import Profile from "./components/Profile/Profile";
import Concerts from "./components/Conciertos/Conciertos";
import ChoirInfo from "./components/info/ChoirInfo";
import HomeComponent from "./components/Inico/Inicio";
import Payments from "./components/pago/Pagos";
import Members from "./components/Members/Members";
import Repertoire from "./components/Repertoire/Repertoire";
import SettingsComponent from "./components/Settings/SettingsComponent";
import Statistics from "./components/Statistics/Statistics";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeComponent, setActiveComponent] = useState("home");
  const [user, setUser] = useState(null);
  const [themeColor, setThemeColor] = useState("#f97316");
  const [logoUrl, setLogoUrl] = useState("");

  const navItems = [
    { title: t("adminDashboard.nav.home"), icon: <Home size={18} />, key: "home" },
    { title: t("adminDashboard.nav.profile"), icon: <User size={18} />, key: "profile" },
    { title: t("adminDashboard.nav.choirInfo"), icon: <Music size={18} />, key: "info" },
    { title: t("adminDashboard.nav.concerts"), icon: <Calendar size={18} />, key: "concerts" },
    { title: t("adminDashboard.nav.repertoire"), icon: <FileText size={18} />, key: "repertoire" },
    { title: t("adminDashboard.nav.payments"), icon: <CreditCard size={18} />, key: "payments" },
    { title: t("adminDashboard.nav.members"), icon: <Users size={18} />, key: "members" },
    { title: t("adminDashboard.nav.statistics"), icon: <BarChart size={18} />, key: "stats" },
    { title: t("adminDashboard.nav.settings"), icon: <Settings size={18} />, key: "settings" },
  ];

  /** ---------------------------
   * Fetch logo for this user
   ---------------------------- */
  const fetchLogo = async (userId) => {
    const { data, error } = await supabase
      .from("configuration")
      .select("logo_url")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.warn("No config found, will be created later");
      return;
    }

    setLogoUrl(data?.logo_url || "");
  };

  /** ---------------------------
   * Load user + config on mount
   ---------------------------- */
  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const loggedUser = auth?.user;

      if (!loggedUser) return navigate("/login");

      // Fetch user info
    const { data: userData } = await supabase
      .from("users")
      .select("id, username, role")   // <-- ADD id
      .eq("id", loggedUser.id)
      .single();

      setUser(userData);


      // Fetch configuration for this user
      let { data: config } = await supabase
        .from("configuration")
        .select("*")
        .eq("user_id", loggedUser.id)
        .single();

      // If no config row exists → create one
      if (!config) {
        const { data: newConfig } = await supabase
          .from("configuration")
          .insert([
            {
              user_id: loggedUser.id,
              theme_color: "#f97316",
              logo_url: ""
            }
          ])
          .select()
          .single();

        config = newConfig;
      }

      setThemeColor(config.theme_color);
      localStorage.setItem("theme_color", config.theme_color);

      setLogoUrl(config.logo_url || "");
    };

    load();

    window.addEventListener("config-updated", () => load());
    return () => window.removeEventListener("config-updated", () => load());
  }, []);

  /** ---------------------------
   * Real-time updates
   ---------------------------- */
  useEffect(() => {
    const setupSubscription = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const loggedUser = auth?.user;
      if (!loggedUser) return;

      const channel = supabase
        .channel("configuration-watch")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "configuration",
            filter: `user_id=eq.${loggedUser.id}`,
          },
          (payload) => {
            const color = payload.new?.theme_color;
            const newLogo = payload.new?.logo_url;

            if (color) {
              setThemeColor(color);
              localStorage.setItem("theme_color", color);
            }
            if (newLogo !== undefined) {
              setLogoUrl(newLogo);
            }
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    setupSubscription();
  }, []);

  /** ---------------------------
   * Logout
   ---------------------------- */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    Swal.fire({ icon: "success", title: t("adminDashboard.logoutSuccess"), timer: 1500 });
    navigate("/");
  };

  const sidebarStyle = {
    background: `linear-gradient(to bottom, ${themeColor}, ${themeColor}cc)`,
    transition: "background 0.5s ease",
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "home": return <HomeComponent />;
      case "profile": return <Profile />;
      case "info": return <ChoirInfo />;
      case "concerts": return <Concerts />;
      case "repertoire": return <Repertoire isAdmin={true} />;
      case "payments": return <Payments />;
      case "members": return <Members />;
      case "stats": return <Statistics />;
      case "settings": return <SettingsComponent user={user} setThemeColor={setThemeColor} />;
      default: return <div>{t("adminDashboard.components.notFound")}</div>;
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div
        className="text-white flex flex-col justify-between fixed h-full z-10 w-16 md:w-64 transition-all duration-300"
        style={sidebarStyle}
      >
        <div>
          <div className="hidden md:block text-2xl font-bold px-6 py-4 border-b border-white/20">
            {t("adminDashboard.title")}
          </div>

          {user && (
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/20">
              <div className="rounded-full bg-white/30 w-10 h-10 flex items-center justify-center">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-10 h-10 object-contain rounded-full bg-white p-1"
                  />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {user.username?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="hidden md:flex flex-col overflow-hidden">
                <span className="truncate font-semibold">{user.username}</span>
                <span className="truncate text-sm text-white/70">{user.role}</span>
              </div>
            </div>
          )}

          <nav className="py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveComponent(item.key)}
                className={`w-full flex items-center md:justify-start justify-center gap-2 px-4 py-2 rounded-lg hover:bg-white/20 transition ${
                  activeComponent === item.key ? "bg-white/30" : ""
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.title}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="px-4 py-3 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center md:justify-start justify-center gap-2 px-4 py-2 rounded-lg hover:bg-white/20 transition"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">{t("adminDashboard.logout")}</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6 ml-16 md:ml-64">
        {renderActiveComponent()}
      </div>
    </div>
  );
}
