'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './dashboard.module.css'

const mockData = [
  { date: 'Mon', workouts: 3, duration: 45 },
  { date: 'Tue', workouts: 2, duration: 60 },
  { date: 'Wed', workouts: 4, duration: 50 },
  { date: 'Thu', workouts: 1, duration: 30 },
  { date: 'Fri', workouts: 3, duration: 55 },
  { date: 'Sat', workouts: 5, duration: 75 },
  { date: 'Sun', workouts: 2, duration: 40 },
]

const workoutPlans = [
  { name: 'Full Body Strength', lastUsed: '2 days ago', frequency: 12 },
  { name: 'HIIT Cardio', lastUsed: '1 day ago', frequency: 8 },
  { name: 'Upper Body Focus', lastUsed: '5 days ago', frequency: 6 },
  { name: 'Core & Flexibility', lastUsed: 'Today', frequency: 4 },
]

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's your fitness overview</p>
        </div>
        <motion.button
          className={`${styles.newWorkoutBtn} glow-effect`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Workout
        </motion.button>
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
            <LineChart data={mockData}>
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

      <div className={styles.workoutPlans}>
        <div className={styles.plansHeader}>
          <h2 className={styles.sectionTitle}>Workout Plans</h2>
          <button className={styles.viewAllBtn}>View All</button>
        </div>
        <div className={styles.plansGrid}>
          {workoutPlans.map((plan) => (
            <motion.div
              key={plan.name}
              className={styles.planCard}
              whileHover={{ scale: 1.02 }}
            >
              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.planMeta}>Last used: {plan.lastUsed}</p>
              <p className={styles.planFreq}>Used {plan.frequency} times</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 