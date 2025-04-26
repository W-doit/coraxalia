import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Music, Users } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bienvenido a Coraxalia</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Ensayo</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Jueves, 18:30</div>
            <p className="text-xs text-muted-foreground">Centro Cultural El Molino</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximo Concierto</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 de Diciembre</div>
            <p className="text-xs text-muted-foreground">Auditorio Municipal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">8 por cuerda</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Anuncios Recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium">Nuevo repertorio para el concierto de Navidad</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Se ha añadido el nuevo repertorio para el concierto de Navidad. Por favor, descarga las partituras y
                comienza a estudiarlas.
              </p>
              <p className="text-xs text-muted-foreground mt-2">Hace 2 días</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-medium">Cambio de horario de ensayo</h3>
              <p className="text-sm text-muted-foreground mt-1">
                El ensayo del próximo jueves se adelanta a las 18:00 debido a la disponibilidad del local.
              </p>
              <p className="text-xs text-muted-foreground mt-2">Hace 5 días</p>
            </div>
            <div>
              <h3 className="font-medium">Bienvenida a nuevos miembros</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Damos la bienvenida a tres nuevos miembros que se incorporan a nuestro coro. ¡Bienvenidos!
              </p>
              <p className="text-xs text-muted-foreground mt-2">Hace 1 semana</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Calendario de ensayos y conciertos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ensayo Regular</p>
                  <p className="text-xs text-muted-foreground">Jueves, 18:30 - 20:30</p>
                </div>
                <div className="text-xs text-muted-foreground">En 2 días</div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ensayo Regular</p>
                  <p className="text-xs text-muted-foreground">Jueves, 18:30 - 20:30</p>
                </div>
                <div className="text-xs text-muted-foreground">En 9 días</div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ensayo General</p>
                  <p className="text-xs text-muted-foreground">Sábado, 10:00 - 14:00</p>
                </div>
                <div className="text-xs text-muted-foreground">En 11 días</div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Concierto de Navidad</p>
                  <p className="text-xs text-muted-foreground">Auditorio Municipal, 19:00</p>
                </div>
                <div className="text-xs text-muted-foreground">En 18 días</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
