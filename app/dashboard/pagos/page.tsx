import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, CreditCard } from "lucide-react"

// Mock data for payments
const payments = [
  { id: 1, concept: "Cuota Mensual", amount: 20, date: "2023-11-01", status: "Pagado" },
  { id: 2, concept: "Cuota Mensual", amount: 20, date: "2023-10-01", status: "Pagado" },
  { id: 3, concept: "Cuota Mensual", amount: 20, date: "2023-09-01", status: "Pagado" },
  { id: 4, concept: "Cuota Mensual", amount: 20, date: "2023-08-01", status: "Pagado" },
  { id: 5, concept: "Cuota Mensual", amount: 20, date: "2023-07-01", status: "Pagado" },
  { id: 6, concept: "Cuota Mensual", amount: 20, date: "2023-06-01", status: "Pagado" },
]

export default function Pagos() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Pagos</h2>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Historial de Pagos</TabsTrigger>
          <TabsTrigger value="method">Método de Pago</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos</CardTitle>
              <CardDescription>Revisa tus pagos mensuales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.concept}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{payment.amount.toFixed(2)} €</p>
                        <p className="text-xs text-green-600">{payment.status}</p>
                      </div>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Descargar recibo</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="method">
          <Card>
            <CardHeader>
              <CardTitle>Método de Pago</CardTitle>
              <CardDescription>Gestiona tu método de pago para la cuota mensual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg flex items-start gap-4">
                  <CreditCard className="h-6 w-6 text-muted-foreground mt-1" />
                  <div>
                    <h3 className="font-medium">Tarjeta de Crédito</h3>
                    <p className="text-sm text-muted-foreground">**** **** **** 4567</p>
                    <p className="text-sm text-muted-foreground">Expira: 05/25</p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        Cambiar Tarjeta
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Información de Facturación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Nombre</p>
                      <p className="text-sm text-muted-foreground">María García</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Correo electrónico</p>
                      <p className="text-sm text-muted-foreground">maria@example.com</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dirección</p>
                      <p className="text-sm text-muted-foreground">Calle Principal 123</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Ciudad</p>
                      <p className="text-sm text-muted-foreground">Madrid</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Button variant="outline" size="sm">
                      Actualizar Información
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Próximo Cargo</h3>
                  <p className="text-sm text-muted-foreground">
                    Tu próximo cargo de 20,00 € será el 1 de diciembre de 2023.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
