import React, { useEffect, useState, useCallback } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import {
  Calendar,
  MapPin,
  Music,
  Users,
  XCircle,
  PlusCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function Conciertos() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [concerts, setConcerts] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [activeTab, setActiveTab] = useState("upcoming");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAttendeesFor, setShowAttendeesFor] = useState(null);
  const [userChoirId, setUserChoirId] = useState(null);

  const [newConcert, setNewConcert] = useState({
    title: "",
    description: "",
    venue: "",
    address: "",
    repertoire: "",
  });
  const [showForm, setShowForm] = useState(false);

  /* --- MEDIA QUERY CONTROL --- */
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(max-width:640px)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width:640px)");
    const handler = (ev) => setIsSmallScreen(ev.matches);
    mq.addEventListener?.("change", handler) || mq.addListener(handler);
    return () =>
      mq.removeEventListener?.("change", handler) || mq.removeListener(handler);
  }, []);

  /* --- FETCH USER DATA (including choir_id) --- */
  const fetchUserData = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("choir_id, role")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setUserChoirId(data.choir_id);
      setIsAdmin(data.role === "admin");
    }
  }, [supabase, user]);

  /* --- FETCH CONCERTS (requires choir_id) --- */
  const fetchConcerts = useCallback(async () => {
    if (!userChoirId) return;

    const { data, error } = await supabase
      .from("concerts")
      .select("*")
      .eq("choir_id", userChoirId)
      .order("created_at", { ascending: true });

    if (error) console.error("Error fetching concerts:", error);
    else setConcerts(data || []);
  }, [supabase, userChoirId]);

  /* --- FETCH CURRENT USER ATTENDANCE --- */
  const fetchUserAttendance = useCallback(async () => {
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
  }, [supabase, user]);

  /* --- RUN LOADERS IN ORDER --- */
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (userChoirId) {
      fetchConcerts();
      fetchUserAttendance();
    }
  }, [userChoirId, fetchConcerts, fetchUserAttendance]);

  /* --- MEMBER ATTENDANCE HANDLER --- */
  const handleAttendance = async (concertId, attending) => {
    if (!user) return;

    const { error } = await supabase.from("concert_attendance").upsert(
      [
        {
          concert_id: concertId,
          user_id: user.id,
          attending,
          responded_at: new Date(),
        },
      ],
      { onConflict: "concert_id,user_id" }
    );

    if (!error) {
      setAttendance((prev) => ({ ...prev, [concertId]: attending }));
    } else {
      console.error("Error saving attendance:", error);
    }
  };

  /* --- ADMIN: CANCEL CONCERT --- */
  const cancelConcert = async (concertId) => {
    await supabase
      .from("concerts")
      .update({ is_cancelled: true })
      .eq("id", concertId);
    fetchConcerts();
  };

  /* --- ADMIN: CREATE CONCERT --- */
  const createConcert = async (e) => {
    e.preventDefault();
    if (!userChoirId) return;

    const repertoireArray = newConcert.repertoire
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    const { error } = await supabase.from("concerts").insert([
      {
        title: newConcert.title,
        description: newConcert.description,
        venue: newConcert.venue,
        address: newConcert.address,
        repertoire: JSON.stringify(repertoireArray),
        is_cancelled: false,
        choir_id: userChoirId,
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
    } else {
      console.error("Error creating concert:", error);
    }
  };

  /* --- ESCAPE HTML --- */
  const escapeHtml = (unsafe) =>
    String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  /* --- FETCH HTML TABLE (mobile modal) --- */
  const fetchAttendeesHtml = async (concertId) => {
    const { data, error } = await supabase
      .from("concert_attendance")
      .select(
        `
        id,
        attending,
        responded_at,
        user:attendance_user_rel (
          nombre, email, cuerda, fecha_nacimiento, localidad
        )
      `
      )
      .eq("concert_id", concertId)
      .eq("attending", true)
      .order("responded_at", { ascending: true });

    if (error) return "Error cargando asistentes";

    if (!data.length)
      return `<div class='text-center text-gray-600'>No hay asistentes confirmados aún.</div>`;

    const rows = data
      .map((a) => {
        const u = a.user || {};
        return `
        <tr>
          <td>${escapeHtml(u.nombre || "-")}</td>
          <td>${escapeHtml(u.email || "-")}</td>
          <td>${escapeHtml(u.cuerda || "-")}</td>
          <td>${
            u.fecha_nacimiento
              ? new Date(u.fecha_nacimiento).toLocaleDateString()
              : "-"
          }</td>
          <td>${escapeHtml(u.localidad || "-")}</td>
        </tr>`;
      })
      .join("");

    return `
      <div style="max-height:60vh; overflow:auto;">
        <table class="swal-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Cuerda</th>
              <th>Fecha</th>
              <th>Localidad</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  };

  /* --- TOGGLE ATTENDEES --- */
  const handleToggleAttendees = async (concertId) => {
    if (isSmallScreen) {
      const html = await fetchAttendeesHtml(concertId);
      Swal.fire({
        title: "Lista de asistentes",
        html,
        width: "95%",
        showCloseButton: true,
        showConfirmButton: false,
      });
    } else {
      setShowAttendeesFor((prev) => (prev === concertId ? null : concertId));
    }
  };

  /* ------------------------- UI -------------------------- */

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Conciertos</h2>

        {isAdmin && (
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="flex items-center py-2 px-4 bg-gray-800 text-white rounded"
          >
            <PlusCircle className="mr-2 " />
            {showForm ? "Cerrar formulario" : "Crear concierto"}
          </button>
        )}
      </div>

      {/* CREATE FORM */}
      {isAdmin && showForm && (
        <form
          onSubmit={createConcert}
          className="border rounded p-6 bg-white dark:bg-gray-800 space-y-4"
        >
          <h3 className="text-xl font-semibold">Nuevo Concierto</h3>

          <input
            type="text"
            placeholder="Título"
            value={newConcert.title}
            onChange={(e) =>
              setNewConcert({ ...newConcert, title: e.target.value })
            }
            required
            className="w-full border rounded px-3 py-2"
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
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Guardar concierto
          </button>
        </form>
      )}

      {/* TABS */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`py-2 px-4 ${
            activeTab === "upcoming"
              ? "border-b-2 border-blue-500 text-blue-600"
              : ""
          }`}
        >
          Próximos
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`py-2 px-4 ${
            activeTab === "past"
              ? "border-b-2 border-blue-500 text-blue-600"
              : ""
          }`}
        >
          Pasados
        </button>
      </div>

      {/* UPCOMING CONCERTS */}
      {activeTab === "upcoming" &&
        concerts
          .filter((c) => !c.is_cancelled)
          .map((concert) => (
            <div
              key={concert.id}
              className="border rounded p-6 bg-white dark:bg-gray-800"
            >
              <header className="mb-4">
                <h3 className="text-xl font-semibold">{concert.title}</h3>
                <p className="text-gray-600">{concert.description}</p>
              </header>

              <div className="grid md:grid-cols-2 gap-4">
                {/* INFO */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="mr-2" />
                    {new Date(concert.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center">
                    <MapPin className="mr-2" />
                    <div>
                      <div>{concert.venue}</div>
                      <div className="text-gray-500">{concert.address}</div>
                    </div>
                  </div>

                  {concert.repertoire && (
                    <div className="flex items-start">
                      <Music className="mr-2 mt-1" />
                      <div>
                        <strong>Repertorio:</strong>
                        <ul className="list-disc list-inside text-sm">
                          {JSON.parse(concert.repertoire).map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col justify-between">
                  {/* MEMBER ACTIONS */}
                  {!isAdmin && (
                    <div className="bg-gray-100 p-4 rounded">
                      <h4 className="font-semibold mb-2">
                        ¿Puedes asistir a este concierto?
                      </h4>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAttendance(concert.id, true)}
                          className={`px-4 py-2 rounded ${
                            attendance[concert.id]
                              ? "bg-green-600 text-white"
                              : "border border-green-600 text-green-600"
                          }`}
                        >
                          Sí
                        </button>

                        <button
                          onClick={() => handleAttendance(concert.id, false)}
                          className={`px-4 py-2 rounded ${
                            attendance[concert.id] === false
                              ? "bg-red-600 text-white"
                              : "border border-red-600 text-red-600"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ADMIN ACTIONS */}
                  {isAdmin && (
                    <div className="space-y-3">
                      <button
                        onClick={() => cancelConcert(concert.id)}
                        className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded"
                      >
                        <XCircle className="mr-2" />
                        Cancelar concierto
                      </button>

                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleToggleAttendees(concert.id)}
                      >
                        <Users className="mr-2" />
                        Asistentes:{" "}
                        <AttendanceCounter
                          concertId={concert.id}
                          supabase={supabase}
                        />
                      </div>

                      {!isSmallScreen &&
                        showAttendeesFor === concert.id && (
                          <AttendeeTable
                            concertId={concert.id}
                            supabase={supabase}
                          />
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
    </div>
  );
}

/* ---------------------------------------------------- */
/* ADMIN COUNTER */
function AttendanceCounter({ concertId, supabase }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { count } = await supabase
        .from("concert_attendance")
        .select("*", { count: "exact", head: true })
        .eq("concert_id", concertId)
        .eq("attending", true);

      setCount(count || 0);
    };
    load();
  }, [concertId, supabase]);

  return <strong>{count}</strong>;
}

/* ---------------------------------------------------- */
/* ADMIN TABLE */
function AttendeeTable({ concertId, supabase }) {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("concert_attendance")
        .select(
          `
        attending,
        user:attendance_user_rel (
          nombre, email, cuerda, fecha_nacimiento, localidad
        )
      `
        )
        .eq("concert_id", concertId)
        .eq("attending", true)
        .order("responded_at", { ascending: true });

      setAttendees(data || []);
    };
    load();
  }, [concertId, supabase]);

  return (
    <div className="mt-4 border rounded bg-gray-50 p-4">
      <h4 className="font-semibold mb-2">Lista de asistentes</h4>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Correo</th>
              <th className="px-3 py-2">Cuerda</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Localidad</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((a, idx) => {
              const u = a.user;
              return (
                <tr key={idx} className="border-b">
                  <td className="px-3 py-2">{u?.nombre || "-"}</td>
                  <td className="px-3 py-2">{u?.email || "-"}</td>
                  <td className="px-3 py-2">{u?.cuerda || "-"}</td>
                  <td className="px-3 py-2">
                    {u?.fecha_nacimiento
                      ? new Date(u.fecha_nacimiento).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-3 py-2">{u?.localidad || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
