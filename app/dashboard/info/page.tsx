import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for choir info
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
}

export default function Info() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Información del Coro</h2>
      </div>

      <Tabs defaultValue="about" className="space-y-4">
        <TabsList>
          <TabsTrigger value="about">Sobre Nosotros</TabsTrigger>
          <TabsTrigger value="rules">Normas y Reglamento</TabsTrigger>
          <TabsTrigger value="board">Junta Directiva</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{choirInfo.name}</CardTitle>
                <CardDescription>Fundado en {choirInfo.founded}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{choirInfo.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Director</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={choirInfo.director.image || "/placeholder.svg"} />
                    <AvatarFallback>{choirInfo.director.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{choirInfo.director.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{choirInfo.director.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ensayos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Horario</h3>
                    <p className="text-sm text-muted-foreground">
                      {choirInfo.rehearsals.day}, {choirInfo.rehearsals.time}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Ubicación</h3>
                    <p className="text-sm text-muted-foreground">{choirInfo.rehearsals.location}</p>
                    <p className="text-sm text-muted-foreground">{choirInfo.rehearsals.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Normas y Reglamento del Coro</CardTitle>
              <CardDescription>Estas normas son esenciales para el buen funcionamiento del coro</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] rounded-md">
                <div className="space-y-4 pr-4">
                  <h3 className="text-lg font-bold">1. Asistencia</h3>
                  <p>
                    La asistencia regular a los ensayos es obligatoria. Los miembros deben asistir al menos al 80% de
                    los ensayos para poder participar en los conciertos. Las ausencias deben ser notificadas con
                    antelación al director del coro.
                  </p>

                  <h3 className="text-lg font-bold">2. Puntualidad</h3>
                  <p>
                    Se espera que todos los miembros lleguen al menos 10 minutos antes del inicio de los ensayos para
                    prepararse adecuadamente. Los ensayos comenzarán puntualmente a la hora establecida.
                  </p>

                  <h3 className="text-lg font-bold">3. Preparación</h3>
                  <p>
                    Cada miembro es responsable de estudiar su parte del repertorio entre ensayos. El director puede
                    realizar pruebas individuales para verificar la preparación.
                  </p>

                  <h3 className="text-lg font-bold">4. Comportamiento</h3>
                  <p>
                    Durante los ensayos y actuaciones, se espera un comportamiento profesional y respetuoso hacia el
                    director y los demás miembros del coro.
                  </p>

                  <h3 className="text-lg font-bold">5. Vestimenta</h3>
                  <p>
                    Para los conciertos, todos los miembros deben seguir el código de vestimenta establecido. La
                    información específica se proporcionará antes de cada actuación.
                  </p>

                  <h3 className="text-lg font-bold">6. Cuotas</h3>
                  <p>
                    La cuota mensual de 20€ debe pagarse puntualmente. Esta cuota cubre gastos de partituras, alquiler
                    de espacios y otros gastos operativos del coro.
                  </p>

                  <h3 className="text-lg font-bold">7. Comunicación</h3>
                  <p>
                    Toda la comunicación oficial se realizará a través de la aplicación Coraxalia. Es responsabilidad de
                    cada miembro revisar regularmente las notificaciones.
                  </p>

                  <h3 className="text-lg font-bold">8. Material</h3>
                  <p>
                    Las partituras y otros materiales proporcionados son propiedad del coro. Cada miembro es responsable
                    de su cuidado y devolución cuando sea solicitado.
                  </p>

                  <h3 className="text-lg font-bold">9. Derechos de imagen</h3>
                  <p>
                    Al unirse al coro, los miembros aceptan que pueden ser fotografiados o grabados durante ensayos y
                    actuaciones, y que estas imágenes pueden ser utilizadas para promocionar al coro.
                  </p>

                  <h3 className="text-lg font-bold">10. Modificaciones</h3>
                  <p>
                    Este reglamento puede ser modificado por la dirección del coro. Cualquier cambio será notificado a
                    todos los miembros a través de la aplicación.
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board">
          <Card>
            <CardHeader>
              <CardTitle>Junta Directiva</CardTitle>
              <CardDescription>Miembros que gestionan el funcionamiento del coro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {choirInfo.board.map((member, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-4 border rounded-lg">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={member.image || "/placeholder.svg"} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.position}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
