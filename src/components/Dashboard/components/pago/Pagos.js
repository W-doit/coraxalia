import React, { useState } from 'react'
import Swal from 'sweetalert2'

const payments = [
  { id: 1, concept: "Cuota Mensual", amount: 20, date: "2023-11-01", status: "Pagado" },
  { id: 2, concept: "Cuota Mensual", amount: 20, date: "2023-10-01", status: "Pagado" },
  { id: 3, concept: "Cuota Mensual", amount: 20, date: "2023-09-01", status: "Pagado" },
  { id: 4, concept: "Cuota Mensual", amount: 20, date: "2023-08-01", status: "Pagado" },
  { id: 5, concept: "Cuota Mensual", amount: 20, date: "2023-07-01", status: "Pagado" },
  { id: 6, concept: "Cuota Mensual", amount: 20, date: "2023-06-01", status: "Pagado" },
]

export default function Pagos() {
  const [activeTab, setActiveTab] = useState('history')

const handleChangeCard = () => {
  Swal.fire({
    title: 'Selecciona un método de pago',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'SumUp',
    denyButtonText: 'PayPal',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'my-swal-btn', // your blue style
      denyButton: 'my-swal-btn my-swal-btn-yellow', // add a yellow variant
      cancelButton: 'my-swal-btn my-swal-btn-gray', // gray variant
    },
    buttonsStyling: false // Important: disables default SweetAlert styling
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'SumUp conectado',
        confirmButtonColor: '#3085d6'
      })
    } else if (result.isDenied) {
      Swal.fire({
        icon: 'success',
        title: 'PayPal conectado',
        confirmButtonColor: '#f59e0b'
      })
    }
  })
}


  return (
    <div className="flex-1 space-y-4 p-2 md:p-8 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Pagos</h2>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex space-x-2 border-b">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-500'
            }`}
          >
            Historial de Pagos
          </button>
          <button
            onClick={() => setActiveTab('method')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'method'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-blue-500'
            }`}
          >
            Método de Pago
          </button>
        </div>

        {/* Tab: Historial de Pagos */}
        {activeTab === 'history' && (
          <div className="bg-white border rounded-lg shadow p-2">
            <h3 className="text-xl font-semibold mb-1">Historial de Pagos</h3>
            <p className="text-sm text-gray-500 mb-4">Revisa tus pagos mensuales</p>

            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{payment.concept}</p>
                    <p className="text-sm text-gray-500">
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
                    <button
                      className="p-2 border rounded-full hover:bg-gray-100 transition"
                      title="Descargar recibo"
                    >
                      ⬇️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Método de Pago */}
        {activeTab === 'method' && (
          <div className="bg-white border rounded-lg shadow p-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Método de Pago</h3>
              <p className="text-sm text-gray-500 mb-4">
                Gestiona tu método de pago para la cuota mensual
              </p>
              <div className="bg-gray-100 p-4 rounded-lg flex items-start gap-4">
                <div className="text-2xl mt-1">💳</div>
                <div>
                  <h4 className="font-medium">Tarjeta de Crédito</h4>
                  <p className="text-sm text-gray-500">**** **** **** 4567</p>
                  <p className="text-sm text-gray-500">Expira: 05/25</p>
                  <div className="mt-2">
                    <button
                      onClick={handleChangeCard}
                      className="px-3 py-1 border rounded-md text-sm hover:bg-gray-200 transition"
                    >
                      Cambiar Tarjeta
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Información de Facturación</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Nombre</p>
                  <p className="text-sm text-gray-500">María García</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Correo electrónico</p>
                  <p className="text-sm text-gray-500">maria@example.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Dirección</p>
                  <p className="text-sm text-gray-500">Calle Principal 123</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ciudad</p>
                  <p className="text-sm text-gray-500">Madrid</p>
                </div>
              </div>
              <div className="mt-2">
                <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-200 transition">
                  Actualizar Información
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Próximo Cargo</h4>
              <p className="text-sm text-gray-500">
                Tu próximo cargo de 20,00 € será el 1 de diciembre de 2023.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
