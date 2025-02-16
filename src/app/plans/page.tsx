'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiPlus, FiEdit2, FiTrash2, FiClock, FiList } from 'react-icons/fi'
import styles from './plans.module.css'

interface WorkoutPlan {
  id: string
  name: string
  description: string
  type: 'strength' | 'cardio' | 'flexibility'
  duration: number
  exercises: Array<{
    id: string
    name: string
    sets?: number
    reps?: number
    duration?: number
    order: number
  }>
  createdAt: Date
  updatedAt: Date
}

export default function WorkoutPlans() {
  const router = useRouter()
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [planSort, setPlanSort] = useState<'name' | 'date'>('date')

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch('/api/plans')
        if (!response.ok) throw new Error('Failed to fetch plans')
        const data = await response.json()
        setPlans(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const sortedPlans = [...plans].sort((a, b) => {
    if (planSort === 'name') {
      return a.name.localeCompare(b.name)
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete plan')
      }
      
      // Remove plan from state
      setPlans(plans.filter(plan => plan.id !== planId))
    } catch (error) {
      console.error('Error deleting plan:', error)
      // You could add a toast notification here
    }
  }

  // Add edit handler
  const handleEditPlan = (planId: string) => {
    router.push(`/plans/${planId}/edit`)
  }

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
          <h1 className={styles.title}>Workout Plans</h1>
          <p className={styles.subtitle}>Browse and create workout routines</p>
        </div>
        <div className={styles.headerActions}>
          <motion.button
            className={styles.createButton}
            onClick={() => router.push('/plans/create')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus size={20} />
            <span>Create Plan</span>
          </motion.button>
        </div>
      </header>

      <div className={styles.planGrid}>
        {sortedPlans.map((plan) => (
          <motion.div
            key={plan.id}
            className={styles.planCard}
            onClick={() => router.push(`/plans/${plan.id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={styles.planHeader}>
              <h2>{plan.name}</h2>
              <div className={styles.planActions} onClick={e => e.stopPropagation()}>
                <motion.button
                  className={styles.iconButton}
                  onClick={() => handleEditPlan(plan.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiEdit2 size={18} />
                </motion.button>
                <motion.button
                  className={`${styles.iconButton} ${styles.deleteButton}`}
                  onClick={() => handleDeletePlan(plan.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiTrash2 size={18} />
                </motion.button>
              </div>
            </div>
            <p className={styles.planType}>{plan.type}</p>
            <p className={styles.planDescription}>{plan.description}</p>
            <div className={styles.planDetails}>
              <span>
                <FiClock size={16} />
                {plan.duration} minutes
              </span>
              <span>
                <FiList size={16} />
                {plan.exercises.length} exercises
              </span>
            </div>
            <motion.button
              className={styles.viewButton}
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/plans/${plan.id}`)
              }}
              whileHover={{ scale: 1.02 }}
            >
              View Details
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 