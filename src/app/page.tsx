'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './dashboard.module.css'

interface WorkoutStats {
  totalWorkouts: number
  activeMinutes: number
  caloriesBurned: number
  completionRate: number
}

export default function Home() {
  const router = useRouter()
  const [workouts, setWorkouts] = useState([])
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    activeMinutes: 0,
    caloriesBurned: 0,
    completionRate: 0,
  })

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts')
      const data = await response.json()
      setWorkouts(data)
      calculateStats(data)
    } catch (error) {
      console.error('Error fetching workouts:', error)
    }
  }

  const calculateStats = (workoutData: any[]) => {
    const total = workoutData.length
    const minutes = workoutData.reduce((acc, w) => acc + w.duration, 0)
    // You would need to implement proper calorie calculation based on workout type and intensity
    const calories = workoutData.reduce((acc, w) => acc + (w.duration * w.intensity * 10), 0)
    const completed = workoutData.filter(w => w.exercises.length > 0).length
    const rate = total > 0 ? (completed / total) * 100 : 0

    setStats({
      totalWorkouts: total,
      activeMinutes: minutes,
      caloriesBurned: calories,
      completionRate: Math.round(rate),
    })
  }

  const handleNewWorkout = () => {
    router.push('/workouts')
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's your fitness overview</p>
        </div>
        <div className={styles.headerActions}>
          <motion.a
            href="/landing"
            className={styles.landingLink}
          >
            View Landing Page
          </motion.a>
          <motion.button
            className={`${styles.newWorkoutBtn} glow-effect`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNewWorkout}
          >
            New Workout
          </motion.button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        {[
          { label: 'Total Workouts', value: '24', trend: '+3' },
          { label: 'Active Minutes', value: '355', trend: '+45' },
          { label: 'Calories Burned', value: '2,450', trend: '+320' },
          { label: 'Completion Rate', value: '85%', trend: '+5' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className={styles.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statTrend}>{stat.trend} this week</div>
          </motion.div>
        ))}
      </div>

      <div className={styles.chartSection}>
        <h2 className={styles.sectionTitle}>Weekly Activity</h2>
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={workouts}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--background-darker)',
                  border: '1px solid var(--accent-blue)',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="workouts"
                stroke="var(--accent-red)"
                strokeWidth={2}
                dot={{ fill: 'var(--accent-red)' }}
              />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="var(--accent-cyan)"
                strokeWidth={2}
                dot={{ fill: 'var(--accent-cyan)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  )
}
