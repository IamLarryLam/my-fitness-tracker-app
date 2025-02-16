'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './plan.module.css'

interface Exercise {
  name: string
  sets?: number
  reps?: number
  duration?: number
}

interface WorkoutPlan {
  id: string
  name: string
  description: string
  type: 'strength' | 'cardio' | 'flexibility'
  duration: number
  exercises: Exercise[]
}

export default function PlanDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [plan, setPlan] = useState<WorkoutPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editedPlan, setEditedPlan] = useState<WorkoutPlan | null>(null)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/plans/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch plan')
        }
        const data = await response.json()
        setPlan(data)
        setEditedPlan(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load plan')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlan()
  }, [params.id])

  const handleEdit = async () => {
    if (!editedPlan) return

    try {
      const response = await fetch(`/api/plans/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPlan),
      })

      if (!response.ok) {
        throw new Error('Failed to update plan')
      }

      const updatedPlan = await response.json()
      setPlan(updatedPlan)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating plan:', error)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/plans/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete plan')
      }

      router.push('/plans')
    } catch (error) {
      console.error('Error deleting plan:', error)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error || 'Plan not found'}
          <button onClick={() => router.back()}>Go Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className={styles.header}>
          <div>
            <motion.button
              className={styles.backButton}
              onClick={() => router.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back
            </motion.button>
            {isEditing ? (
              <input
                type="text"
                value={editedPlan?.name}
                onChange={e => setEditedPlan(prev => prev ? { ...prev, name: e.target.value } : null)}
                className={styles.editInput}
              />
            ) : (
              <h1 className={styles.title}>{plan.name}</h1>
            )}
            <p className={styles.type}>{plan.type}</p>
          </div>
          <div className={styles.actions}>
            {isEditing ? (
              <>
                <motion.button
                  className={styles.cancelButton}
                  onClick={() => {
                    setIsEditing(false)
                    setEditedPlan(plan)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className={`${styles.saveButton} glow-effect`}
                  onClick={handleEdit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Changes
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit Plan
                </motion.button>
                <motion.button
                  className={styles.deleteButton}
                  onClick={() => setShowDeleteModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
                <motion.button
                  className={`${styles.startButton} glow-effect`}
                  onClick={() => router.push(`/workouts?planId=${plan.id}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Workout
                </motion.button>
              </>
            )}
          </div>
        </header>

        <div className={styles.details}>
          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span>Duration</span>
              <p>{plan.duration} minutes</p>
            </div>
            <div className={styles.infoItem}>
              <span>Exercises</span>
              <p>{plan.exercises.length} exercises</p>
            </div>
          </div>

          <div className={styles.description}>
            <h2>Description</h2>
            <p>{plan.description}</p>
          </div>

          <div className={styles.exercises}>
            <h2>Exercises</h2>
            <div className={styles.exerciseList}>
              {plan.exercises.map((exercise, index) => (
                <motion.div
                  key={index}
                  className={styles.exerciseCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3>{exercise.name}</h3>
                  <p>
                    {exercise.sets && exercise.reps
                      ? `${exercise.sets} sets × ${exercise.reps} reps`
                      : exercise.duration
                      ? `${exercise.duration} minutes`
                      : ''}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2>Delete Workout Plan</h2>
              <p>Are you sure you want to delete this workout plan? This action cannot be undone.</p>
              <div className={styles.modalActions}>
                <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button onClick={handleDelete} className={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 