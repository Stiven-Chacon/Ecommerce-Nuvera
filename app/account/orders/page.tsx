"use client"

import { useEffect, useState, useMemo } from "react"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/headers"
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  CreditCard,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { getAllOrders } from "@/lib/products/orders-local"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  total: number
  status: string
  payment_intent_id?: string
  shipping_address: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  items: Array<{
    product_id: string
    quantity: number
    price: number
    product_name?: string
  }>
  created_at: string
}

const ITEMS_PER_PAGE = 10

function getOrderStatusInfo(status: string) {
  switch (status.toLowerCase()) {
    case "processing":
    case "procesando":
      return {
        icon: Clock,
        color: "text-amber-700",
        bg: "bg-linear-to-br from-amber-50 to-amber-100/50",
        border: "border-amber-200",
        label: "Procesando",
        value: "procesando",
      }
    case "shipped":
    case "enviado":
      return {
        icon: Truck,
        color: "text-blue-700",
        bg: "bg-linear-to-br from-blue-50 to-blue-100/50",
        border: "border-blue-200",
        label: "Enviado",
        value: "enviado",
      }
    case "delivered":
    case "entregado":
      return {
        icon: CheckCircle,
        color: "text-emerald-700",
        bg: "bg-linear-to-br from-emerald-50 to-emerald-100/50",
        border: "border-emerald-200",
        label: "Entregado",
        value: "entregado",
      }
    case "cancelled":
    case "cancelado":
      return {
        icon: XCircle,
        color: "text-red-700",
        bg: "bg-linear-to-br from-red-50 to-red-100/50",
        border: "border-red-200",
        label: "Cancelado",
        value: "cancelado",
      }
    case "completed":
    case "completado":
      return {
        icon: CheckCircle,
        color: "text-emerald-700",
        bg: "bg-linear-to-br from-emerald-50 to-emerald-100/50",
        border: "border-emerald-200",
        label: "Completado",
        value: "completado",
      }
    default:
      return {
        icon: Package,
        color: "text-gray-700",
        bg: "bg-linear-to-br from-gray-50 to-gray-100/50",
        border: "border-gray-200",
        label: status,
        value: status.toLowerCase(),
      }
  }
}

const statusOptions = [
  { value: "all", label: "Todos los estados" },
  { value: "procesando", label: "Procesando" },
  { value: "enviado", label: "Enviado" },
  { value: "entregado", label: "Entregado" },
  { value: "completado", label: "Completado" },
  { value: "cancelado", label: "Cancelado" },
]

