import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const plans = await prisma.plan.findMany({
            include: {
                exercises: true,
            },
        })
        return NextResponse.json(plans)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching plans' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const plan = await prisma.plan.create({
            data: {
                name: body.name,
                description: body.description,
                type: body.type,
                duration: body.duration,
                userId: body.userId, // You'll need to implement authentication
                exercises: {
                    create: body.exercises,
                },
            },
            include: {
                exercises: true,
            },
        })
        return NextResponse.json(plan)
    } catch (error) {
        return NextResponse.json({ error: 'Error creating plan' }, { status: 500 })
    }
} 