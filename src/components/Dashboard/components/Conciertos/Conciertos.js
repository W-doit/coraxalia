import React, { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  Calendar,
  MapPin,
  Music,
  Users,
  XCircle,
  PlusCircle,
} from "lucide-react";

export default function Conciertos() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [concerts, setConcerts] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Form states for new concert
  const [newConcert, setNewConcert] = useState({
    title: "",
    description: "",
    venue: "",
    address: "",
    repertoire: "",
  });
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch concerts
  const fetchConcerts = async () => {
    const { data, error } = await supabase
      .from("concerts")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) console.error("Error fetching concerts:", error);
    else setConcerts(data || []);
  };

  // ✅ Fetch attendance for logged-in user
  const fetchUserAttendance = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("concert_attendance")
      .select("concert_id, attending")
      .eq("user_id", user.id);

    if (!error && data) {
      const map = {};
      data.forEach((a) => {
        map[a.concert_id] = a.attending;
      });
      setAttendance(map);
    }
  };

  // ✅ Check if current user is admin (from users table)
  const checkAdmin = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id) // assumes your users table `id` matches auth.user.id
      .single();

    if (!error && data?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    fetchConcerts();
    fetchUserAttendance();
    checkAdmin();
  }, [user]);

  // ✅ Handle attendance (yes/no)