const sortOptions = [
  { value: "newest", label: "Más recientes" },
  { value: "oldest", label: "Más antiguos" },
  { value: "highest", label: "Mayor precio" },
  { value: "lowest", label: "Menor precio" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadOrders = () => {
      const allOrders = getAllOrders()
      setOrders(allOrders)
      setLoading(false)
    }

    loadOrders()
  }, [])

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((order) => {
        const orderId = order.id.toLowerCase()
        const productNames = order.items
          .map((item) => item.product_name?.toLowerCase() || "")
          .join(" ")
        const address = `${order.shipping_address.name} ${order.shipping_address.address} ${order.shipping_address.city}`.toLowerCase()

        return orderId.includes(query) || productNames.includes(query) || address.includes(query)
      })
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => {
        const orderStatus = getOrderStatusInfo(order.status).value
        return orderStatus === statusFilter
      })
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "highest":
          return b.total - a.total
        case "lowest":
          return a.total - b.total
        default:
          return 0
      }
    })

    return result
  }, [orders, searchQuery, statusFilter, sortBy])

  // Reset page when filters change
  const actualPage = useMemo(() => {
    return 1
  }, [searchQuery, statusFilter, sortBy])

  const effectivePage = searchQuery || statusFilter !== "all" || sortBy !== "newest" ? actualPage : currentPage

  const totalPages = Math.ceil(filteredAndSortedOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = filteredAndSortedOrders.slice(
    (effectivePage - 1) * ITEMS_PER_PAGE,
    effectivePage * ITEMS_PER_PAGE
  )

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-b from-gray-50 to-gray-100">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando pedidos...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-gray-50 to-gray-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Mis Pedidos
            </h1>
            <p className="text-gray-600 text-lg">
              {orders.length > 0
                ? `Tienes ${orders.length} ${orders.length === 1 ? "pedido" : "pedidos"}`
                : "No tienes pedidos aún"}
            </p>
          </div>

          {!orders || orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No tienes pedidos aún
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Cuando realices tu primera compra, aparecerá aquí con toda la información de
                seguimiento
              </p>
              <Link
                href="/productos"
                className="inline-flex items-center justify-center bg-linear-to-r from-black to-gray-800 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Explorar Productos
              </Link>
            </div>
          ) : (
            <>
              {/* Filters and Search */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 backdrop-blur-sm bg-white/80">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <Filter className="h-4 w-4 text-gray-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Buscar
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="ID, producto, dirección..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-black focus:ring-black rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black font-medium"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ordenar por
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black font-medium"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Results count */}
                <div className="mt-5 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Mostrando{" "}
                    <span className="font-bold text-gray-900">
                      {filteredAndSortedOrders.length}
                    </span>{" "}
                    {filteredAndSortedOrders.length === 1 ? "pedido" : "pedidos"}
                    {(searchQuery || statusFilter !== "all") && (
                      <button
                        onClick={() => {
                          setSearchQuery("")
                          setStatusFilter("all")
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-700 font-medium underline transition-colors"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </p>
                </div>
              </div>

              {/* Orders List */}
              {filteredAndSortedOrders.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                  <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    No se encontraron pedidos
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Intenta ajustar los filtros o la búsqueda
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setStatusFilter("all")
                    }}
                    variant="outline"
                    className="border-2 font-medium"
                  >
                    Limpiar filtros
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedOrders.map((order) => {
                      const statusInfo = getOrderStatusInfo(order.status)
                      const StatusIcon = statusInfo.icon
                      const isExpanded = expandedOrders.has(order.id)

                      return (
                        <div
                          key={order.id}
                          className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                        >
                          {/* Accordion Header - Clickable */}
                          <button
                            onClick={() => toggleOrder(order.id)}
                            className="w-full p-6 text-left hover:bg-gray-50/50 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    #{order.id.slice(6, 18)}
                                  </h3>
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border-2 shadow-sm`}
                                  >
                                    <StatusIcon className="h-3.5 w-3.5" />
                                    {statusInfo.label}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 font-medium">
                                  {new Date(order.created_at).toLocaleDateString("es-ES", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}{" "}
                                  •{" "}
                                  {new Date(order.created_at).toLocaleTimeString("es-ES", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-xs text-gray-500 mb-1 font-medium">Total</p>
                                  <p className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    ${order.total.toFixed(2)}
                                  </p>
                                </div>
                                <ChevronDown
                                  className={`h-6 w-6 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </div>
                          </button>

                          {/* Accordion Content */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            {/* Order Items */}
                            {order.items && order.items.length > 0 && (
                              <div className="px-6 pb-6 border-b border-gray-100">
                                <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                  <div className="w-6 h-6 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                    <Package className="h-3.5 w-3.5 text-gray-600" />
                                  </div>
                                  Productos ({order.items.length})
                                </h4>
                                <div className="space-y-3">
                                  {order.items.map((item, index) => (
                                    <div
                                      key={`${item.product_id}-${index}`}
                                      className="flex items-center justify-between py-4 px-5 bg-linear-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 truncate mb-1">
                                          {item.product_name || "Producto"}
                                        </p>
                                        <p className="text-sm text-gray-600 font-medium">
                                          Cantidad: {item.quantity} × ${item.price.toFixed(2)}
                                        </p>
                                      </div>
                                      <p className="font-bold text-lg text-gray-900 ml-4">
                                        ${(item.price * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Shipping & Payment Info */}
                            <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100/30 grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Shipping Address */}
                              {order.shipping_address && (
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-linear-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                      <MapPin className="h-3.5 w-3.5 text-blue-600" />
                                    </div>
                                    Dirección de Envío
                                  </h4>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <p className="font-bold text-gray-900">
                                      {order.shipping_address.name}
                                    </p>
                                    <p>{order.shipping_address.address}</p>
                                    <p>
                                      {order.shipping_address.city}, {order.shipping_address.postalCode}
                                    </p>
                                    <p className="font-medium">{order.shipping_address.country}</p>
                                  </div>
                                </div>
                              )}

                              {/* Payment Info */}
                              {order.payment_intent_id && (
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-linear-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                                      <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                                    </div>
                                    Información de Pago
                                  </h4>
                                  <div className="text-sm text-gray-600">
                                    <p className="mb-2 font-medium text-gray-700">
                                      ID de Transacción:
                                    </p>
                                    <p className="font-mono text-xs bg-linear-to-br from-gray-50 to-gray-100 px-3 py-2.5 rounded-lg border border-gray-200 break-all">
                                      {order.payment_intent_id}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between bg-white p-4 rounded-xl shadow-md border border-gray-200">
                      <p className="text-sm text-gray-600 font-medium">
                        Página <span className="font-bold text-gray-900">{effectivePage}</span> de{" "}
                        <span className="font-bold text-gray-900">{totalPages}</span>
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={effectivePage === 1}
                          variant="outline"
                          size="sm"
                          className="border-2 font-medium disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Anterior
                        </Button>
                        <Button
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={effectivePage === totalPages}
                          variant="outline"
                          size="sm"
                          className="border-2 font-medium disabled:opacity-50"
                        >
                          Siguiente
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}