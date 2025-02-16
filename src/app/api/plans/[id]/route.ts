import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
                        { order: 'asc' }
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
    } catch (error) {
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
        const body = await req.json()
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
                },
                include: {
                    exercises: {
                        orderBy: [
                            { order: 'asc' }
                        ]
                    }
                }
            })
        })

        return NextResponse.json(updatedPlan)
    } catch (error) {
        console.error('Error updating plan:', error)
        return new NextResponse(
            JSON.stringify({ message: 'Error updating plan', details: error }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}

// DELETE /api/plans/[id]
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.plan.delete({
            where: { id: params.id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting plan:', error)
        return new NextResponse(
            JSON.stringify({ message: 'Error deleting plan' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 