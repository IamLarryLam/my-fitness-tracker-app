'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import styles from './dashboard.module.css'
import StreakCard from '@/components/StreakCard'
import { StreakService } from '@/services/streakService'

const mockData = {
  weekly: [
    { date: new Date('2024-03-11'), workouts: 3, duration: 45, calories: 450 },
    { date: new Date('2024-03-12'), workouts: 2, duration: 60, calories: 600 },
    { date: new Date('2024-03-13'), workouts: 4, duration: 50, calories: 500 },
    { date: new Date('2024-03-14'), workouts: 1, duration: 30, calories: 300 },
    { date: new Date('2024-03-15'), workouts: 3, duration: 55, calories: 550 },
    { date: new Date('2024-03-16'), workouts: 5, duration: 75, calories: 750 },
    { date: new Date('2024-03-17'), workouts: 2, duration: 40, calories: 400 },
  ],
  monthly: [
    { date: new Date('2024-02-25'), workouts: 15, duration: 350, calories: 3500 },
    { date: new Date('2024-03-03'), workouts: 18, duration: 420, calories: 4200 },
    { date: new Date('2024-03-10'), workouts: 12, duration: 280, calories: 2800 },
    { date: new Date('2024-03-17'), workouts: 20, duration: 460, calories: 4600 },
  ],
}

const mockPlans = [
  {
    id: '1',
    name: 'Full Body Strength',
    type: 'strength',
    lastUsed: '2024-03-10',
    completion: 85,
  },
  {
    id: '2',
    name: 'HIIT Cardio',
    type: 'cardio',
    lastUsed: '2024-03-12',
    completion: 92,
  },
  {
    id: '3',
    name: 'Yoga Flow',
    type: 'flexibility',
    lastUsed: '2024-03-08',
    completion: 78,
  },
]

export default function Dashboard() {
  const router = useRouter()
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly')
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const [planSort, setPlanSort] = useState<'name' | 'lastUsed' | 'completion'>('lastUsed')
  const [workouts] = useState(mockData[timeframe])
  const streak = StreakService.calculateStreak(workouts)
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [currentBadge, setCurrentBadge] = useState<string | null>(null)

  useEffect(() => {
    // Check for new badges when streak updates
    const badge = StreakService.shouldAwardBadge(streak.currentStreak)
    if (badge) {
      setCurrentBadge(badge)
      setShowMilestoneModal(true)
    }
  }, [streak.currentStreak])

  const sortedPlans = [...mockPlans].sort((a, b) => {
    switch (planSort) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'lastUsed':
        return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
      case 'completion':
        return b.completion - a.completion
      default:
        return 0
    }
  })

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Track your fitness journey</p>
        </div>
        <div className={styles.headerButtons}>
          <motion.button
            className={`${styles.actionButton} glow-effect`}
            onClick={() => router.push('/workouts')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log Workout
          </motion.button>
          <motion.button
            className={`${styles.actionButton} glow-effect`}
            onClick={() => router.push('/plans')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Workout Plans
          </motion.button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <StreakCard 
          streak={streak}
          onStreakClick={() => {
            // Could open detailed streak view
          }}
        />
        <motion.div
          className={styles.statsGroup}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[
            { 
              title: 'Total Workouts', 
              value: '28', 
              icon: '🏋️',
              trend: '+5 this week',
              color: 'var(--accent-red)'
            },
            { 
              title: 'Active Minutes', 
              value: '1,240', 
              icon: '⏱️',
              trend: '+180 min',
              color: 'var(--accent-cyan)'
            },
            { 
              title: 'Calories Burned', 
              value: '12,450', 
              icon: '🔥',
              trend: '+1,200 kcal',
              color: 'var(--accent-blue)'
            },
            { 
              title: 'Completion Rate', 
              value: '85%', 
              icon: '📈',
              trend: '+5% vs last week',
              color: 'var(--accent-green)'
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className={styles.statCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ '--stat-color': stat.color } as React.CSSProperties}
            >
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statInfo}>
                <h3>{stat.title}</h3>
                <p className={styles.statValue}>{stat.value}</p>
                <span className={styles.statTrend}>{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h2 className={styles.sectionTitle}>Activity Overview</h2>
          <div className={styles.chartControls}>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.controlButton} ${timeframe === 'weekly' ? styles.active : ''}`}
                onClick={() => setTimeframe('weekly')}
              >
                Weekly
              </button>
              <button
                className={`${styles.controlButton} ${timeframe === 'monthly' ? styles.active : ''}`}
                onClick={() => setTimeframe('monthly')}
              >
                Monthly
              </button>
            </div>
            <div className={styles.buttonGroup}>
              <button
                className={`${styles.controlButton} ${chartType === 'line' ? styles.active : ''}`}
                onClick={() => setChartType('line')}
              >
                Line
              </button>
              <button
                className={`${styles.controlButton} ${chartType === 'bar' ? styles.active : ''}`}
                onClick={() => setChartType('bar')}
              >
                Bar
              </button>
            </div>
          </div>
        </div>

        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'line' ? (
              <LineChart data={mockData[timeframe]}>
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
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="var(--accent-blue)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--accent-blue)' }}
                />
              </LineChart>
            ) : (
              <BarChart data={mockData[timeframe]}>
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
                <Bar dataKey="workouts" fill="var(--accent-red)" />
                <Bar dataKey="duration" fill="var(--accent-cyan)" />
                <Bar dataKey="calories" fill="var(--accent-blue)" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.plansSection}>
        <div className={styles.plansHeader}>
          <h2 className={styles.sectionTitle}>Your Workout Plans</h2>
          <div className={styles.sortControls}>
            <label>Sort by:</label>
            <select
              value={planSort}
              onChange={(e) => setPlanSort(e.target.value as typeof planSort)}
              className={styles.sortSelect}
            >
              <option value="lastUsed">Last Used</option>
              <option value="name">Name</option>
              <option value="completion">Completion Rate</option>
            </select>
          </div>
        </div>

        <div className={styles.plansList}>
          {sortedPlans.map((plan) => (
            <motion.div
              key={plan.id}
              className={styles.planCard}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(`/plans/${plan.id}`)}
            >
              <div className={styles.planInfo}>
                <h3>{plan.name}</h3>
                <p className={styles.planType}>{plan.type}</p>
              </div>
              <div className={styles.planStats}>
                <div className={styles.planStat}>
                  <span>Last Used</span>
                  <p>{new Date(plan.lastUsed).toLocaleDateString()}</p>
                </div>
                <div className={styles.planStat}>
                  <span>Completion</span>
                  <p>{plan.completion}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showMilestoneModal && currentBadge && (
        <motion.div
          className={styles.milestoneModal}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <h2>🎉 New Achievement!</h2>
          <div className={styles.badgeDisplay}>
            {currentBadge}
          </div>
          <p>Keep up the great work!</p>
          <button onClick={() => setShowMilestoneModal(false)}>
            Continue
          </button>
        </motion.div>
      )}
    </main>
  )
} 