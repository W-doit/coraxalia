"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MusicIcon } from "lucide-react"

// Mock user data
const userData = {
  nombre: "María García",
  email: "maria@example.com",
  cuerda: "soprano1",
  fechaNacimiento: "1990-05-15",
  localidad: "Madrid",
  image: "",
  fechaIngreso: "2022-09-01",
}

export default function Profile() {
  const [profileData, setProfileData] = useState(userData)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock profile update - will be replaced with Supabase
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
    }, 1500)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Información Personal</TabsTrigger>
          <TabsTrigger value="payments">Historial de Pagos</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Gestiona tu información personal y de contacto</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={profileImage || profileData.image} />
                        <AvatarFallback className="bg-primary/20">
                          <MusicIcon className="h-16 w-16 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Label
                          htmlFor="picture"
                          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer"
                        >
                          +
                          <Input
                            id="picture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </Label>
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="font-medium text-lg">{profileData.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{profileData.email}</p>
                    </div>

                    <div className="bg-muted p-3 rounded-lg text-center">
                      <p className="text-sm font-medium">Miembro desde</p>
                      <p className="text-sm">
                        {new Date(profileData.fechaIngreso).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={profileData.nombre}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cuerda">Cuerda</Label>
                        <Select
                          disabled={!isEditing}
                          value={profileData.cuerda}
                          onValueChange={(value) => handleSelectChange("cuerda", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
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
                          value={profileData.fechaNacimiento}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="localidad">Localidad</Label>
                      <Input
                        id="localidad"
                        name="localidad"
                        value={profileData.localidad}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos</CardTitle>
              <CardDescription>Revisa tus pagos mensuales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(6)].map((_, index) => {
                  const date = new Date()
                  date.setMonth(date.getMonth() - index)

                  return (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Cuota Mensual</p>
                        <p className="text-sm text-muted-foreground">
                          {date.toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">20,00 €</p>
                        <p className="text-xs text-green-600">Pagado</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
