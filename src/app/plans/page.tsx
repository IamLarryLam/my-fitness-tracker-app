'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import styles from './plans.module.css'

interface Exercise {
  name: string
  sets: number
  reps: number
  restTime: number
}

interface WorkoutPlan {
  name: string
  description: string
  type: 'strength' | 'cardio' | 'flexibility'
  duration: number
  exercises: Exercise[]
}

const initialPlan: WorkoutPlan = {
  name: '',
  description: '',
  type: 'strength',
  duration: 45,
  exercises: [],
}

export default function WorkoutPlans() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlan>(initialPlan)
  const [isCreating, setIsCreating] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: '',
    sets: 3,
    reps: 10,
    restTime: 60,
  })

  const handleAddExercise = () => {
    if (currentExercise.name) {
      setCurrentPlan(prev => ({
        ...prev,
        exercises: [...prev.exercises, currentExercise],
      }))
      setCurrentExercise({ name: '', sets: 3, reps: 10, restTime: 60 })
    }
  }

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...currentPlan,
          userId: 'user-id', // You'll need to implement authentication
        }),
      })
      
      if (response.ok) {
        const newPlan = await response.json()
        setPlans(prev => [...prev, newPlan])
        setCurrentPlan(initialPlan)
        setIsCreating(false)
      }
    } catch (error) {
      console.error('Error creating plan:', error)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Workout Plans</h1>
          <p className={styles.subtitle}>Create and manage your workout routines</p>
        </div>
        <motion.button
          className={`${styles.createButton} glow-effect`}
          onClick={() => setIsCreating(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create New Plan
        </motion.button>
      </header>

      {isCreating ? (
        <motion.div
          className={styles.createForm}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleCreatePlan}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Plan Name</label>
                <input
                  type="text"
                  value={currentPlan.name}
                  onChange={e => setCurrentPlan(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Full Body Strength"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={currentPlan.description}
                  onChange={e => setCurrentPlan(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your workout plan"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Type</label>
                <div className={styles.typeSelector}>
                  {['strength', 'cardio', 'flexibility'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`${styles.typeButton} ${currentPlan.type === type ? styles.active : ''}`}
                      onClick={() => setCurrentPlan(prev => ({ ...prev, type: type as WorkoutPlan['type'] }))}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  value={currentPlan.duration}
                  onChange={e => setCurrentPlan(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  min="1"
                />
              </div>
            </div>

            <div className={styles.exerciseSection}>
              <h2 className={styles.sectionTitle}>Exercises</h2>
              <div className={styles.exerciseForm}>
                <input
                  type="text"
                  placeholder="Exercise name"
                  value={currentExercise.name}
                  onChange={e => setCurrentExercise(prev => ({ ...prev, name: e.target.value }))}
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={currentExercise.sets}
                  onChange={e => setCurrentExercise(prev => ({ ...prev, sets: Number(e.target.value) }))}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={currentExercise.reps}
                  onChange={e => setCurrentExercise(prev => ({ ...prev, reps: Number(e.target.value) }))}
                />
                <input
                  type="number"
                  placeholder="Rest (seconds)"
                  value={currentExercise.restTime}
                  onChange={e => setCurrentExercise(prev => ({ ...prev, restTime: Number(e.target.value) }))}
                />
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={handleAddExercise}
                >
                  Add
                </button>
              </div>

              <div className={styles.exerciseList}>
                {currentPlan.exercises.map((exercise, index) => (
                  <motion.div
                    key={index}
                    className={styles.exerciseCard}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h3>{exercise.name}</h3>
                    <p>
                      {exercise.sets} sets × {exercise.reps} reps
                      <br />
                      Rest: {exercise.restTime}s
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                className={`${styles.saveButton} glow-effect`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save Plan
              </motion.button>
            </div>
          </form>
        </motion.div>
      ) : (
        <div className={styles.planGrid}>
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={styles.planCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h2 className={styles.planName}>{plan.name}</h2>
              <p className={styles.planDescription}>{plan.description}</p>
              <div className={styles.planMeta}>
                <span>{plan.type}</span>
                <span>{plan.duration} min</span>
                <span>{plan.exercises.length} exercises</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
} 