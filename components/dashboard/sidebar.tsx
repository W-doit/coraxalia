"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { User, Music, Calendar, FileText, CreditCard, LogOut, Settings, Users, BarChart, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  roles?: ("member" | "director" | "admin")[]
}

const navItems: NavItem[] = [
  {
    title: "Inicio",
    href: "/dashboard",
    icon: Home,
    roles: ["member", "director", "admin"],
  },
  {
    title: "Perfil",
    href: "/dashboard/profile",
    icon: User,
    roles: ["member", "director", "admin"],
  },
  {
    title: "Información del Coro",
    href: "/dashboard/info",
    icon: Music,
    roles: ["member", "director", "admin"],
  },
  {
    title: "Conciertos",
    href: "/dashboard/conciertos",
    icon: Calendar,
    roles: ["member", "director", "admin"],
  },
  {
    title: "Repertorio",
    href: "/dashboard/repertorio",
    icon: FileText,
    roles: ["member", "director", "admin"],
  },
  {
    title: "Pagos",
    href: "/dashboard/pagos",
    icon: CreditCard,
    roles: ["member", "director", "admin"],
  },
  {
    title: "Miembros",
    href: "/dashboard/miembros",
    icon: Users,
    roles: ["director", "admin"],
  },
  {
    title: "Estadísticas",
    href: "/dashboard/estadisticas",
    icon: BarChart,
    roles: ["admin"],
  },
  {
    title: "Configuración",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["admin"],
  },
]

type SidebarProps = {
  user: {
    name: string
    email: string
    image?: string
    role: "member" | "director" | "admin"
  }
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      })
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al cerrar sesión",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center font-semibold">
          <Music className="mr-2 h-5 w-5" />
          <span>Coraxalia</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems
            .filter((item) => !item.roles || item.roles.includes(user.role))
            .map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                  pathname === item.href && "bg-muted text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <Avatar>
            <AvatarImage src={user.image || "/placeholder.svg"} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
