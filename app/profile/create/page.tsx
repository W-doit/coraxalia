"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MusicIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export default function CreateProfile() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: "",
    cuerda: "",
    fechaNacimiento: "",
    localidad: "",
  })

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear un perfil",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Upload profile image if exists
      let imageUrl = null
      if (profileImage) {
        // Extract base64 data
        const base64Data = profileImage.split(",")[1]
        if (base64Data) {
          const fileName = `profile-${user.id}-${Date.now()}.jpg`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("profiles")
            .upload(fileName, Buffer.from(base64Data, "base64"), {
              contentType: "image/jpeg",
            })

          if (uploadError) {
            console.error("Error uploading image:", uploadError)
          } else if (uploadData) {
            const {
              data: { publicUrl },
            } = supabase.storage.from("profiles").getPublicUrl(fileName)

            imageUrl = publicUrl
          }
        }
      }

      // Create profile in database
      const { error } = await supabase.from("profiles").insert({
        user_id: user.id,
        email: user.email,
        nombre: formData.nombre,
        cuerda: formData.cuerda,
        fecha_nacimiento: formData.fechaNacimiento,
        localidad: formData.localidad,
        image: imageUrl,
        role: "member", // Default role
        fecha_ingreso: new Date().toISOString().split("T")[0],
      })

      if (error) {
        toast({
          title: "Error",
          description: "Ha ocurrido un error al crear el perfil",
          variant: "destructive",
        })
        console.error("Error creating profile:", error)
        setLoading(false)
        return
      }

      toast({
        title: "Perfil creado",
        description: "Tu perfil ha sido creado correctamente",
      })

      // Redirect to rules page
      router.push("/rules")
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el perfil",
        variant: "destructive",
      })
      console.error("Profile creation error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Show nothing while checking auth
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-orange-900 flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-6">
        <MusicIcon className="h-8 w-8 text-white mr-2" />
        <h1 className="text-2xl font-bold text-white">Coraxalia</h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Completa tu perfil</CardTitle>
          <CardDescription>Proporciona tus datos para unirte al coro</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileImage || ""} />
                  <AvatarFallback className="bg-primary/20">
                    <MusicIcon className="h-12 w-12 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="picture"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer"
                >
                  +
                  <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required value={formData.nombre} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuerda">Cuerda</Label>
              <Select onValueChange={(value) => handleSelectChange("cuerda", value)} value={formData.cuerda}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu cuerda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soprano1">Soprano 1</SelectItem>
                  <SelectItem value="soprano2">Soprano 2</SelectItem>
                  <SelectItem value="contraalto1">Contraalto 1</SelectItem>
                  <SelectItem value="contraalto2">Contraalto 2</SelectItem>
                  <SelectItem value="tenor1">Tenor 1</SelectItem>
                  <SelectItem value="tenor2">Tenor 2</SelectItem>
                  <SelectItem value="bajo1">Bajo 1</SelectItem>
                  <SelectItem value="bajo2">Bajo 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                required
                value={formData.fechaNacimiento}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="localidad">Localidad</Label>
              <Input id="localidad" name="localidad" required value={formData.localidad} onChange={handleChange} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Guardando..." : "Continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
