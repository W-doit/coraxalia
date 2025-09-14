import React, { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/client";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) console.error(error);
      else {
        setUser(currentUser);
        setProfile(data);
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    setUploading(true);
    const file = e.target.files[0];
    const ext = file.name.split(".").pop();
    const fileName = `${user.id}.${ext}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("users")
      .update({ image_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error(updateError.message);
    } else {
      setProfile((prev) => ({ ...prev, image_url: publicUrl }));
    }

    setUploading(false);
  };

  const handleSubmit = async () => {
    const { nombre, email, cuerda, localidad, fecha_nacimiento } = profile;
    const { error } = await supabase
      .from("users")
      .update({ nombre, email, cuerda, localidad, fecha_nacimiento })
      .eq("id", user.id);

    if (error) {
      console.error(error.message);
    } else {
      setEditing(false);
    }
  };

  if (loading || !profile) {
    return <div className="p-10 text-center text-gray-600">Cargando perfil...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-800">
      <h2 className="text-3xl font-bold mb-6">Mi Perfil</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Avatar + Info */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32">
            <img
              src={profile.image_url || "/placeholder-avatar.png"}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border border-gray-300"
            />
            {editing && (
              <>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full cursor-pointer"
                >
                  Cambiar
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </>
            )}
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{profile.nombre}</p>
            <p className="text-sm text-gray-600">{profile.email}</p>
            <p className="text-sm mt-1 text-gray-500">
              Miembro desde:{" "}
              {new Date(profile.fecha_ingreso).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">Nombre</label>
              <input
                name="nombre"
                value={profile.nombre}
                onChange={handleChange}
                disabled={!editing}
                className="w-full p-2 rounded border border-gray-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Correo</label>
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!editing}
                className="w-full p-2 rounded border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 font-medium">Cuerda</label>
              <select
                name="cuerda"
                value={profile.cuerda || ""}
                onChange={handleChange}
                disabled={!editing}
                className="w-full p-2 rounded border border-gray-300 bg-white"
              >
                <option value="">Selecciona tu cuerda</option>
                {[
                  "soprano1",
                  "soprano2",
                  "contraalto1",
                  "contraalto2",
                  "tenor1",
                  "tenor2",
                  "bajo1",
                  "bajo2",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Fecha de nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={profile.fecha_nacimiento || ""}
                onChange={handleChange}
                disabled={!editing}
                className="w-full p-2 rounded border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Localidad</label>
            <input
              name="localidad"
              value={profile.localidad}
              onChange={handleChange}
              disabled={!editing}
              className="w-full p-2 rounded border border-gray-300 bg-white"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white"
                >
                  Guardar
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
              >
                Editar perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
