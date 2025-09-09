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

// Import your actual components
import Profile from "./components/Profile/Profile";
import Concerts from "./components/Conciertos/Conciertos"
import ChoirInfo from "./components/info/ChoirInfo";
import HomeComponent from "./components/Inico/Inicio"
import Payments from "./components/pago/Pagos"
import Members from "./components/Members/Members"
import Repertoire from "./components/Repertoire/Repertoire"


const Statistics = () => <div>Statistics Component</div>;
const SettingsComponent = () => <div>Settings Component</div>;

const navItems = [
  { title: "Home", icon: <Home size={18} />, key: "home" },
  { title: "Profile", icon: <User size={18} />, key: "profile" },
  { title: "Choir Info", icon: <Music size={18} />, key: "info" },
  { title: "Concerts", icon: <Calendar size={18} />, key: "concerts" },
  { title: "Repertoire", icon: <FileText size={18} />, key: "repertoire" },
  { title: "Payments", icon: <CreditCard size={18} />, key: "payments" },
  { title: "Members", icon: <Users size={18} />, key: "members" },
  { title: "Statistics", icon: <BarChart size={18} />, key: "stats" },
  { title: "Settings", icon: <Settings size={18} />, key: "settings" },
];

const AdminDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("home");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        navigate("/login");
      } else {
        const { data, error: userError } = await supabase
          .from("users")
          .select("username, role")
          .eq("id", user.id)
          .single();

        if (userError) {
          console.error("Failed to load user metadata:", userError.message);
          setUser({ username: "Unknown", role: "Unknown" });
        } else {
          setUser({ ...data });
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    Swal.fire({ icon: "success", title: "Logged out successfully", timer: 1500 });
    navigate("/");
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "home":
        return <HomeComponent />;
      case "profile":
        return <Profile />;
      case "info":
        return <ChoirInfo />;
      case "concerts":
        return <Concerts />;
      case "repertoire":
        return <Repertoire />;
      case "payments":
        return <Payments />;
      case "members":
        return <Members />;
      case "stats":
        return <Statistics />;
      case "settings":
        return <SettingsComponent />;
      default:
        return <div>Component not found</div>;
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="bg-gradient-to-b from-red-600 to-orange-500 text-white flex flex-col justify-between fixed h-full z-10 w-16 md:w-64 transition-all duration-300">
        <div>
          {/* Admin Title */}
          <div className="hidden md:block text-2xl font-bold px-6 py-4 border-b border-orange-200">
            Admin Panel
          </div>

          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 px-4 py-4 border-b border-orange-300">
              <div className="flex-shrink-0 rounded-full bg-orange-400 w-10 h-10 flex items-center justify-center text-red-900 font-bold text-lg">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col overflow-hidden">
                <span className="truncate font-semibold">{user.username}</span>
                <span className="truncate text-sm text-orange-200">{user.role}</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveComponent(item.key)}
                className={`w-full flex items-center md:justify-start justify-center gap-2 px-4 py-2 rounded-lg hover:bg-orange-400 transition ${
                  activeComponent === item.key ? "bg-orange-400" : ""
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="px-4 py-3 border-t border-orange-300">
          <button
            onClick={handleLogout}
            className="w-full flex items-center md:justify-start justify-center gap-2 px-4 py-2 rounded-lg hover:bg-orange-400 transition"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6 ml-16 md:ml-64">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
