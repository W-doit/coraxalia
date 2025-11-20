import { useEffect, useState } from "react";
import { supabase } from "../../supabase/client";
import { useNavigate } from "react-router-dom";

export default function JoinChoir() {
  const [choirs, setChoirs] = useState([]);
  const [selectedChoir, setSelectedChoir] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChoirs = async () => {
      const { data, error } = await supabase.from("choirs").select("*");
      if (!error) setChoirs(data);
    };
    fetchChoirs();
  }, []);

const handleJoin = async (e) => {
  e.preventDefault();

  const { data: { session } } = await supabase.auth.getSession();
  const user = session.user;

  const { data: existingAdmin } = await supabase
    .from("users")
    .select("*")
    .eq("choir_id", selectedChoir)
    .eq("role", "admin")
    .maybeSingle();

  let newRole = existingAdmin ? "member" : "admin";

  await supabase
    .from("users")
    .update({
      role: newRole,
      choir_id: selectedChoir
    })
    .eq("id", user.id);

  navigate(newRole === "admin" ? "/dashboard/admin" : "/dashboard/member");
};


  return (
    <form onSubmit={handleJoin} className="flex flex-col gap-4 p-8">
      <h2 className="text-xl font-semibold">Select a Choir to Join</h2>

      <select
        value={selectedChoir}
        onChange={(e) => setSelectedChoir(e.target.value)}
        required
        className="border p-2 rounded"
      >
        <option value="">Select choir</option>
        {choirs.map((choir) => (
          <option key={choir.id} value={choir.id}>
            {choir.name}
          </option>
        ))}
      </select>

      <button className="bg-orange-500 text-white py-2 rounded">
        Join Choir
      </button>
    </form>
  );
}
