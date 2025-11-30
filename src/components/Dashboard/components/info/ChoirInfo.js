import { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/client";
import { Pencil, Save, PlusCircle } from "lucide-react";
import { Dialog } from "@headlessui/react";

export default function ChoirInfo({ choirId: propChoirId }) {
  const [activeTab, setActiveTab] = useState("about");
  const [choirInfo, setChoirInfo] = useState(null);
  const [board, setBoard] = useState([]);
  const [userRole, setUserRole] = useState("member");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [choirId, setChoirId] = useState(propChoirId || null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChoirData, setNewChoirData] = useState({
    name: "",
    founded: "",
    description: "",
    director_name: "",
    director_bio: "",
    rehearsal_day: "",
    rehearsal_time: "",
    rehearsal_location: "",
    rehearsal_address: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error getting user:", userError);
        setLoading(false);
        return;
      }

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
      setChoirId(effectiveChoirId);

      if (!effectiveChoirId) {
        setLoading(false);
        return;
      }

      const { data: choir } = await supabase
        .from("choir_info")
        .select("*")
        .eq("choir_id", effectiveChoirId)
        .single();

      const { data: boardData } = await supabase
        .from("choir_board")
        .select("*")
        .eq("choir_id", effectiveChoirId)
        .order("order_index");

      setChoirInfo(choir || null);
      setBoard(boardData || []);
      setLoading(false);
    };

    fetchData();
  }, [propChoirId]);

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

    if (!error) setIsEditing(false);
  };

  const openCreateModal = () => {
    if (userRole === "admin") setShowCreateModal(true);
  };

  const handleConfirmCreate = async () => {
    if (userRole !== "admin" || !choirId) return;

    const { error } = await supabase.from("choir_info").insert([
      {
        choir_id: choirId,
        ...newChoirData,
      },
    ]);

    if (!error) {
      setShowCreateModal(false);
      window.location.reload();
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando información...</p>;

  if (!choirId)
    return (
      <p className="p-8 text-center text-gray-600">
        No estás asignado a ningún coro. Contacta con el administrador.
      </p>
    );

  if (!choirInfo && userRole === "admin") {
    return (
      <div className="p-6 text-center">
        <p className="mb-4 text-gray-700 text-sm sm:text-base">
          No existe información registrada para este coro.
        </p>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 border rounded bg-green-600 text-white hover:bg-green-500 text-sm sm:text-base"
        >
          <PlusCircle size={18} /> Crear Información del Coro
        </button>

        {/* Modal */}
        <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
            <Dialog.Panel className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-lg space-y-4 overflow-y-auto max-h-[90vh]">
              <Dialog.Title className="text-lg font-semibold text-center sm:text-left">
                Crear Nuevo Coro
              </Dialog.Title>

              <div className="space-y-2">
                {Object.keys(newChoirData).map((key) => (
                  <div key={key}>
                    <label className="text-sm font-medium capitalize block mb-1">
                      {key.replaceAll("_", " ")}:
                    </label>
                    <input
                      className="border rounded w-full px-2 py-1 text-sm"
                      value={newChoirData[key]}
                      onChange={(e) =>
                        setNewChoirData({ ...newChoirData, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmCreate}
                  className="px-4 py-2 border rounded bg-green-600 text-white hover:bg-green-500 text-sm"
                >
                  Crear
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    );
  }

  if (!choirInfo && userRole !== "admin")
    return (
      <p className="p-6 text-center text-gray-600 text-sm sm:text-base">
        No hay información disponible del coro aún.
      </p>
    );

  const rules = choirInfo.rules || [];

  return (
    <div className="min-h-screen bg-white text-gray-800 p-3 sm:p-4 md:p-8">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center sm:text-left w-full sm:w-auto">
          Información del Coro
        </h2>

        {userRole === "admin" && (
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="flex items-center gap-2 px-3 py-2 border rounded bg-gray-800 text-white hover:bg-gray-700 text-sm sm:text-base"
            >
              {isEditing ? <><Save size={16} /> Guardar</> : <><Pencil size={16} /> Editar</>}
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-3 py-2 border rounded bg-green-600 text-white hover:bg-green-500 text-sm sm:text-base"
            >
              <PlusCircle size={16} /> Crear Nuevo
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center sm:justify-start">
        {[
          { value: "about", label: "Sobre Nosotros" },
          { value: "rules", label: "Normas y Reglamento" },
          { value: "board", label: "Junta Directiva" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 sm:px-4 py-2 rounded border text-sm sm:text-base ${
              activeTab === tab.value
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* About Tab */}
      {activeTab === "about" && (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="md:col-span-2 border p-3 sm:p-4 rounded">
            {isEditing ? (
              <>
                <input
                  className="w-full font-semibold text-lg sm:text-xl mb-2 border-b"
                  value={choirInfo.name}
                  onChange={(e) => setChoirInfo({ ...choirInfo, name: e.target.value })}
                />
                <input
                  className="w-full text-sm text-gray-500 border-b"
                  value={choirInfo.founded}
                  onChange={(e) => setChoirInfo({ ...choirInfo, founded: e.target.value })}
                />
                <textarea
                  className="w-full mt-2 border rounded p-2 text-sm sm:text-base"
                  rows="4"
                  value={choirInfo.description}
                  onChange={(e) =>
                    setChoirInfo({ ...choirInfo, description: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <h3 className="text-lg sm:text-xl font-semibold">{choirInfo.name}</h3>
                <p className="text-sm text-gray-500">Fundado en {choirInfo.founded}</p>
                <p className="mt-2 text-sm sm:text-base">{choirInfo.description}</p>
              </>
            )}
          </div>

          {/* Director */}
          <div className="border p-3 sm:p-4 rounded">
            <h4 className="text-lg font-semibold mb-2">Director</h4>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm sm:text-base">
              <img
                src={choirInfo.director_image || "/placeholder.svg"}
                alt={choirInfo.director_name}
                className="h-24 w-24 rounded-full object-cover"
              />
              <div className="w-full">
                {isEditing ? (
                  <>
                    <input
                      className="font-medium border-b w-full"
                      value={choirInfo.director_name}
                      onChange={(e) =>
                        setChoirInfo({ ...choirInfo, director_name: e.target.value })
                      }
                    />
                    <textarea
                      className="text-sm text-gray-600 mt-2 border rounded p-2 w-full"
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
          <div className="border p-3 sm:p-4 rounded text-sm sm:text-base">
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
                  <span className="font-medium">Horario:</span>{" "}
                  {choirInfo.rehearsal_day}, {choirInfo.rehearsal_time}
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

      {/* Rules */}
      {activeTab === "rules" && (
        <div className="border p-3 sm:p-4 rounded max-h-[60vh] overflow-y-auto text-sm sm:text-base">
          <h3 className="text-xl font-semibold mb-3">Normas y Reglamento del Coro</h3>
          {rules.map((rule, idx) => (
            <div key={idx} className="mb-3">
              <h4 className="font-semibold">{rule.title}</h4>
              <p className="text-gray-700">{rule.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Board */}
      {activeTab === "board" && (
        <div className="border p-3 sm:p-4 rounded">
          <h3 className="text-xl font-semibold mb-4 text-center sm:text-left">
            Junta Directiva
          </h3>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {board.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center text-center p-3 sm:p-4 border rounded"
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

      {/* Global Modal */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-lg space-y-4 overflow-y-auto max-h-[90vh]">
            <Dialog.Title className="text-lg font-semibold">Crear Nuevo Coro</Dialog.Title>

            <div className="space-y-2">
              {Object.keys(newChoirData).map((key) => (
                <div key={key}>
                  <label className="text-sm font-medium capitalize block mb-1">
                    {key.replaceAll("_", " ")}:
                  </label>
                  <input
                    className="border rounded w-full px-2 py-1 text-sm"
                    value={newChoirData[key]}
                    onChange={(e) =>
                      setNewChoirData({ ...newChoirData, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmCreate}
                className="px-4 py-2 border rounded bg-green-600 text-white hover:bg-green-500 text-sm"
              >
                Crear
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
