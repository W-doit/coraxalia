"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Clock, Music } from "lucide-react"

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
]

export default function Conciertos() {
  const [attendance, setAttendance] = useState<Record<number, boolean>>({})

  const handleAttendance = (concertId: number, attending: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [concertId]: attending,
    }))
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Conciertos</h2>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="past">Pasados</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {concerts.map((concert) => (
            <Card key={concert.id}>
              <CardHeader>
                <CardTitle>{concert.title}</CardTitle>
                <CardDescription>{concert.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{concert.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{concert.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <div>{concert.venue}</div>
                        <div className="text-sm text-muted-foreground">{concert.address}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Music className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Repertorio:</div>
                        <ul className="list-disc list-inside text-sm text-muted-foreground pl-2">
                          {concert.repertoire.map((piece, index) => (
                            <li key={index}>{piece}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between">
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <h3 className="font-medium mb-2">¿Puedes asistir a este concierto?</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant={attendance[concert.id] === true ? "default" : "outline"}
                          className={attendance[concert.id] === true ? "bg-green-600 hover:bg-green-700" : ""}
                          onClick={() => handleAttendance(concert.id, true)}
                        >
                          Sí, puedo asistir
                        </Button>
                        <Button
                          variant={attendance[concert.id] === false ? "default" : "outline"}
                          className={attendance[concert.id] === false ? "bg-red-600 hover:bg-red-700" : ""}
                          onClick={() => handleAttendance(concert.id, false)}
                        >
                          No puedo asistir
                        </Button>
                      </div>
                    </div>

                    {attendance[concert.id] !== undefined && (
                      <div
                        className={`p-4 rounded-lg ${attendance[concert.id] ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}
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
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Concierto de Verano</CardTitle>
              <CardDescription>15 de Julio, 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <p>No hay conciertos pasados disponibles.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
