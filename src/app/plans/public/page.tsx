'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './public.module.css'

export default function PublicPlans() {
  const router = useRouter()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPublicPlans() {
      try {
        const response = await fetch('/api/plans?public=true')
        if (!response.ok) throw new Error('Failed to fetch public plans')
        const data = await response.json()
        setPlans(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicPlans()
  }, [])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>Loading...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Community Workout Plans</h1>
          <p className={styles.subtitle}>Discover plans shared by the community</p>
        </div>
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
            <p className={styles.creator}>Created by {plan.user.name}</p>
            <div className={styles.planDetails}>
              <span>{plan.duration} minutes</span>
              <span>{plan.exercises.length} exercises</span>
            </div>
            <div className={styles.planActions}>
              <button onClick={() => router.push(`/plans/${plan.id}`)}>
                View Details
              </button>
              <button onClick={() => router.push(`/workouts?planId=${plan.id}`)}>
                Try Workout
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 