import React, { useState, useEffect } from "react";
import {
  User,
  Music,
  Calendar,
  FileText,
  CreditCard,
  LogOut,
  Settings,
  BarChart,
  Home,
} from "lucide-react";
import { supabase } from "../../supabase/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Profile from "./components/Profile/Profile";
import Concerts from "./components/Conciertos/Conciertos";
import ChoirInfo from "./components/info/ChoirInfo";
import HomeComponent from "./components/Inico/Inicio";
import Payments from "./components/pago/Pagos";
import Members from "./components/Members/Members";
import Repertoire from "./components/Repertoire/Repertoire";

function MemberDashboard({ user: initialUser }) {
  const { t } = useTranslation();
  const [user, setUser] = useState(initialUser || null);
  const [loading, setLoading] = useState(!initialUser);
  const [activeSection, setActiveSection] = useState("inicio");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (initialUser) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user;
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id, username, role, choir_id")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.error("Failed to load user metadata:", error.message);
        return;
      }

      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [initialUser, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navItems = [
    { title: t("memberDashboard.nav.home"), id: "inicio", icon: Home, roles: ["member", "director", "admin"] },
    { title: t("memberDashboard.nav.profile"), id: "perfil", icon: User, roles: ["member", "director", "admin"] },
    { title: t("memberDashboard.nav.choirInfo"), id: "info", icon: Music, roles: ["member", "director", "admin"] },
    { title: t("memberDashboard.nav.concerts"), id: "conciertos", icon: Calendar, roles: ["member", "director", "admin"] },
    { title: t("memberDashboard.nav.repertoire"), id: "repertorio", icon: FileText, roles: ["member", "director", "admin"] },
    { title: t("memberDashboard.nav.payments"), id: "pagos", icon: CreditCard, roles: ["member", "director", "admin"] },
    { title: t("memberDashboard.nav.statistics"), id: "estadisticas", icon: BarChart, roles: ["admin"] },
    { title: t("memberDashboard.nav.settings"), id: "configuracion", icon: Settings, roles: ["admin"] },
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user?.role));

  const SectionContent = () => {
    switch (activeSection) {
      case "inicio":
        return <HomeComponent />;
      case "perfil":
        return <Profile />;
      case "info":
        return <ChoirInfo />;
      case "conciertos":
        return <Concerts />;
      case "repertorio":
        return <Repertoire isAdmin={false} />;
      case "pagos":
        return <Payments />;
      default:
        return <Concerts />;
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        {t("memberDashboard.loading")}
      </div>
    );
  }

  return (
    <div className="flex h-screen text-white">
      {/* Sidebar */}
      <aside className="bg-gradient-to-b from-red-700 via-orange-600 to-red-800 flex flex-col w-16 md:w-64 transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 md:px-6 font-bold text-xl border-b border-red-900">
          <span className="hidden md:inline">{t("memberDashboard.brand")}</span>
          <span className="md:hidden text-lg">C</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 md:px-4 py-4">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center md:justify-start justify-center gap-3 w-full px-3 py-2 rounded-lg mb-1 text-left transition-colors ${
                  isActive
                    ? "bg-red-800 text-orange-400 font-semibold"
                    : "text-orange-200 hover:bg-red-700 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden md:inline">{item.title}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-red-900 p-3 md:p-4 flex items-center gap-3">
          <div className="flex-shrink-0 rounded-full bg-orange-400 w-10 h-10 flex items-center justify-center text-red-900 font-bold text-lg">
            {user.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden md:flex flex-col overflow-hidden">
            <span className="truncate font-semibold">{user.username}</span>
            <span className="truncate text-sm text-orange-200">{user.role}</span>
          </div>
          <button
            onClick={handleSignOut}
            aria-label={t("memberDashboard.logout")}
            className="ml-auto p-2 rounded hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5 text-orange-300" />
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6 overflow-auto bg-white text-gray-800">
        <SectionContent />
      </main>
    </div>
  );
}

export default MemberDashboard;
