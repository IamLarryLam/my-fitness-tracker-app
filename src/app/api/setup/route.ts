import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Create a temporary user if it doesn't exist
        const user = await prisma.user.upsert({
            where: {
                id: 'temp-user-id',
            },
            update: {},
            create: {
                id: 'temp-user-id',
                email: 'temp@example.com',
                name: 'Temporary User',
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Temporary user created/verified',
            user
        })
    } catch (error) {
        console.error('Setup error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to create temporary user'
        }, { status: 500 })
    }
} 