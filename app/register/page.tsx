"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MusicIcon, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function Register() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp(formData.email, formData.password)

      if (error) {
        toast({
          title: "Error al registrarse",
          description: error.message,
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      toast({
        title: "Registro exitoso",
        description: "Se ha enviado un correo de confirmación a tu email",
      })

      // Redirect to profile creation
      router.push("/profile/create")
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al registrarse",
        variant: "destructive",
      })
      console.error("Registration error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-orange-900 flex flex-col items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 text-white flex items-center hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Link>

      <div className="flex items-center mb-6">
        <MusicIcon className="h-8 w-8 text-white mr-2" />
        <h1 className="text-2xl font-bold text-white">Coraxalia</h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear una cuenta</CardTitle>
          <CardDescription>Únete a Coraxalia para gestionar tu experiencia coral</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@ejemplo.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
