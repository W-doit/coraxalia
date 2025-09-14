import { FileText, FolderOpen, ExternalLink } from "lucide-react";
import { useState } from "react";

// Mock data for repertoire
const repertoire = [
  {
    category: "Navidad",
    pieces: [
      { title: "Noche de Paz", composer: "Franz Xaver Gruber", year: 1818 },
      { title: "Adeste Fideles", composer: "John Francis Wade", year: 1751 },
      { title: "Jingle Bells", composer: "James Lord Pierpont", year: 1857 },
      { title: "El Tamborilero", composer: "Katherine Kennicott Davis", year: 1941 },
    ],
  },
  {
    category: "Clásico",
    pieces: [
      { title: "Ave Maria", composer: "Franz Schubert", year: 1825 },
      { title: "Aleluya (El Mesías)", composer: "Georg Friedrich Händel", year: 1741 },
      { title: "Gloria in Excelsis Deo", composer: "Antonio Vivaldi", year: 1715 },
      { title: "Lacrimosa (Réquiem)", composer: "Wolfgang Amadeus Mozart", year: 1791 },
    ],
  },
  {
    category: "Popular",
    pieces: [
      { title: "Bohemian Rhapsody", composer: "Freddie Mercury", year: 1975 },
      { title: "Hallelujah", composer: "Leonard Cohen", year: 1984 },
      { title: "The Sound of Silence", composer: "Paul Simon", year: 1964 },
      { title: "Africa", composer: "David Paich & Jeff Porcaro", year: 1982 },
    ],
  },
];

export default function Repertorio() {
  const [activeTab, setActiveTab] = useState("all");

  const categories = ["all", ...repertoire.map((r) => r.category.toLowerCase())];

  const filteredRepertoire =
    activeTab === "all"
      ? repertoire
      : repertoire.filter((r) => r.category.toLowerCase() === activeTab);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Repertorio</h2>
        <button className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          <ExternalLink className="mr-2 h-4 w-4" />
          Abrir Google Drive
        </button>
      </div>

      {/* Tabs */}
      <div className="space-x-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 text-sm rounded ${
              activeTab === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {cat === "all" ? "Todo" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Repertoire Sections */}
      <div className="space-y-6">
        {filteredRepertoire.map((category, index) => (
          <div key={index} className="border rounded-lg shadow-sm p-4">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{category.category}</h3>
              <p className="text-sm text-gray-500">Partituras y archivos de audio</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {category.pieces.map((piece, pieceIndex) => (
                <div key={pieceIndex} className="flex items-start p-4 rounded-lg border">
                  <div className="mr-4 mt-1">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">{piece.title}</h4>
                    <p className="text-sm text-gray-500">
                      {piece.composer}, {piece.year}
                    </p>
                    <div className="flex mt-2 space-x-2">
                      <button className="flex items-center px-3 py-1 border text-sm rounded hover:bg-gray-100">
                        <FileText className="mr-2 h-4 w-4" />
                        Partitura
                      </button>
                      <button className="flex items-center px-3 py-1 border text-sm rounded hover:bg-gray-100">
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Archivos
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
