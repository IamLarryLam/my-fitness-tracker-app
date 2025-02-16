/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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

// GET /api/plans/[id]
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const plan = await prisma.plan.findUnique({
            where: { id: params.id },
            include: {
                exercises: {
                    orderBy: [
                        { order: 'asc' as Prisma.SortOrder }
                    ]
                }
            }
        })

        if (!plan) {
            return new NextResponse(
                JSON.stringify({ message: 'Plan not found' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            )
        }

        return NextResponse.json(plan)
    } catch (err) {
        console.error('Error fetching plan:', err)
        return new NextResponse(
            JSON.stringify({ message: 'Error fetching plan' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

// PUT /api/plans/[id]
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json() as PlanInput
        const { name, description, type, duration, exercises } = body

        // Use a transaction to ensure data consistency
        const updatedPlan = await prisma.$transaction(async (tx) => {
            // Delete existing exercises
            await tx.exercise.deleteMany({
                where: { planId: params.id }
            })

            // Update plan with new exercises
            return tx.plan.update({
                where: { id: params.id },
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
                } as Prisma.PlanUpdateInput,
                include: {
                    exercises: {
                        orderBy: [
                            { order: 'asc' as Prisma.SortOrder }
                        ]
                    }
                }
            })
        })

        return NextResponse.json(updatedPlan)
    } catch (err) {
        console.error('Error updating plan:', err)
        return new NextResponse(
            JSON.stringify({ message: 'Error updating plan', details: err }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

// DELETE /api/plans/[id]
export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.plan.delete({
            where: { id: params.id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (err) {
        console.error('Error deleting plan:', err)
        return new NextResponse(
            JSON.stringify({ message: 'Error deleting plan' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 