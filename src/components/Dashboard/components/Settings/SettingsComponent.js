import { useEffect, useState } from "react";
import { supabase } from "../../../../supabase/client";

const THEME_COLORS = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Red", value: "#ef4444" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Orange", value: "#f97316" },
];

export default function Configuration({ user, setThemeColor }) {
  const [selectedColor, setSelectedColor] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Fetch the configuration for this admin
  useEffect(() => {
    if (!user?.id) return;

    const loadConfiguration = async () => {
      const { data, error } = await supabase
        .from("configuration")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Fetch error:", error);
        return;
      }

      if (!data) {
        // Create default config for this admin
        const { data: newConfig, error: insertError } = await supabase
          .from("configuration")
          .insert([{ user_id: user.id, theme_color: "#f97316", logo_url: "" }])
          .select()
          .single();

        if (insertError) {
          console.error("Error creating default config:", insertError);
          return;
        }
        setSelectedColor(newConfig.theme_color);
        setLogoUrl(newConfig.logo_url);
        setThemeColor(newConfig.theme_color);
        localStorage.setItem("theme_color", newConfig.theme_color);
      } else {
        setSelectedColor(data.theme_color || "#f97316");
        setLogoUrl(data.logo_url || "");
        setThemeColor(data.theme_color || "#f97316");
        localStorage.setItem("theme_color", data.theme_color || "#f97316");
      }
    };

    loadConfiguration();
  }, [user?.id]);

  // 🔹 Handle live color change (before saving)
  const handleColorSelect = (colorValue) => {
    setSelectedColor(colorValue);
    setThemeColor(colorValue); // instant live preview
    localStorage.setItem("theme_color", colorValue);
  };

  // 🔹 Handle logo upload to Supabase Storage
  const handleLogoUpload = async (event) => {
    try {
      setUploading(true);
      setMessage("");
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("logos").getPublicUrl(filePath);
      setLogoUrl(publicUrl.publicUrl);
      setMessage("✅ Logo uploaded successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error uploading logo");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Save configuration to Supabase
 const saveConfiguration = async () => {
  if (!user?.id) {
    console.error("User ID is missing");
    setMessage("❌ Cannot save: User not loaded");
    return;
  }

  try {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("configuration")
      .upsert(
        [
          {
            user_id: user.id,
            theme_color: selectedColor,
            logo_url: logoUrl,
          }
        ],
        { onConflict: "user_id" }
      );

    if (error) throw error;

    setMessage("✅ Configuration saved successfully!");
    localStorage.setItem("theme_color", selectedColor);
    window.dispatchEvent(new Event("config-updated"));

  } catch (error) {
    console.error(error);
    setMessage("❌ Error saving configuration");
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Admin Configuration</h2>

      {/* Theme Color Selector */}
      <div className="mb-6">
        <p className="font-medium text-gray-700 mb-2">Choose Theme Color:</p>
        <div className="flex gap-3 flex-wrap">
          {THEME_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorSelect(color.value)}
              className={`w-10 h-10 rounded-full border-2 transition transform hover:scale-110 ${
                selectedColor === color.value
                  ? "border-black scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.value }}
            />
          ))}
        </div>
      </div>

      {/* Logo Upload */}
      <div className="mb-6">
        <p className="font-medium text-gray-700 mb-2">Upload Logo:</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-600 
            file:mr-4 file:py-2 file:px-4 
            file:rounded-md file:border-0 
            file:text-sm file:font-semibold 
            file:bg-blue-50 file:text-blue-700 
            hover:file:bg-blue-100"
        />
        {logoUrl && (
          <div className="mt-4">
            <img
              src={logoUrl}
              alt="Logo preview"
              className="w-32 h-32 object-contain border rounded-md"
            />
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={saveConfiguration}
        disabled={saving}
        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      >
        {saving ? "Saving..." : "Save Configuration"}
      </button>

      {/* Status Message */}
      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
