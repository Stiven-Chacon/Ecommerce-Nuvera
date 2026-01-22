export const mockUsersData = {
  "demo@nuvera.com": {
    user: {
      email: "demo@nuvera.com",
      name: "Usuario Demo",
      role: "user" as const,
    },
    stats: {
      totalOrders: 18,
      totalSpent: 3245.50,
      memberSince: "Junio 2023",
      loyaltyPoints: 324,
    },
  },
  "admin@nuvera.com": {
    user: {
      email: "admin@nuvera.com",
      name: "Administrador",
      role: "admin" as const,
    },
    stats: {
      totalOrders: 247,
      totalSpent: 28540.75,
      memberSince: "Enero 2022",
      loyaltyPoints: 2854,
    },
  },
}

// Función helper para obtener datos por email
export function getUserDataByEmail(email: string) {
  return mockUsersData[email as keyof typeof mockUsersData] || null
}