const handleAttendance = async (concertId, attending) => {
  if (!user) return;

  const { error } = await supabase
    .from("concert_attendance")
    .upsert(
      [
        { concert_id: concertId, user_id: user.id, attending }
      ],
      { onConflict: "concert_id,user_id" } // ✅ FIXED
    );

  if (error) {
    console.error("Error saving attendance:", error);
  } else {
    setAttendance((prev) => ({ ...prev, [concertId]: attending }));
  }
};

  // ✅ Cancel a concert (admin only)
  const cancelConcert = async (concertId) => {
    await supabase
      .from("concerts")
      .update({ is_cancelled: true })
      .eq("id", concertId);
    fetchConcerts();
  };

  // ✅ Create a new concert
  const createConcert = async (e) => {
    e.preventDefault();
    const repertoireArray = newConcert.repertoire
      ? newConcert.repertoire.split(",").map((r) => r.trim())
      : [];
    const { error } = await supabase.from("concerts").insert([
      {
        title: newConcert.title,
        description: newConcert.description,
        venue: newConcert.venue,
        address: newConcert.address,
        repertoire: JSON.stringify(repertoireArray),
        is_cancelled: false,
      },
    ]);
    if (!error) {
      setNewConcert({
        title: "",
        description: "",
        venue: "",
        address: "",
        repertoire: "",
      });
      setShowForm(false);
      fetchConcerts();
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Conciertos</h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center py-2 px-4 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            {showForm ? "Cerrar formulario" : "Crear concierto"}
          </button>
        )}
      </div>

      {/* Admin create form */}
      {isAdmin && showForm && (
        <form
          onSubmit={createConcert}
          className="border rounded-lg shadow-sm p-6 bg-white dark:bg-gray-800 space-y-4"
        >
          <h3 className="text-xl font-semibold mb-2">Nuevo Concierto</h3>
          <input
            type="text"
            placeholder="Título"
            value={newConcert.title}
            onChange={(e) =>
              setNewConcert({ ...newConcert, title: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            placeholder="Descripción"
            value={newConcert.description}
            onChange={(e) =>
              setNewConcert({ ...newConcert, description: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Lugar"
            value={newConcert.venue}
            onChange={(e) =>
              setNewConcert({ ...newConcert, venue: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={newConcert.address}
            onChange={(e) =>
              setNewConcert({ ...newConcert, address: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Repertorio (separa con comas)"
            value={newConcert.repertoire}
            onChange={(e) =>
              setNewConcert({ ...newConcert, repertoire: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="py-2 px-4 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Guardar concierto
          </button>
        </form>
      )}

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-2 px-4 -mb-px border-b-2 font-medium ${
              activeTab === "upcoming"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Próximos
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`py-2 px-4 -mb-px border-b-2 font-medium ${
              activeTab === "past"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Pasados
          </button>
        </div>

        {/* Upcoming */}
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {concerts
              .filter((c) => !c.is_cancelled)
              .map((concert) => {
                let repertoire = [];
                try {
                  repertoire = Array.isArray(concert.repertoire)
                    ? concert.repertoire
                    : JSON.parse(concert.repertoire || "[]");
                } catch (e) {
                  repertoire = [];
                }

                return (
                  <div
                    key={concert.id}
                    className="border rounded-lg shadow-sm p-6 bg-white dark:bg-gray-800"
                  >
                    <header className="mb-4">
                      <h3 className="text-xl font-semibold">{concert.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {concert.description}
                      </p>
                    </header>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Info */}
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <Calendar className="h-5 w-5 mr-2" />
                          <span>
                            {new Date(concert.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                          <MapPin className="h-5 w-5 mr-2" />
                          <div>
                            <div>{concert.venue}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {concert.address}
                            </div>
                          </div>
                        </div>
                        {repertoire.length > 0 && (
                          <div className="flex items-start text-gray-700 dark:text-gray-300">
                            <Music className="h-5 w-5 mr-2 mt-1" />
                            <div>
                              <div className="font-medium">Repertorio:</div>
                              <ul className="list-disc list-inside text-sm">
                                {repertoire.map((piece, idx) => (
                                  <li key={idx}>{piece}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col justify-between">
                        {!isAdmin && (
                          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold mb-2">
                              ¿Puedes asistir a este concierto?
                            </h4>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleAttendance(concert.id, true)
                                }
                                className={`py-2 px-4 rounded ${
                                  attendance[concert.id] === true
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-white border border-green-600 text-green-600 hover:bg-green-100"
                                }`}
                              >
                                Sí, puedo asistir
                              </button>
                              <button
                                onClick={() =>
                                  handleAttendance(concert.id, false)
                                }
                                className={`py-2 px-4 rounded ${
                                  attendance[concert.id] === false
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-white border border-red-600 text-red-600 hover:bg-red-100"
                                }`}
                              >
                                No puedo asistir
                              </button>
                            </div>
                          </div>
                        )}

                        {attendance[concert.id] !== undefined && !isAdmin && (
                          <div
                            className={`p-4 rounded-lg ${
                              attendance[concert.id]
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            <p className="font-medium">
                              {attendance[concert.id]
                                ? "Has confirmado tu asistencia."
                                : "Has indicado que no puedes asistir."}
                            </p>
                          </div>
                        )}

                        {isAdmin && (
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => cancelConcert(concert.id)}
                              className="flex items-center justify-center py-2 px-4 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                              <XCircle className="h-5 w-5 mr-2" />
                              Cancelar concierto
                            </button>
                            <div className="flex items-center text-gray-700 dark:text-gray-300 mt-2">
                              <Users className="h-5 w-5 mr-2" />
                              <span>
                                Asistentes confirmados:{" "}
                                <AttendanceCounter
                                  concertId={concert.id}
                                  supabase={supabase}
                                />
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Past */}
        {activeTab === "past" && (
          <div>
            {concerts.map((concert) => (
              <div
                key={concert.id}
                className="border rounded-lg shadow-sm p-6 bg-white dark:bg-gray-800 mb-4"
              >
                <header className="mb-2">
                  <h3 className="text-xl font-semibold">{concert.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {new Date(concert.created_at).toLocaleDateString()}
                  </p>
                </header>
                <p>{concert.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Attendance counter (admin only)
function AttendanceCounter({ concertId, supabase }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("concert_attendance")
        .select("*", { count: "exact", head: true })
        .eq("concert_id", concertId)
        .eq("attending", true);
      setCount(count || 0);
    };
    fetchCount();
  }, [concertId, supabase]);

  return <strong>{count}</strong>;
}
