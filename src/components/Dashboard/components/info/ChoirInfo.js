import { useState } from "react";

const choirInfo = {
  name: "Coraxalia",
  founded: "2015",
  director: {
    name: "Carlos Rodríguez",
    bio: "Director con más de 20 años de experiencia en dirección coral. Graduado del Conservatorio Superior de Música con especialización en dirección coral y orquestal.",
    image: "",
  },
  description:
    "Coraxalia es un coro mixto fundado en 2015 con el objetivo de interpretar un repertorio variado que abarca desde música clásica hasta arreglos de música popular contemporánea. El coro ha participado en numerosos festivales nacionales e internacionales, obteniendo reconocimientos por su calidad interpretativa y su versatilidad.",
  rehearsals: {
    day: "Jueves",
    time: "18:30 - 20:30",
    location: "Centro Cultural El Molino",
    address: "Calle Mayor 123, Madrid",
  },
  board: [
    { name: "Ana Martínez", position: "Presidenta", image: "" },
    { name: "Luis García", position: "Secretario", image: "" },
    { name: "Elena Sánchez", position: "Tesorera", image: "" },
  ],
};

const tabs = [
  { value: "about", label: "Sobre Nosotros" },
  { value: "rules", label: "Normas y Reglamento" },
  { value: "board", label: "Junta Directiva" },
];

export default function ChoirInfo() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 md:p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Información del Coro</h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded border ${
              activeTab === tab.value ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "about" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2 border p-4 rounded">
            <h3 className="text-xl font-semibold">{choirInfo.name}</h3>
            <p className="text-sm text-gray-500">Fundado en {choirInfo.founded}</p>
            <p className="mt-2">{choirInfo.description}</p>
          </div>

          <div className="border p-4 rounded">
            <h4 className="text-lg font-semibold mb-2">Director</h4>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={choirInfo.director.image || "/placeholder.svg"}
                alt={choirInfo.director.name}
                className="h-24 w-24 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{choirInfo.director.name}</p>
                <p className="text-sm text-gray-600 mt-2">{choirInfo.director.bio}</p>
              </div>
            </div>
          </div>

          <div className="border p-4 rounded">
            <h4 className="text-lg font-semibold mb-2">Ensayos</h4>
            <p>
              <span className="font-medium">Horario:</span> {choirInfo.rehearsals.day},{" "}
              {choirInfo.rehearsals.time}
            </p>
            <p>
              <span className="font-medium">Ubicación:</span> {choirInfo.rehearsals.location}
            </p>
            <p className="text-sm text-gray-600">{choirInfo.rehearsals.address}</p>
          </div>
        </div>
      )}

      {activeTab === "rules" && (
        <div className="border p-4 rounded max-h-[500px] overflow-y-auto space-y-4">
          <h3 className="text-xl font-semibold">Normas y Reglamento del Coro</h3>
          <p className="text-sm text-gray-600">Estas normas son esenciales para el buen funcionamiento del coro</p>

          {[
            {
              title: "1. Asistencia",
              text:
                "La asistencia regular a los ensayos es obligatoria. Los miembros deben asistir al menos al 80% de los ensayos para poder participar en los conciertos. Las ausencias deben ser notificadas con antelación al director del coro.",
            },
            {
              title: "2. Puntualidad",
              text:
                "Se espera que todos los miembros lleguen al menos 10 minutos antes del inicio de los ensayos para prepararse adecuadamente. Los ensayos comenzarán puntualmente a la hora establecida.",
            },
            {
              title: "3. Preparación",
              text:
                "Cada miembro es responsable de estudiar su parte del repertorio entre ensayos. El director puede realizar pruebas individuales para verificar la preparación.",
            },
            {
              title: "4. Comportamiento",
              text:
                "Durante los ensayos y actuaciones, se espera un comportamiento profesional y respetuoso hacia el director y los demás miembros del coro.",
            },
            {
              title: "5. Vestimenta",
              text:
                "Para los conciertos, todos los miembros deben seguir el código de vestimenta establecido. La información específica se proporcionará antes de cada actuación.",
            },
            {
              title: "6. Cuotas",
              text:
                "La cuota mensual de 20€ debe pagarse puntualmente. Esta cuota cubre gastos de partituras, alquiler de espacios y otros gastos operativos del coro.",
            },
            {
              title: "7. Comunicación",
              text:
                "Toda la comunicación oficial se realizará a través de la aplicación Coraxalia. Es responsabilidad de cada miembro revisar regularmente las notificaciones.",
            },
            {
              title: "8. Material",
              text:
                "Las partituras y otros materiales proporcionados son propiedad del coro. Cada miembro es responsable de su cuidado y devolución cuando sea solicitado.",
            },
            {
              title: "9. Derechos de imagen",
              text:
                "Al unirse al coro, los miembros aceptan que pueden ser fotografiados o grabados durante ensayos y actuaciones, y que estas imágenes pueden ser utilizadas para promocionar al coro.",
            },
            {
              title: "10. Modificaciones",
              text:
                "Este reglamento puede ser modificado por la dirección del coro. Cualquier cambio será notificado a todos los miembros a través de la aplicación.",
            },
          ].map((rule, idx) => (
            <div key={idx}>
              <h4 className="font-semibold">{rule.title}</h4>
              <p className="text-sm text-gray-700">{rule.text}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "board" && (
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-4">Junta Directiva</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {choirInfo.board.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4 border rounded">
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
