import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface Exercise {
    name: string
    sets: number
    reps: number
    weight: number
}

interface WorkoutData {
    type: string
    duration: number
    intensity: number
    mood: number
    notes?: string
    userId: string
    exercises: Exercise[]
}

export async function GET() {
    try {
        const workouts = await prisma.workout.findMany({
            include: {
                exercises: true,
                plan: true,
            },
            orderBy: {
                date: 'desc',
            },
        })
        return NextResponse.json({ success: true, data: workouts })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: 'Error fetching workouts'
        }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        console.log('Request headers:', Object.fromEntries(request.headers))
        console.log('Request method:', request.method)

        const clonedRequest = request.clone()
        const rawBody = await clonedRequest.text()
        console.log('Raw request body:', rawBody)

        if (!rawBody) {
            return NextResponse.json(
                { success: false, error: 'Request body is empty' },
                { status: 400 }
            )
        }

        const body = JSON.parse(rawBody) as WorkoutData

        if (!body || typeof body !== 'object') {
            return NextResponse.json(
                { success: false, error: 'Invalid request payload format' },
                { status: 400 }
            )
        }

        // First verify the user exists
        const user = await prisma.user.findUnique({
            where: {
                id: body.userId
            }
        })

        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'User not found'
            }, { status: 404 })
        }

        const workout = await prisma.workout.create({
            data: {
                type: body.type,
                duration: Number(body.duration),
                intensity: Number(body.intensity),
                mood: Number(body.mood),
                notes: body.notes || '',
                userId: body.userId, // Direct assignment instead of connect
                exercises: {
                    create: body.exercises.map(exercise => ({
                        name: exercise.name,
                        sets: Number(exercise.sets),
                        reps: Number(exercise.reps),
                        weight: Number(exercise.weight),
                    }))
                }
            },
            include: {
                exercises: true,
            },
        })

        return NextResponse.json({
            success: true,
            data: workout
        })

    } catch (error) {
        if (error instanceof SyntaxError) {
            return NextResponse.json({
                success: false,
                error: 'Invalid JSON in request body'
            }, { status: 400 })
        }

        console.error('Error processing request:', error)

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002':
                    return NextResponse.json({
                        success: false,
                        error: 'A unique constraint would be violated.'
                    }, { status: 409 })
                case 'P2003':
                    return NextResponse.json({
                        success: false,
                        error: 'Foreign key constraint failed.'
                    }, { status: 400 })
                default:
                    return NextResponse.json({
                        success: false,
                        error: `Database error: ${error.message}`
                    }, { status: 500 })
            }
        }

        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to save workout'
        }, { status: 500 })
    }
} 