import React, { useState } from "react";
import { Calendar, MapPin, Clock, Music } from "lucide-react";

// Mock data for concerts
const concerts = [
  {
    id: 1,
    title: "Concierto de Navidad",
    date: "15 de Diciembre, 2023",
    time: "19:00",
    venue: "Auditorio Municipal",
    address: "Calle Mayor 123, Madrid",
    repertoire: ["Noche de Paz", "Adeste Fideles", "Jingle Bells", "El Tamborilero"],
    description: "Concierto tradicional de Navidad con villancicos clásicos y modernos.",
  },
  {
    id: 2,
    title: "Concierto de Primavera",
    date: "22 de Marzo, 2024",
    time: "18:30",
    venue: "Teatro Principal",
    address: "Plaza del Teatro 5, Madrid",
    repertoire: ["Las Cuatro Estaciones - Primavera", "Canon en D", "Ave Maria", "Aleluya"],
    description: "Celebración de la llegada de la primavera con música clásica y contemporánea.",
  },
  {
    id: 3,
    title: "Festival Coral Internacional",
    date: "10 de Junio, 2024",
    time: "20:00",
    venue: "Palacio de Congresos",
    address: "Avenida de los Reyes 45, Madrid",
    repertoire: ["Carmina Burana (selección)", "Va Pensiero", "Hallelujah", "Bohemian Rhapsody"],
    description: "Participación en el Festival Coral Internacional junto a coros de toda Europa.",
  },
];

export default function Conciertos() {
  const [attendance, setAttendance] = useState({});
  const [activeTab, setActiveTab] = useState("upcoming");

  const handleAttendance = (concertId, attending) => {
    setAttendance(prev => ({
      ...prev,
      [concertId]: attending,
    }));
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Conciertos</h2>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-2 px-4 -mb-px border-b-2 font-medium ${
              activeTab === "upcoming"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Próximos
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`py-2 px-4 -mb-px border-b-2 font-medium ${
              activeTab === "past"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Pasados
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "upcoming" && (
          <div className="space-y-4">
            {concerts.map(concert => (
              <div
                key={concert.id}
                className="border rounded-lg shadow-sm p-6 bg-white dark:bg-gray-800"
              >
                <header className="mb-4">
                  <h3 className="text-xl font-semibold">{concert.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{concert.description}</p>
                </header>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{concert.date}</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{concert.time}</span>
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <MapPin className="h-5 w-5 mr-2" />
                      <div>
                        <div>{concert.venue}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{concert.address}</div>
                      </div>
                    </div>
                    <div className="flex items-start text-gray-700 dark:text-gray-300">
                      <Music className="h-5 w-5 mr-2 mt-1" />
                      <div>
                        <div className="font-medium">Repertorio:</div>
                        <ul className="list-disc list-inside text-sm">
                          {concert.repertoire.map((piece, idx) => (
                            <li key={idx}>{piece}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2">¿Puedes asistir a este concierto?</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAttendance(concert.id, true)}
                          className={`py-2 px-4 rounded ${
                            attendance[concert.id] === true
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-white border border-green-600 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          Sí, puedo asistir
                        </button>
                        <button
                          onClick={() => handleAttendance(concert.id, false)}
                          className={`py-2 px-4 rounded ${
                            attendance[concert.id] === false
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-white border border-red-600 text-red-600 hover:bg-red-100"
                          }`}
                        >
                          No puedo asistir
                        </button>
                      </div>
                    </div>

                    {attendance[concert.id] !== undefined && (
                      <div
                        className={`p-4 rounded-lg ${
                          attendance[concert.id]
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        <p className="font-medium">
                          {attendance[concert.id]
                            ? "Has confirmado tu asistencia a este concierto."
                            : "Has indicado que no puedes asistir a este concierto."}
                        </p>
                        <p className="text-sm mt-1">
                          {attendance[concert.id]
                            ? "Recibirás más información por correo electrónico."
                            : "Si tu situación cambia, puedes actualizar tu respuesta."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "past" && (
          <div>
            <div className="border rounded-lg shadow-sm p-6 bg-white dark:bg-gray-800">
              <header className="mb-4">
                <h3 className="text-xl font-semibold">Concierto de Verano</h3>
                <p className="text-gray-500 dark:text-gray-400">15 de Julio, 2023</p>
              </header>
              <p>No hay conciertos pasados disponibles.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
