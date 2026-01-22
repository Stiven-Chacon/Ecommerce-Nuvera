"use client"

import { Header } from "@/components/layout/headers"
import { Footer } from "@/components/layout/footer"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Shield, Calendar, ShoppingBag, Award, TrendingUp, ArrowRight, Crown, Sparkles } from "lucide-react"
import { getUserDataByEmail } from "@/lib/mock-data/user-data"
import Link from "next/link"

export default function SettingsPage() {
  const [user, setUser] = useState<{ email: string; name: string; role: string } | null>(null)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    memberSince: "",
    loyaltyPoints: 0,
  })
  const [loading, setLoading] = useState(true)

  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Obtener información del usuario desde las cookies
    const getUserInfo = async () => {
      try {
        // TODO: Descomentar cuando el endpoint esté listo
        // const response = await fetch("/api/user-info")
        // if (response.ok) {
        //   const data = await response.json()
        //   const mockData = getUserDataByEmail(data.email)
        //   if (mockData) {
        //     setUser(mockData.user)
        //     setStats(mockData.stats)
        //   } else {
        //     setUser(data)
        //   }
        // }

        // Datos mock globales por defecto (cambiar email según necesites)
        const defaultEmail = "demo@nuvera.com" // Cambiar a "admin@nuvera.com" para ver datos de admin
        const mockData = getUserDataByEmail(defaultEmail)
        
        if (mockData) {
          setUser(mockData.user)
          setStats(mockData.stats)
        }
      } catch (error) {
        console.error("Error fetching user info:", error)
      } finally {
        setLoading(false)
      }
    }
    
    getUserInfo()
  }, [])

  useEffect(() => {
    if (!loading && user) {
      // Animaciones GSAP mejoradas
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        })
      }


      cardRefs.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.7,
            delay: 0.3 + index * 0.1,
            ease: "power3.out",
          })
        }
      })
    }
  }, [loading, user])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando tu perfil...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isAdmin = user.role === "admin"

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        {/* Header Section */}
        <div ref={headerRef} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {user.name}
              </h1>
              {isAdmin && (
                <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 px-3 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  Administrador
                </Badge>
              )}
            </div>
          </div>
          <p className="text-gray-500 text-lg ml-15">Miembro desde {stats.memberSince}</p>
        </div>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Orders */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total de Pedidos</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>

          {/* Total Spent */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Gastado</p>
              <p className="text-4xl font-bold text-gray-900">${stats.totalSpent.toLocaleString()}</p>
            </div>
          </div>

          {/* Loyalty Points */}
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Puntos de Lealtad</p>
              <p className="text-4xl font-bold text-gray-900">{stats.loyaltyPoints}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card
              ref={(el) => {
                cardRefs.current[0] = el
              }}
              className="border border-gray-200 rounded-2xl p-8 bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información Personal</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                    <p className="font-semibold text-gray-900 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium mb-1">Nombre Completo</p>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-2">Tipo de Cuenta</p>
                    <Badge 
                      className={`${
                        isAdmin 
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0" 
                          : "bg-gray-900 text-white border-0"
                      } px-3 py-1`}
                    >
                      {isAdmin ? (
                        <>
                          <Crown className="w-3 h-3 mr-1" />
                          Administrador
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-1" />
                          Usuario Regular
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Miembro Desde</p>
                    <p className="font-semibold text-gray-900">{stats.memberSince}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card
              ref={(el) => {
                cardRefs.current[1] = el
              }}
              className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
              
              <div className="space-y-3">
                <Link href="/account/orders">
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-auto py-4 px-4 border-2 hover:border-black hover:bg-black hover:text-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5" />
                      <span className="font-semibold">Mis Pedidos</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Button 
                  variant="outline" 
                  className="w-full justify-between h-auto py-4 px-4 border-2 hover:border-black hover:bg-black hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5" />
                    <span className="font-semibold">Recompensas</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-between h-auto py-4 px-4 border-2 hover:border-black hover:bg-black hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <span className="font-semibold">Editar Perfil</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}