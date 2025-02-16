import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/plans/[id]
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const plan = await prisma.plan.findUnique({
            where: {
                id: params.id,
            },
            include: {
                exercises: true,
            },
        })

        if (!plan) {
            return NextResponse.json(
                { success: false, error: 'Plan not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, data: plan })
    } catch (error) {
        console.error('Error fetching plan:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch plan' },
            { status: 500 }
        )
    }
}

// PUT /api/plans/[id]
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()

        // Validate required fields
        if (!body.name || !body.type || !body.duration) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const updatedPlan = await prisma.plan.update({
            where: {
                id: params.id,
            },
            data: {
                name: body.name,
                description: body.description,
                type: body.type,
                duration: Number(body.duration),
                exercises: {
                    deleteMany: {},  // Remove existing exercises
                    create: body.exercises.map((exercise: any) => ({
                        name: exercise.name,
                        sets: exercise.sets ? Number(exercise.sets) : null,
                        reps: exercise.reps ? Number(exercise.reps) : null,
                        duration: exercise.duration ? Number(exercise.duration) : null,
                    })),
                },
            },
            include: {
                exercises: true,
            },
        })

        return NextResponse.json({ success: true, data: updatedPlan })
    } catch (error) {
        console.error('Error updating plan:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update plan' },
            { status: 500 }
        )
    }
}

// DELETE /api/plans/[id]
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // First delete all exercises associated with the plan
        await prisma.exercise.deleteMany({
            where: {
                planId: params.id,
            },
        })

        // Then delete the plan
        await prisma.plan.delete({
            where: {
                id: params.id,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting plan:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete plan' },
            { status: 500 }
        )
    }
} 