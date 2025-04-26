"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MapPin, Clock, Music, ArrowLeft } from "lucide-react"

// Mock data for a specific concert
const concertData = {
  id: 1,
  title: "Concierto de Navidad",
  date: "15 de Diciembre, 2023",
  time: "19:00",
  venue: "Auditorio Municipal",
  address: "Calle Mayor 123, Madrid",
  repertoire: ["Noche de Paz", "Adeste Fideles", "Jingle Bells", "El Tamborilero"],
  description: "Concierto tradicional de Navidad con villancicos clásicos y modernos.",
}

// Mock data for choir members attendance
const membersAttendance = [
  // Sopranos
  { id: 1, name: "María", cuerda: "soprano1", attending: true, image: "" },
  { id: 2, name: "Laura", cuerda: "soprano1", attending: true, image: "" },
  { id: 3, name: "Ana", cuerda: "soprano2", attending: false, image: "" },
  { id: 4, name: "Carmen", cuerda: "soprano2", attending: true, image: "" },

  // Contraaltos
  { id: 5, name: "Elena", cuerda: "contraalto1", attending: true, image: "" },
  { id: 6, name: "Sofía", cuerda: "contraalto1", attending: false, image: "" },
  { id: 7, name: "Lucía", cuerda: "contraalto2", attending: true, image: "" },
  { id: 8, name: "Isabel", cuerda: "contraalto2", attending: true, image: "" },

  // Tenores
  { id: 9, name: "David", cuerda: "tenor1", attending: true, image: "" },
  { id: 10, name: "Pablo", cuerda: "tenor1", attending: false, image: "" },
  { id: 11, name: "Javier", cuerda: "tenor2", attending: true, image: "" },
  { id: 12, name: "Alejandro", cuerda: "tenor2", attending: true, image: "" },

  // Bajos
  { id: 13, name: "Carlos", cuerda: "bajo1", attending: true, image: "" },
  { id: 14, name: "Miguel", cuerda: "bajo1", attending: true, image: "" },
  { id: 15, name: "Antonio", cuerda: "bajo2", attending: false, image: "" },
  { id: 16, name: "José", cuerda: "bajo2", attending: true, image: "" },
]

export default function ConciertoDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [attendance, setAttendance] = useState<boolean | null>(null)

  const handleAttendance = (attending: boolean) => {
    setAttendance(attending)
  }

  const getMembers = (cuerda: string) => {
    return membersAttendance.filter((member) => member.cuerda === cuerda)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Conciertos
      </Button>

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{concertData.title}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{concertData.title}</CardTitle>
          <CardDescription>{concertData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{concertData.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{concertData.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <div>{concertData.venue}</div>
                  <div className="text-sm text-muted-foreground">{concertData.address}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Music className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <div className="font-medium">Repertorio:</div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground pl-2">
                    {concertData.repertoire.map((piece, index) => (
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
                    variant={attendance === true ? "default" : "outline"}
                    className={attendance === true ? "bg-green-600 hover:bg-green-700" : ""}
                    onClick={() => handleAttendance(true)}
                  >
                    Sí, puedo asistir
                  </Button>
                  <Button
                    variant={attendance === false ? "default" : "outline"}
                    className={attendance === false ? "bg-red-600 hover:bg-red-700" : ""}
                    onClick={() => handleAttendance(false)}
                  >
                    No puedo asistir
                  </Button>
                </div>
              </div>

              {attendance !== null && (
                <div
                  className={`p-4 rounded-lg ${attendance ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}
                >
                  <p className="font-medium">
                    {attendance
                      ? "Has confirmado tu asistencia a este concierto."
                      : "Has indicado que no puedes asistir a este concierto."}
                  </p>
                  <p className="text-sm mt-1">
                    {attendance
                      ? "Recibirás más información por correo electrónico."
                      : "Si tu situación cambia, puedes actualizar tu respuesta."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-bold mb-4">Asistencia del Coro</h3>
            <div className="relative w-full h-[300px] bg-muted rounded-lg p-4 overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
                {/* First row (back) - Bajos */}
                <div className="flex justify-center mb-2 w-full">
                  {getMembers("bajo1")
                    .concat(getMembers("bajo2"))
                    .map((member) => (
                      <div key={member.id} className="mx-1">
                        <Avatar
                          className={`h-10 w-10 border-2 ${member.attending ? "border-green-600 bg-green-100" : "border-red-600 bg-red-100"}`}
                        >
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
                        <Avatar
                          className={`h-10 w-10 border-2 ${member.attending ? "border-green-600 bg-green-100" : "border-red-600 bg-red-100"}`}
                        >
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
                        <Avatar
                          className={`h-10 w-10 border-2 ${member.attending ? "border-green-600 bg-green-100" : "border-red-600 bg-red-100"}`}
                        >
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
                        <Avatar
                          className={`h-10 w-10 border-2 ${member.attending ? "border-green-600 bg-green-100" : "border-red-600 bg-red-100"}`}
                        >
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                </div>

                {/* Director */}
                <div className="mb-4">
                  <Avatar className="h-12 w-12 border-2 border-amber-600 bg-amber-100">
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                  <div className="text-xs font-medium text-center mt-1">Director</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
                <span className="text-sm">Asistirá</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                <span className="text-sm">No asistirá</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
