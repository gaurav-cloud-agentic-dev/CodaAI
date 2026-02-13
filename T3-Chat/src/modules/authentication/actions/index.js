"use server"

import db from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const currentUser = async () => {
    try {
        // 1. Get the session
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user?.id) {
            return null
        }

        // 2. Query the database
        const user = await db.user.findUnique({
            where: {
                id: session.user.id
            },
            select: { 
                id: true,
                email: true,
                name: true,
                image: true,
                emailVerified: true,  // ✅ ADD THIS LINE
                createdAt: true,
                updatedAt: true,
            },
        })

        return user
    } catch (error) {
        console.error("Error fetching current user:", error)
        return null
    }
}