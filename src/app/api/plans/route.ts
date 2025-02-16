/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { Exercise } from '@prisma/client'

interface ExerciseInput {
    name: string
    sets?: number | null
    reps?: number | null
    duration?: number | null
    order: number
}

interface PlanInput {
    name: string
    description?: string | null
    type: string
    duration: number
    exercises: ExerciseInput[]
}

// GET /api/plans
export async function GET() {
    try {
        const plans = await prisma.plan.findMany({
            include: {
                exercises: {
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        })
        return NextResponse.json(plans)
    } catch (err) {
        console.error('Error fetching plans:', err)
        return new NextResponse(
            JSON.stringify({ message: 'Error fetching plans' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

// POST /api/plans
export async function POST(req: Request) {
    try {
        const body = await req.json() as PlanInput
        const { name, description, type, duration, exercises } = body

        const plan = await prisma.plan.create({
            data: {
                name,
                description: description || null,
                type,
                duration,
                exercises: {
                    create: exercises.map((exercise, index) => ({
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
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(plan)
    } catch (err) {
        console.error('Error creating plan:', err)
        return new NextResponse(
            JSON.stringify({ message: 'Error creating plan', details: err }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 