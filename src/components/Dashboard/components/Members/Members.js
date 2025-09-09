import React, { useState } from 'react'

const members = [
  { id: 1, name: 'María García', cuerda: 'soprano1', localidad: 'Madrid', image: '' },
  { id: 2, name: 'Laura Martínez', cuerda: 'soprano1', localidad: 'Barcelona', image: '' },
  { id: 3, name: 'Ana Rodríguez', cuerda: 'soprano2', localidad: 'Valencia', image: '' },
  { id: 4, name: 'Carmen López', cuerda: 'soprano2', localidad: 'Sevilla', image: '' },
  { id: 5, name: 'Elena Sánchez', cuerda: 'contraalto1', localidad: 'Madrid', image: '' },
  { id: 6, name: 'Sofía Pérez', cuerda: 'contraalto1', localidad: 'Barcelona', image: '' },
  { id: 7, name: 'Lucía Fernández', cuerda: 'contraalto2', localidad: 'Valencia', image: '' },
  { id: 8, name: 'Isabel Díaz', cuerda: 'contraalto2', localidad: 'Sevilla', image: '' },
  { id: 9, name: 'David González', cuerda: 'tenor1', localidad: 'Madrid', image: '' },
  { id: 10, name: 'Pablo Ruiz', cuerda: 'tenor1', localidad: 'Barcelona', image: '' },
  { id: 11, name: 'Javier Hernández', cuerda: 'tenor2', localidad: 'Valencia', image: '' },
  { id: 12, name: 'Alejandro Jiménez', cuerda: 'tenor2', localidad: 'Sevilla', image: '' },
  { id: 13, name: 'Carlos Moreno', cuerda: 'bajo1', localidad: 'Madrid', image: '' },
  { id: 14, name: 'Miguel Torres', cuerda: 'bajo1', localidad: 'Barcelona', image: '' },
  { id: 15, name: 'Antonio Gutiérrez', cuerda: 'bajo2', localidad: 'Valencia', image: '' },
  { id: 16, name: 'José Navarro', cuerda: 'bajo2', localidad: 'Sevilla', image: '' },
]

const cuerdaLabels = {
  soprano1: 'Soprano 1',
  soprano2: 'Soprano 2',
  contraalto1: 'Contraalto 1',
  contraalto2: 'Contraalto 2',
  tenor1: 'Tenor 1',
  tenor2: 'Tenor 2',
  bajo1: 'Bajo 1',
  bajo2: 'Bajo 2',
}

const sections = [
  { title: 'Sopranos', cuerdas: ['soprano1', 'soprano2'] },
  { title: 'Contraaltos', cuerdas: ['contraalto1', 'contraalto2'] },
  { title: 'Tenores', cuerdas: ['tenor1', 'tenor2'] },
  { title: 'Bajos', cuerdas: ['bajo1', 'bajo2'] },
]

function MemberGrid({ members }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex flex-col items-center p-2 rounded-lg bg-gray-100"
        >
          <div className="h-12 w-12 mb-2 rounded-full bg-gray-400 flex items-center justify-center text-sm font-bold text-white">
            {member.name.charAt(0)}
          </div>
          <p className="text-sm text-center">{member.name}</p>
        </div>
      ))}
    </div>
  )
}

function SectionColumn({ title, cuerdas, members }) {
  return (
    <div className="space-y-4">
      <h3 className="text-center text-lg font-semibold">{title}</h3>
      {cuerdas.map((cuerda) => {
        const filtered = members.filter((m) => m.cuerda === cuerda)
        return (
          <div key={cuerda}>
            <h4 className="text-sm text-gray-500 font-medium mb-1">
              {cuerdaLabels[cuerda]}
            </h4>
            <MemberGrid members={filtered} />
          </div>
        )
      })}
    </div>
  )
}

export default function Miembros() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cuerdaLabels[member.cuerda].toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.localidad.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4">Miembros del Coro</h2>
        <input
          type="text"
          placeholder="Buscar por nombre, cuerda o localidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-2">Distribución del Coro</h3>
        <p className="text-sm text-gray-500 mb-6">
          Visualización de los miembros por cuerda
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => (
            <SectionColumn
              key={section.title}
              title={section.title}
              cuerdas={section.cuerdas}
              members={filteredMembers}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
