import { useState } from "react";
import { supabase } from "../../supabase/client";
import { useNavigate } from "react-router-dom";

export default function CreateChoir() {
  const [choirName, setChoirName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    const { data: session } = await supabase.auth.getSession();
    const user = session.session.user;

    // 1. Create choir
    const { data: choir, error } = await supabase
      .from("choirs")
      .insert([{ name: choirName, description }])
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    // 2. Assign the creator as admin
    await supabase
      .from("users")
      .update({
        role: "admin",
        choir_id: choir.id
      })
      .eq("id", user.id);

    // 3. Redirect to admin dashboard
    navigate("/dashboard/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-400 to-orange-400 p-6">
      <form
        onSubmit={handleCreate}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center text-red-600 mb-4">
          Create New Choir
        </h1>

        <input
          type="text"
          value={choirName}
          onChange={(e) => setChoirName(e.target.value)}
          placeholder="Choir Name"
          required
          className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition duration-300"
        >
          Create Choir
        </button>
      </form>
    </div>
  );
}
