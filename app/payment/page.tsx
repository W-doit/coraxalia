"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MusicIcon, CreditCard } from "lucide-react"

export default function Payment() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock payment processing - will be replaced with Stripe
    setTimeout(() => {
      setLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-red-800 to-orange-900 flex flex-col items-center justify-center p-4">
      <div className="flex items-center mb-6">
        <MusicIcon className="h-8 w-8 text-white mr-2" />
        <h1 className="text-2xl font-bold text-white">Coraxalia</h1>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Método de Pago</CardTitle>
          <CardDescription>Configura tu método de pago para la cuota mensual de 20€</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg mb-6 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Tu tarjeta será cargada con 20€ mensualmente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de Tarjeta</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                required
                value={formData.cardNumber}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
              <Input
                id="cardName"
                name="cardName"
                placeholder="J. SMITH"
                required
                value={formData.cardName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Fecha de Expiración</Label>
                <Input
                  id="expiry"
                  name="expiry"
                  placeholder="MM/AA"
                  required
                  value={formData.expiry}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" name="cvc" placeholder="123" required value={formData.cvc} onChange={handleChange} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Procesando..." : "Confirmar Pago"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground text-center">
            Tus datos de pago están seguros y encriptados. Utilizamos Stripe para procesar los pagos.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
