import React, { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/client";
import { CalendarDays, Music, Users as UsersIcon } from "lucide-react";

export default function Inicio() {
  const [nextRehearsal, setNextRehearsal] = useState(null);
  const [nextConcert, setNextConcert] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      const { data: session } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;

      const { data: profile } = await supabase
        .from("users").select("choir_id").eq("id", user.id).single();

      const choirId = profile?.choir_id;

      const [{ data: r }, { data: c }, { count }] = await Promise.all([
        supabase.from("rehearsals").select("*").eq("choir_id", choirId).order("date", { ascending: true }).limit(1),
        supabase.from("concerts").select("*").eq("choir_id", choirId).order("date", { ascending: true }).limit(1),
        supabase.from("choir_members").select("user_id", { count: "exact" }).eq("choir_id", choirId)
      ]);

      setNextRehearsal(r?.[0] ?? null);
      setNextConcert(c?.[0] ?? null);
      setMemberCount(count || 0);

      const { data: ann } = await supabase
        .from("announcements").select("*").eq("choir_id", choirId).order("created_at", { ascending: false }).limit(5);
      setAnnouncements(ann || []);

      const eventsList = [];
      if (r?.[0]) eventsList.push({ type: "rehearsal", ...r[0] });
      if (c?.[0]) eventsList.push({ type: "concert", date: c[0].date, ...c[0] });
      setEvents(eventsList);
    }

    load();
  }, []);

  const timeDifference = date => {
    const diff = new Date(date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `En ${days} día${days > 1 ? "s" : ""}` : "Hoy";
  };

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 bg-white text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">Bienvenido a Coraxalia</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-sm">Próximo Ensayo</span>
            <CalendarDays className="h-5 w-5 text-gray-500" />
          </div>
          {nextRehearsal ? (
            <>
              <div className="text-2xl font-bold">{new Date(nextRehearsal.date).toLocaleTimeString("es-ES", { weekday:'long', hour:'2-digit', minute:'2-digit'})}</div>
              <p className="text-xs text-gray-600">{nextRehearsal.location}</p>
            </>
          ) : <p className="text-sm text-gray-600">Sin registros.</p>}
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-sm">Próximo Concierto</span>
            <Music className="h-5 w-5 text-gray-500" />
          </div>
          {nextConcert ? (
            <>
              <div className="text-2xl font-bold">{new Date(nextConcert.date).toLocaleDateString("es-ES")}</div>
              <p className="text-xs text-gray-600">{nextConcert.location}</p>
            </>
          ) : <p className="text-sm text-gray-600">Sin registros.</p>}
        </div>

        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-sm">Miembros Activos</span>
            <UsersIcon className="h-5 w-5 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">{memberCount}</div>
          <p className="text-xs text-gray-600">Distribución por cuerda (aprox.)</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
        <div className="col-span-4">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Anuncios Recientes</h3>
            <div className="space-y-4">
              {announcements.map(a => (
                <div key={a.id} className="border-b pb-3">
                  <h4 className="font-medium">{a.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{a.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(a.created_at).toLocaleDateString("es-ES", {relative:'true'})}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-2">Próximos Eventos</h3>
            <div className="space-y-3">
              {events.map((evt, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${evt.type === "rehearsal" ? "bg-blue-500" : "bg-green-500"} mr-2`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {evt.type === "rehearsal" ? "Ensayo Regular" : "Concierto"}
                    </p>
                    <p className="text-xs text-gray-600">
                      {evt.type === "rehearsal"
                        ? `${new Date(evt.date).toLocaleTimeString("es-ES", { weekday:'long', hour:'2-digit', minute:'2-digit'})}`
                        : `${new Date(evt.date).toLocaleDateString("es-ES")}`}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">{timeDifference(evt.date)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
