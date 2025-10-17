import { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/client";
import { Pencil, Save, PlusCircle } from "lucide-react";

export default function ChoirInfo({ choirId: propChoirId }) {
  const [activeTab, setActiveTab] = useState("about");
  const [choirInfo, setChoirInfo] = useState(null);
  const [board, setBoard] = useState([]);
  const [userRole, setUserRole] = useState("member");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [choirId, setChoirId] = useState(propChoirId || null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error getting user:", userError);
        setLoading(false);
        return;
      }

      // 🔹 Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role, choir_id")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error loading profile:", profileError);
        setLoading(false);
        return;
      }

      setUserRole(profile?.role || "member");
      let effectiveChoirId = propChoirId || profile?.choir_id;

      // Optional fallback: if member has no choir, assign a default choir ID
      // (Replace 'default-choir-id' with your real choir UUID)
      // if (!effectiveChoirId) effectiveChoirId = "default-choir-id";

      setChoirId(effectiveChoirId);

      if (!effectiveChoirId) {
        console.warn("⚠️ User has no choir_id assigned.");
        setLoading(false);
        return;
      }

      // 🔹 Fetch choir info
      const { data: choir, error: choirError } = await supabase
        .from("choir_info")
        .select("*")
        .eq("choir_id", effectiveChoirId)
        .single();

      if (choirError && choirError.code !== "PGRST116") {
        console.error("Error fetching choir info:", choirError);
      }

      // 🔹 Fetch board
      const { data: boardData, error: boardError } = await supabase
        .from("choir_board")
        .select("*")
        .eq("choir_id", effectiveChoirId)
        .order("order_index");

      if (boardError) {
        console.error("Error fetching board:", boardError);
      }

      setChoirInfo(choir || null);
      setBoard(boardData || []);
      setLoading(false);
    };

    fetchData();
  }, [propChoirId]);

  // 🔹 Handle updates (only admin)
  const handleSave = async () => {
    if (userRole !== "admin" || !choirId) return;

    const { error } = await supabase
      .from("choir_info")
      .update({
        name: choirInfo.name,
        founded: choirInfo.founded,
        description: choirInfo.description,
        director_name: choirInfo.director_name,
        director_bio: choirInfo.director_bio,
        rehearsal_day: choirInfo.rehearsal_day,
        rehearsal_time: choirInfo.rehearsal_time,
        rehearsal_location: choirInfo.rehearsal_location,
        rehearsal_address: choirInfo.rehearsal_address,
      })
      .eq("choir_id", choirId);

    if (error) {
      console.error("Error saving choir info:", error);
    } else {
      setIsEditing(false);
    }
  };

  // 🔹 Create new choir info (for admins if none exists)
  const handleCreate = async () => {
    if (userRole !== "admin" || !choirId) return;

    const { error } = await supabase.from("choir_info").insert([
      {
        choir_id: choirId,
        name: "Nuevo Coro",
        founded: new Date().getFullYear().toString(),
        description: "Descripción del coro...",
        director_name: "Director/a",
        director_bio: "",
        rehearsal_day: "",
        rehearsal_time: "",
        rehearsal_location: "",
        rehearsal_address: "",
      },
    ]);

    if (error) {
      console.error("Error creating choir info:", error);
    } else {
      // reload data
      window.location.reload();
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando información...</p>;

  // 🔹 No choir assigned
  if (!choirId)
    return (
      <p className="p-8 text-center text-gray-600">
        No estás asignado a ningún coro. Contacta con el administrador.
      </p>
    );

  // 🔹 No choir info yet → allow admin to create
  if (!choirInfo && userRole === "admin") {
    return (
      <div className="p-8 text-center">
        <p className="mb-4 text-gray-700">
          No existe información registrada para este coro.
        </p>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 border rounded bg-green-600 text-white hover:bg-green-500"
        >
          <PlusCircle size={18} /> Crear Información del Coro
        </button>
      </div>
    );
  }

  // 🔹 No info for members
  if (!choirInfo && userRole !== "admin")
    return (
      <p className="p-8 text-center text-gray-600">
        No hay información disponible del coro aún.
      </p>
    );

  const rules = choirInfo.rules || [];

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Información del Coro</h2>

       {userRole === "admin" && (
  <div className="flex gap-2">
    <button
      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
      className="flex items-center gap-2 px-4 py-2 border rounded bg-gray-800 text-white hover:bg-gray-700"
    >
      {isEditing ? (
        <>
          <Save size={18} /> Guardar
        </>
      ) : (
        <>
          <Pencil size={18} /> Editar
        </>
      )}
    </button>

    {/* Always show Create button */}
    <button
      onClick={handleCreate}
      className="flex items-center gap-2 px-4 py-2 border rounded bg-green-600 text-white hover:bg-green-500"
    >
      <PlusCircle size={18} /> Crear Nuevo
    </button>
  </div>
)}

      </div>

      {/* 🔹 Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { value: "about", label: "Sobre Nosotros" },
          { value: "rules", label: "Normas y Reglamento" },
          { value: "board", label: "Junta Directiva" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded border ${
              activeTab === tab.value
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🔹 About Tab */}
      {activeTab === "about" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2 border p-4 rounded">
            {isEditing ? (
              <>
                <input
                  className="w-full font-semibold text-xl mb-2 border-b"
                  value={choirInfo.name}
                  onChange={(e) => setChoirInfo({ ...choirInfo, name: e.target.value })}
                />
                <input
                  className="w-full text-sm text-gray-500 border-b"
                  value={choirInfo.founded}
                  onChange={(e) => setChoirInfo({ ...choirInfo, founded: e.target.value })}
                />
                <textarea
                  className="w-full mt-2 border rounded p-2"
                  rows="4"
                  value={choirInfo.description}
                  onChange={(e) => setChoirInfo({ ...choirInfo, description: e.target.value })}
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{choirInfo.name}</h3>
                <p className="text-sm text-gray-500">Fundado en {choirInfo.founded}</p>
                <p className="mt-2">{choirInfo.description}</p>
              </>
            )}
          </div>

          {/* Director */}
          <div className="border p-4 rounded">
            <h4 className="text-lg font-semibold mb-2">Director</h4>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={choirInfo.director_image || "/placeholder.svg"}
                alt={choirInfo.director_name}
                className="h-24 w-24 rounded-full object-cover"
              />
              <div>
                {isEditing ? (
                  <>
                    <input
                      className="font-medium border-b"
                      value={choirInfo.director_name}
                      onChange={(e) =>
                        setChoirInfo({ ...choirInfo, director_name: e.target.value })
                      }
                    />
                    <textarea
                      className="text-sm text-gray-600 mt-2 border rounded p-2"
                      rows="3"
                      value={choirInfo.director_bio}
                      onChange={(e) =>
                        setChoirInfo({ ...choirInfo, director_bio: e.target.value })
                      }
                    />
                  </>
                ) : (
                  <>
                    <p className="font-medium">{choirInfo.director_name}</p>
                    <p className="text-sm text-gray-600 mt-2">{choirInfo.director_bio}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Rehearsals */}
          <div className="border p-4 rounded">
            <h4 className="text-lg font-semibold mb-2">Ensayos</h4>
            {isEditing ? (
              <>
                <input
                  className="border-b w-full mb-2"
                  value={choirInfo.rehearsal_day}
                  onChange={(e) =>
                    setChoirInfo({ ...choirInfo, rehearsal_day: e.target.value })
                  }
                />
                <input
                  className="border-b w-full mb-2"
                  value={choirInfo.rehearsal_time}
                  onChange={(e) =>
                    setChoirInfo({ ...choirInfo, rehearsal_time: e.target.value })
                  }
                />
                <input
                  className="border-b w-full mb-2"
                  value={choirInfo.rehearsal_location}
                  onChange={(e) =>
                    setChoirInfo({ ...choirInfo, rehearsal_location: e.target.value })
                  }
                />
                <textarea
                  className="border rounded p-2 w-full"
                  rows="2"
                  value={choirInfo.rehearsal_address}
                  onChange={(e) =>
                    setChoirInfo({ ...choirInfo, rehearsal_address: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <p>
                  <span className="font-medium">Horario:</span> {choirInfo.rehearsal_day},{" "}
                  {choirInfo.rehearsal_time}
                </p>
                <p>
                  <span className="font-medium">Ubicación:</span>{" "}
                  {choirInfo.rehearsal_location}
                </p>
                <p className="text-sm text-gray-600">{choirInfo.rehearsal_address}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 🔹 Rules */}
      {activeTab === "rules" && (
        <div className="border p-4 rounded max-h-[500px] overflow-y-auto space-y-4">
          <h3 className="text-xl font-semibold mb-2">Normas y Reglamento del Coro</h3>
          {rules.map((rule, idx) => (
            <div key={idx}>
              <h4 className="font-semibold">{rule.title}</h4>
              <p className="text-sm text-gray-700">{rule.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Board */}
      {activeTab === "board" && (
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-4">Junta Directiva</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {board.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center text-center p-4 border rounded"
              >
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="h-24 w-24 rounded-full object-cover mb-3"
                />
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
