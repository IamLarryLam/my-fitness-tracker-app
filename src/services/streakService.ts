import { addDays, differenceInDays, isWithinInterval, startOfDay } from 'date-fns'

export interface StreakData {
    currentStreak: number
    longestStreak: number
    lastWorkoutDate: Date | null
    weeklyProgress: number
    weeklyGoal: number
    nextMilestone: number
}

export class StreakService {
    private static GRACE_PERIOD_HOURS = 36 // 1.5 days grace period
    private static WEEKLY_WORKOUT_GOAL = 3 // Default goal: 3 workouts per week
    private static MILESTONE_LEVELS = [7, 30, 100, 365] // Streak milestones

    static calculateStreak(workouts: { date: Date | string }[]): StreakData {
        if (!workouts.length) {
            return {
                currentStreak: 0,
                longestStreak: 0,
                lastWorkoutDate: null,
                weeklyProgress: 0,
                weeklyGoal: this.WEEKLY_WORKOUT_GOAL,
                nextMilestone: this.MILESTONE_LEVELS[0]
            }
        }

        // Ensure all dates are Date objects
        const workoutsWithDates = workouts.map(workout => ({
            ...workout,
            date: workout.date instanceof Date ? workout.date : new Date(workout.date)
        }))

        const sortedWorkouts = [...workoutsWithDates].sort((a, b) =>
            b.date.getTime() - a.date.getTime()
        )

        const lastWorkout = sortedWorkouts[0].date
        const today = new Date()
        const daysSinceLastWorkout = differenceInDays(today, lastWorkout)

        // Check if streak is still active (within grace period)
        const isStreakActive = daysSinceLastWorkout <= (this.GRACE_PERIOD_HOURS / 24)

        // Calculate current streak
        let currentStreak = 0
        let currentDate = startOfDay(lastWorkout)

        for (const workout of sortedWorkouts) {
            const workoutDate = startOfDay(workout.date)
            const daysDiff = differenceInDays(currentDate, workoutDate)

            if (daysDiff <= 1) {
                currentStreak++
                currentDate = workoutDate
            } else {
                break
            }
        }

        if (!isStreakActive) {
            currentStreak = 0
        }

        // Calculate longest streak
        let longestStreak = currentStreak
        let tempStreak = 0
        let prevDate: Date | null = null

        for (const workout of sortedWorkouts) {
            const workoutDate = startOfDay(workout.date)

            if (!prevDate) {
                tempStreak = 1
            } else {
                const daysDiff = differenceInDays(prevDate, workoutDate)
                if (daysDiff <= 1) {
                    tempStreak++
                } else {
                    tempStreak = 1
                }
            }

            longestStreak = Math.max(longestStreak, tempStreak)
            prevDate = workoutDate
        }

        // Calculate weekly progress
        const weekStart = startOfDay(addDays(today, -7))
        const weeklyWorkouts = sortedWorkouts.filter(workout =>
            isWithinInterval(workout.date, { start: weekStart, end: today })
        )

        // Calculate next milestone
        const nextMilestone = this.MILESTONE_LEVELS.find(level => level > currentStreak) ??
            this.MILESTONE_LEVELS[this.MILESTONE_LEVELS.length - 1]

        return {
            currentStreak,
            longestStreak,
            lastWorkoutDate: lastWorkout,
            weeklyProgress: weeklyWorkouts.length,
            weeklyGoal: this.WEEKLY_WORKOUT_GOAL,
            nextMilestone
        }
    }

    static shouldAwardBadge(streak: number): string | null {
        if (streak >= 365) return '💎 Year Warrior'
        if (streak >= 100) return '🏆 Century Club'
        if (streak >= 30) return '🔥 Monthly Master'
        if (streak >= 7) return '⭐ Week Champion'
        return null
    }

    static async updateStreak(userId: string, workout: WorkoutLog): Promise<{
        streakUpdated: boolean
        newBadge: string | null
        streakData: StreakData
    }> {
        // Get current streak data
        const currentStreak = await this.getCurrentStreak(userId)

        // Check if this workout should count towards streak
        const shouldCount = this.shouldCountForStreak(workout.date, currentStreak.lastWorkoutDate)

        if (shouldCount) {
            const updatedStreak = await this.incrementStreak(userId)
            const newBadge = this.shouldAwardBadge(updatedStreak.currentStreak)

            // If milestone reached, trigger notification
            if (newBadge) {
                await this.triggerMilestoneNotification(userId, newBadge)
            }

            return {
                streakUpdated: true,
                newBadge,
                streakData: updatedStreak
            }
        }

        return {
            streakUpdated: false,
            newBadge: null,
            streakData: currentStreak
        }
    }

    private static shouldCountForStreak(workoutDate: Date, lastWorkoutDate: Date | null): boolean {
        if (!lastWorkoutDate) return true

        const daysSinceLastWorkout = differenceInDays(workoutDate, lastWorkoutDate)
        return daysSinceLastWorkout <= this.GRACE_PERIOD_HOURS / 24
    }
} 