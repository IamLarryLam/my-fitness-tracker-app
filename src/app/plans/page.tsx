'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './plans.module.css'

interface WorkoutPlan {
  id: string
  name: string
  description: string
  type: 'strength' | 'cardio' | 'flexibility'
  duration: number
  exercises: Array<{
    name: string
    sets?: number
    reps?: number
    duration?: number
  }>
}

const mockPlans: WorkoutPlan[] = [
  {
    id: '1',
    name: 'Full Body Strength',
    description: 'Complete full body workout targeting all major muscle groups',
    type: 'strength',
    duration: 60,
    exercises: [
      { name: 'Squats', sets: 3, reps: 12 },
      { name: 'Bench Press', sets: 3, reps: 10 },
      { name: 'Deadlifts', sets: 3, reps: 8 },
      { name: 'Shoulder Press', sets: 3, reps: 10 },
      { name: 'Bent Over Rows', sets: 3, reps: 12 },
    ],
  },
  {
    id: '2',
    name: 'HIIT Cardio',
    description: 'High-intensity interval training for maximum calorie burn',
    type: 'cardio',
    duration: 30,
    exercises: [
      { name: 'Burpees', duration: 45 },
      { name: 'Mountain Climbers', duration: 45 },
      { name: 'Jump Rope', duration: 60 },
      { name: 'High Knees', duration: 45 },
      { name: 'Box Jumps', duration: 45 },
    ],
  },
  {
    id: '3',
    name: 'Core & Flexibility',
    description: 'Focus on core strength and overall flexibility',
    type: 'flexibility',
    duration: 45,
    exercises: [
      { name: 'Plank Hold', duration: 60 },
      { name: 'Russian Twists', sets: 3, reps: 20 },
      { name: 'Leg Raises', sets: 3, reps: 15 },
      { name: 'Yoga Flow Sequence', duration: 300 },
      { name: 'Stretching Routine', duration: 300 },
    ],
  },
  {
    id: '4',
    name: 'Upper Body Power',
    description: 'Intensive upper body workout focusing on strength and muscle development',
    type: 'strength',
    duration: 50,
    exercises: [
      { name: 'Pull-ups', sets: 4, reps: 8 },
      { name: 'Dips', sets: 4, reps: 10 },
      { name: 'Incline Bench Press', sets: 3, reps: 12 },
      { name: 'Lateral Raises', sets: 3, reps: 15 },
      { name: 'Face Pulls', sets: 3, reps: 15 },
      { name: 'Tricep Extensions', sets: 3, reps: 12 },
    ],
  },
  {
    id: '5',
    name: 'Endurance Builder',
    description: 'Long-duration cardio workout to improve stamina and endurance',
    type: 'cardio',
    duration: 75,
    exercises: [
      { name: 'Warm-up Jog', duration: 600 },
      { name: 'Interval Running', duration: 1200 },
      { name: 'Cycling', duration: 1200 },
      { name: 'Stair Climber', duration: 900 },
      { name: 'Cool-down Walk', duration: 600 },
    ],
  },
]

export default function WorkoutPlans() {
  const router = useRouter()
  const [plans] = useState<WorkoutPlan[]>(mockPlans)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Workout Plans</h1>
          <p className={styles.subtitle}>Create and manage your workout routines</p>
        </div>
        <motion.button
          className={`${styles.newButton} glow-effect`}
          onClick={() => router.push('/plans/create')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create New Plan
        </motion.button>
      </header>

      <div className={styles.planGrid}>
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            className={styles.planCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <h2>{plan.name}</h2>
            <p className={styles.planType}>{plan.type}</p>
            <p className={styles.planDescription}>{plan.description}</p>
            <div className={styles.planDetails}>
              <span>{plan.duration} minutes</span>
              <span>{plan.exercises.length} exercises</span>
            </div>
            <div className={styles.planActions}>
              <button onClick={() => router.push(`/plans/${plan.id}`)}>
                View Details
              </button>
              <button onClick={() => router.push(`/workouts?planId=${plan.id}`)}>
                Start Workout
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 