import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/plans
export async function GET() {
    try {
        const plans = await prisma.plan.findMany({
            include: {
                exercises: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json({ success: true, data: plans })
    } catch (error) {
        console.error('Error fetching plans:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch plans' },
            { status: 500 }
        )
    }
}

// POST /api/plans
export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate required fields
        if (!body.name || !body.type || !body.duration) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const plan = await prisma.plan.create({
            data: {
                name: body.name,
                description: body.description || '',
                type: body.type,
                duration: Number(body.duration),
                userId: body.userId,
                exercises: {
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

        return NextResponse.json({ success: true, data: plan })
    } catch (error) {
        console.error('Error creating plan:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create plan' },
            { status: 500 }
        )
    }
} 