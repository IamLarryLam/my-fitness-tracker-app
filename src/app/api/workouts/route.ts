import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
        const body = await request.json()
        const workout = await prisma.workout.create({
            data: {
                type: body.type,
                duration: body.duration,
                intensity: body.intensity,
                mood: body.mood,
                notes: body.notes,
                userId: body.userId, // You'll need to implement authentication
                exercises: {
                    create: body.exercises,
                },
                planId: body.planId,
            },
            include: {
                exercises: true,
            },
        })
        return NextResponse.json(workout)
    } catch (error) {
        return NextResponse.json({ error: 'Error creating workout' }, { status: 500 })
    }
} 