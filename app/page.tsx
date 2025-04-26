import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MusicIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-orange-900">
      <div className="container mx-auto px-4 py-16">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <MusicIcon className="h-8 w-8 text-white mr-2" />
            <h1 className="text-2xl font-bold text-white">Coraxalia</h1>
          </div>
          <div className="space-x-2">
            <Link href="/login">
              <Button className="bg-white text-red-900 hover:bg-white/90">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-red-900 hover:bg-white/90">Registrarse</Button>
            </Link>
          </div>
        </header>

        <main className="flex flex-col items-center justify-center text-center">
          <div className="relative mb-10">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 opacity-75 blur"></div>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-8">
              <MusicIcon className="h-24 w-24 text-white mx-auto" />
            </div>
          </div>

          <h2 className="text-5xl font-bold text-white mb-6">
            Bienvenido a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Coraxalia</span>
          </h2>

          <p className="text-xl text-white/80 max-w-2xl mb-10">
            La aplicación moderna para la gestión de coros. Organiza ensayos, conciertos, repertorio y más.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full mb-16">
            {[
              {
                title: "Gestión de Miembros",
                description: "Organiza a los miembros por cuerda y mantén sus datos actualizados.",
              },
              {
                title: "Calendario de Eventos",
                description: "Programa ensayos y conciertos con confirmación de asistencia.",
              },
              {
                title: "Repertorio Digital",
                description: "Accede a partituras y archivos de audio desde cualquier dispositivo.",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all">
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>

          <Link href="/register">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-8 py-6 text-lg"
            >
              Únete a Coraxalia
            </Button>
          </Link>
        </main>

        <footer className="mt-20 text-center text-white/60 text-sm">
          <p>© {new Date().getFullYear()} Coraxalia. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  )
}
