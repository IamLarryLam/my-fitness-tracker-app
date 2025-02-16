import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET /api/plans
export async function GET() {
    try {
        const plans = await prisma.plan.findMany({
            include: {
                exercises: {
                    orderBy: [
                        { order: 'asc' }
                    ]
                }
            }
        })
        return NextResponse.json(plans)
    } catch (error) {
        console.error('Error fetching plans:', error)
        return new NextResponse(
            JSON.stringify({ message: 'Error fetching plans' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

// POST /api/plans
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, description, type, duration, exercises } = body

        const plan = await prisma.plan.create({
            data: {
                name,
                description: description || null,
                type,
                duration,
                exercises: {
                    create: exercises.map((exercise: any, index: number) => ({
                        name: exercise.name,
                        sets: exercise.sets || null,
                        reps: exercise.reps || null,
                        duration: exercise.duration || null,
                        order: index
                    }))
                }
            },
            include: {
                exercises: {
                    orderBy: [
                        { order: 'asc' }
                    ]
                }
            }
        })

        return NextResponse.json(plan)
    } catch (error) {
        console.error('Error creating plan:', error)
        return new NextResponse(
            JSON.stringify({ message: 'Error creating plan', details: error }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 