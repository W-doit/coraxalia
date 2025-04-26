"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Mock data for choir members
const members = [
  // Sopranos
  { id: 1, name: "María García", cuerda: "soprano1", localidad: "Madrid", image: "" },
  { id: 2, name: "Laura Martínez", cuerda: "soprano1", localidad: "Barcelona", image: "" },
  { id: 3, name: "Ana Rodríguez", cuerda: "soprano2", localidad: "Valencia", image: "" },
  { id: 4, name: "Carmen López", cuerda: "soprano2", localidad: "Sevilla", image: "" },

  // Contraaltos
  { id: 5, name: "Elena Sánchez", cuerda: "contraalto1", localidad: "Madrid", image: "" },
  { id: 6, name: "Sofía Pérez", cuerda: "contraalto1", localidad: "Barcelona", image: "" },
  { id: 7, name: "Lucía Fernández", cuerda: "contraalto2", localidad: "Valencia", image: "" },
  { id: 8, name: "Isabel Díaz", cuerda: "contraalto2", localidad: "Sevilla", image: "" },

  // Tenores
  { id: 9, name: "David González", cuerda: "tenor1", localidad: "Madrid", image: "" },
  { id: 10, name: "Pablo Ruiz", cuerda: "tenor1", localidad: "Barcelona", image: "" },
  { id: 11, name: "Javier Hernández", cuerda: "tenor2", localidad: "Valencia", image: "" },
  { id: 12, name: "Alejandro Jiménez", cuerda: "tenor2", localidad: "Sevilla", image: "" },

  // Bajos
  { id: 13, name: "Carlos Moreno", cuerda: "bajo1", localidad: "Madrid", image: "" },
  { id: 14, name: "Miguel Torres", cuerda: "bajo1", localidad: "Barcelona", image: "" },
  { id: 15, name: "Antonio Gutiérrez", cuerda: "bajo2", localidad: "Valencia", image: "" },
  { id: 16, name: "José Navarro", cuerda: "bajo2", localidad: "Sevilla", image: "" },
]

const cuerdaLabels: Record<string, string> = {
  soprano1: "Soprano 1",
  soprano2: "Soprano 2",
  contraalto1: "Contraalto 1",
  contraalto2: "Contraalto 2",
  tenor1: "Tenor 1",
  tenor2: "Tenor 2",
  bajo1: "Bajo 1",
  bajo2: "Bajo 2",
}

export default function Miembros() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuerdaLabels[member.cuerda].toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.localidad.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getMembers = (cuerda: string) => {
    return filteredMembers.filter((member) => member.cuerda === cuerda)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Miembros del Coro</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por nombre, cuerda o localidad..."
          className="w-full pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribución del Coro</CardTitle>
          <CardDescription>Visualización de los miembros por cuerda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-center">Sopranos</h3>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Soprano 1</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getMembers("soprano1").map((member) => (
                    <div key={member.id} className="flex flex-col items-center p-2 bg-muted rounded-lg">
                      <Avatar className="h-12 w-12 mb-2">
                        <AvatarImage src={member.image || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Soprano 2</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getMembers("soprano2").map((member) => (
                    <div key={member.id} className="flex flex-col items-center p-2 bg-muted rounded-lg">
                      <Avatar className="h-12 w-12 mb-2">
                        <AvatarImage src={member.image || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-center">Contraaltos</h3>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Contraalto 1</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getMembers("contraalto1").map((member) => (
                    <div key={member.id} className="flex flex-col items-center p-2 bg-muted rounded-lg">
                      <Avatar className="h-12 w-12 mb-2">
                        <AvatarImage src={member.image || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Contraalto 2</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getMembers("contraalto2").map((member) => (
                    <div key={member.id} className="flex flex-col items-center p-2 bg-muted rounded-lg">
                      <Avatar className="h-12 w-12 mb-2">
                        <AvatarImage src={member.image || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-center">Tenores</h3>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Tenor 1</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getMembers("tenor1").map((member) => (
                    <div key={member.id} className="flex flex-col items-center p-2 bg-muted rounded-lg">
                      <Avatar className="h-12 w-12 mb-2">
                        <AvatarImage src={member.image || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Tenor 2</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getMembers("tenor2").map((member) => (
                    <div key={member.id} className="flex flex-col items-center p-2 bg-muted rounded-lg">
                      <Avatar className="h-12 w-12 mb-2">
                        <AvatarImage src={member.image || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-center">Bajos</h3>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Bajo 1</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getMembers("bajo1").map((member) => (
                    <div key={member.id} className="flex flex-col items-center p-2 bg-muted rounded-lg">
                      <Avatar className="h-12 w-12 mb-2">
                        <AvatarImage src={member.image || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Bajo 2</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getMembers("bajo2").map((member) => (
                    <div key={member.id} className="flex flex-col items-center p-2 bg-muted rounded-lg">
                      <Avatar className="h-12 w-12 mb-2">
                        <AvatarImage src={member.image || "/placeholder.svg"} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold mb-4">Visualización del Coro</h3>
            <div className="relative w-full h-[300px] bg-muted rounded-lg p-4 overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
                {/* First row (back) - Bajos */}
                <div className="flex justify-center mb-2 w-full">
                  {getMembers("bajo1")
                    .concat(getMembers("bajo2"))
                    .map((member) => (
                      <div key={member.id} className="mx-1">
                        <Avatar className="h-10 w-10 border-2 border-red-800 bg-red-100">
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                </div>

                {/* Second row - Tenores */}
                <div className="flex justify-center mb-2 w-full">
                  {getMembers("tenor1")
                    .concat(getMembers("tenor2"))
                    .map((member) => (
                      <div key={member.id} className="mx-1">
                        <Avatar className="h-10 w-10 border-2 border-orange-600 bg-orange-100">
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                </div>

                {/* Third row - Contraaltos */}
                <div className="flex justify-center mb-2 w-full">
                  {getMembers("contraalto1")
                    .concat(getMembers("contraalto2"))
                    .map((member) => (
                      <div key={member.id} className="mx-1">
                        <Avatar className="h-10 w-10 border-2 border-amber-600 bg-amber-100">
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                </div>

                {/* Fourth row (front) - Sopranos */}
                <div className="flex justify-center mb-8 w-full">
                  {getMembers("soprano1")
                    .concat(getMembers("soprano2"))
                    .map((member) => (
                      <div key={member.id} className="mx-1">
                        <Avatar className="h-10 w-10 border-2 border-yellow-600 bg-yellow-100">
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                </div>

                {/* Director */}
                <div className="mb-4">
                  <Avatar className="h-12 w-12 border-2 border-red-600 bg-red-100">
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                  <div className="text-xs font-medium text-center mt-1">Director</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
