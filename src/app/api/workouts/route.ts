import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

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
        return NextResponse.json(workouts)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching workouts' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        console.log('Request headers:', Object.fromEntries(request.headers))
        console.log('Request method:', request.method)

        // Check if request can be read
        const clonedRequest = request.clone()
        const rawBody = await clonedRequest.text()
        console.log('Raw request body:', rawBody)

        // Add validation for request body
        if (!rawBody) {
            return NextResponse.json(
                { success: false, error: 'Request body is empty' },
                { status: 400 }
            )
        }

        const body = JSON.parse(rawBody)

        // Validate that body is an object
        if (!body || typeof body !== 'object') {
            return NextResponse.json(
                { success: false, error: 'Invalid request payload format' },
                { status: 400 }
            )
        }

        console.log('Received workout data:', body)

        // Validate required fields
        if (!body.type || !body.duration || !body.intensity || !body.mood) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate exercises
        if (!body.exercises || body.exercises.length === 0) {
            return NextResponse.json(
                { success: false, error: 'At least one exercise is required' },
                { status: 400 }
            )
        }

        const workout = await prisma.workout.create({
            data: {
                type: body.type,
                duration: Number(body.duration),
                intensity: Number(body.intensity),
                mood: Number(body.mood),
                notes: body.notes || '',
                userId: body.userId,
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
        // Improve error handling for JSON parsing errors
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