"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MusicIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Rules() {
  const router = useRouter()
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock submission - will be replaced with Supabase
    setTimeout(() => {
      setLoading(false)
      router.push("/payment")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-orange-900 flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-6">
        <MusicIcon className="h-8 w-8 text-white mr-2" />
        <h1 className="text-2xl font-bold text-white">Coraxalia</h1>
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Normas y Reglamento del Coro</CardTitle>
          <CardDescription>Por favor, lee atentamente las normas y el reglamento del coro</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-bold">1. Asistencia</h3>
              <p>
                La asistencia regular a los ensayos es obligatoria. Los miembros deben asistir al menos al 80% de los
                ensayos para poder participar en los conciertos. Las ausencias deben ser notificadas con antelación al
                director del coro.
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
                Para los conciertos, todos los miembros deben seguir el código de vestimenta establecido. La información
                específica se proporcionará antes de cada actuación.
              </p>

              <h3 className="text-lg font-bold">6. Cuotas</h3>
              <p>
                La cuota mensual de 20€ debe pagarse puntualmente. Esta cuota cubre gastos de partituras, alquiler de
                espacios y otros gastos operativos del coro.
              </p>

              <h3 className="text-lg font-bold">7. Comunicación</h3>
              <p>
                Toda la comunicación oficial se realizará a través de la aplicación Coraxalia. Es responsabilidad de
                cada miembro revisar regularmente las notificaciones.
              </p>

              <h3 className="text-lg font-bold">8. Material</h3>
              <p>
                Las partituras y otros materiales proporcionados son propiedad del coro. Cada miembro es responsable de
                su cuidado y devolución cuando sea solicitado.
              </p>

              <h3 className="text-lg font-bold">9. Derechos de imagen</h3>
              <p>
                Al unirse al coro, los miembros aceptan que pueden ser fotografiados o grabados durante ensayos y
                actuaciones, y que estas imágenes pueden ser utilizadas para promocionar al coro.
              </p>

              <h3 className="text-lg font-bold">10. Modificaciones</h3>
              <p>
                Este reglamento puede ser modificado por la dirección del coro. Cualquier cambio será notificado a todos
                los miembros a través de la aplicación.
              </p>
            </div>
          </ScrollArea>

          <div className="flex items-center space-x-2 mt-4">
            <Checkbox id="accept" checked={accepted} onCheckedChange={(checked) => setAccepted(checked === true)} />
            <label
              htmlFor="accept"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              He leído y acepto las normas y el reglamento del coro
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full">
            <Button type="submit" className="w-full" disabled={!accepted || loading}>
              {loading ? "Procesando..." : "Continuar"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
