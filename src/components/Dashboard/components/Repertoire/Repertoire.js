import { FileText, FolderOpen, ExternalLink, PlusCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

// Mock data with fake URLs
const initialRepertoire = [
  {
    category: "Navidad",
    pieces: [
      {
        title: "Noche de Paz",
        composer: "Franz Xaver Gruber",
        year: 1818,
        scoreUrl: "https://example.com/noche-de-paz-score.pdf",
        filesUrl: "https://example.com/noche-de-paz-files.zip",
      },
      {
        title: "Adeste Fideles",
        composer: "John Francis Wade",
        year: 1751,
        scoreUrl: "https://example.com/adeste-fideles-score.pdf",
        filesUrl: "https://example.com/adeste-fideles-files.zip",
      },
      {
        title: "Jingle Bells",
        composer: "James Lord Pierpont",
        year: 1857,
        scoreUrl: "https://example.com/jingle-bells-score.pdf",
        filesUrl: "https://example.com/jingle-bells-files.zip",
      },
      {
        title: "El Tamborilero",
        composer: "Katherine Kennicott Davis",
        year: 1941,
        scoreUrl: "https://example.com/el-tamborilero-score.pdf",
        filesUrl: "https://example.com/el-tamborilero-files.zip",
      },
    ],
  },
  {
    category: "Clásico",
    pieces: [
      {
        title: "Ave Maria",
        composer: "Franz Schubert",
        year: 1825,
        scoreUrl: "https://example.com/ave-maria-score.pdf",
        filesUrl: "https://example.com/ave-maria-files.zip",
      },
      {
        title: "Aleluya (El Mesías)",
        composer: "Georg Friedrich Händel",
        year: 1741,
        scoreUrl: "https://example.com/aleluya-score.pdf",
        filesUrl: "https://example.com/aleluya-files.zip",
      },
      {
        title: "Gloria in Excelsis Deo",
        composer: "Antonio Vivaldi",
        year: 1715,
        scoreUrl: "https://example.com/gloria-score.pdf",
        filesUrl: "https://example.com/gloria-files.zip",
      },
      {
        title: "Lacrimosa (Réquiem)",
        composer: "Wolfgang Amadeus Mozart",
        year: 1791,
        scoreUrl: "https://example.com/lacrimosa-score.pdf",
        filesUrl: "https://example.com/lacrimosa-files.zip",
      },
    ],
  },
  {
    category: "Popular",
    pieces: [
      {
        title: "Bohemian Rhapsody",
        composer: "Freddie Mercury",
        year: 1975,
        scoreUrl: "https://example.com/bohemian-score.pdf",
        filesUrl: "https://example.com/bohemian-files.zip",
      },
      {
        title: "Hallelujah",
        composer: "Leonard Cohen",
        year: 1984,
        scoreUrl: "https://example.com/hallelujah-score.pdf",
        filesUrl: "https://example.com/hallelujah-files.zip",
      },
      {
        title: "The Sound of Silence",
        composer: "Paul Simon",
        year: 1964,
        scoreUrl: "https://example.com/sound-of-silence-score.pdf",
        filesUrl: "https://example.com/sound-of-silence-files.zip",
      },
      {
        title: "Africa",
        composer: "David Paich & Jeff Porcaro",
        year: 1982,
        scoreUrl: "https://example.com/africa-score.pdf",
        filesUrl: "https://example.com/africa-files.zip",
      },
    ],
  },
];

export default function Repertorio({ isAdmin = false }) {
  const [repertoire, setRepertoire] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newPiece, setNewPiece] = useState({
    category: "",
    title: "",
    composer: "",
    year: "",
    scoreUrl: "",
    filesUrl: "",
  });

  // ✅ Load from localStorage or fallback to default
  useEffect(() => {
    const stored = localStorage.getItem("repertoireData");
    if (stored) {
      setRepertoire(JSON.parse(stored));
    } else {
      setRepertoire(initialRepertoire);
      localStorage.setItem("repertoireData", JSON.stringify(initialRepertoire));
    }
  }, []);

  // ✅ Save to localStorage whenever repertoire changes
  useEffect(() => {
    if (repertoire.length > 0) {
      localStorage.setItem("repertoireData", JSON.stringify(repertoire));
    }
  }, [repertoire]);

  const categories = ["all", ...repertoire.map((r) => r.category.toLowerCase())];

  const filteredRepertoire =
    activeTab === "all"
      ? repertoire
      : repertoire.filter((r) => r.category.toLowerCase() === activeTab);

  const handleAddPiece = () => {
    if (!newPiece.category || !newPiece.title)
      return alert("Por favor completa los campos requeridos.");

    const updated = [...repertoire];
    const categoryIndex = updated.findIndex(
      (c) => c.category.toLowerCase() === newPiece.category.toLowerCase()
    );

    if (categoryIndex !== -1) {
      updated[categoryIndex].pieces.push({
        title: newPiece.title,
        composer: newPiece.composer,
        year: newPiece.year,
        scoreUrl: newPiece.scoreUrl,
        filesUrl: newPiece.filesUrl,
      });
    } else {
      updated.push({
        category: newPiece.category,
        pieces: [
          {
            title: newPiece.title,
            composer: newPiece.composer,
            year: newPiece.year,
            scoreUrl: newPiece.scoreUrl,
            filesUrl: newPiece.filesUrl,
          },
        ],
      });
    }

    setRepertoire(updated);
    setShowModal(false);
    setNewPiece({
      category: "",
      title: "",
      composer: "",
      year: "",
      scoreUrl: "",
      filesUrl: "",
    });
  };

   return (
    <div className="flex-1 space-y-4 p-3 sm:p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-wrap">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left w-full sm:w-auto">
          Repertorio
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center py-2 px-4 md:pt-[5px] pt-[5px] h-[50px] pt-[5px] m-[7px] sm:h-auto sm:pt-0 sm:m-0 px-4 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Repertorio
            </button>
          )}
          <button className="flex items-center justify-center py-2 px-4 md:pt-[5px] h-[50px] pt-[5px] m-[7px] sm:h-auto sm:pt-0 sm:m-0 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir Google Drive
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 text-sm rounded ${
              activeTab === cat
                ? "bg-gray-800 text-white"
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
          <div
            key={index}
            className="border rounded-lg shadow-sm p-4 bg-white overflow-x-auto"
          >
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">{category.category}</h3>
              <p className="text-sm text-gray-500">Partituras y archivos de audio</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {category.pieces.map((piece, pieceIndex) => (
                <div
                  key={pieceIndex}
                  className="flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="mr-0 sm:mr-4 mb-3 sm:mb-0">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="w-full overflow-x-auto">
                    <h4 className="font-medium break-words">{piece.title}</h4>
                    <p className="text-sm text-gray-500">
                      {piece.composer}, {piece.year}
                    </p>
                    <div className="flex flex-wrap mt-2 gap-2">
                      {piece.scoreUrl && (
                        <a
                          href={piece.scoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1 border text-sm rounded hover:bg-gray-200"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Partitura
                        </a>
                      )}
                      {piece.filesUrl && (
                        <a
                          href={piece.filesUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1 border text-sm rounded hover:bg-gray-200"
                        >
                          <FolderOpen className="mr-2 h-4 w-4" />
                          Archivos
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold mb-4">Añadir Nueva Pieza</h3>

            <div className="space-y-3">
              <select
                value={newPiece.category}
                onChange={(e) =>
                  setNewPiece({ ...newPiece, category: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Selecciona una categoría</option>
                {repertoire.map((r, i) => (
                  <option key={i} value={r.category}>
                    {r.category}
                  </option>
                ))}
              </select>

              {["title", "composer", "year", "scoreUrl", "filesUrl"].map((field) => (
                <input
                  key={field}
                  type={field === "year" ? "number" : "text"}
                  placeholder={
                    field === "title"
                      ? "Título"
                      : field === "composer"
                      ? "Compositor"
                      : field === "year"
                      ? "Año"
                      : field === "scoreUrl"
                      ? "URL de Partitura"
                      : "URL de Archivos"
                  }
                  value={newPiece[field]}
                  onChange={(e) =>
                    setNewPiece({ ...newPiece, [field]: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              ))}
            </div>

            <button
              onClick={handleAddPiece}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
