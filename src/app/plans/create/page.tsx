'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './create.module.css'

type WorkoutType = 'strength' | 'cardio' | 'flexibility'

interface Exercise {
  name: string
  sets?: number
  reps?: number
  duration?: number
}

interface PlanForm {
  name: string
  description: string
  type: WorkoutType
  duration: number
  exercises: Exercise[]
}

const initialForm: PlanForm = {
  name: '',
  description: '',
  type: 'strength',
  duration: 60,
  exercises: [],
}

export default function CreatePlan() {
  const router = useRouter()
  const [form, setForm] = useState<PlanForm>(initialForm)
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: '',
    sets: 3,
    reps: 10,
  })

  const handleAddExercise = () => {
    if (!currentExercise.name.trim()) return
    setForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, currentExercise],
    }))
    setCurrentExercise({ name: '', sets: 3, reps: 10 })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          userId: 'temp-user-id',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create plan')
      }

      router.push('/plans')
    } catch (error) {
      console.error('Error creating plan:', error)
    }
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className={styles.header}>
          <h1 className={styles.title}>Create Workout Plan</h1>
          <p className={styles.subtitle}>Design your perfect workout routine</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Plan Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Full Body Strength"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Workout Type</label>
              <div className={styles.typeSelector}>
                {['strength', 'cardio', 'flexibility'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`${styles.typeButton} ${form.type === type ? styles.active : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, type: type as WorkoutType }))}
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
                value={form.duration}
                onChange={e => setForm(prev => ({ ...prev, duration: Number(e.target.value) }))}
                min="1"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your workout plan..."
              required
            />
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
              {form.type === 'strength' && (
                <>
                  <input
                    type="number"
                    placeholder="Sets"
                    value={currentExercise.sets}
                    onChange={e => setCurrentExercise(prev => ({ ...prev, sets: Number(e.target.value) }))}
                    min="1"
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={currentExercise.reps}
                    onChange={e => setCurrentExercise(prev => ({ ...prev, reps: Number(e.target.value) }))}
                    min="1"
                  />
                </>
              )}
              {form.type === 'cardio' && (
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={currentExercise.duration}
                  onChange={e => setCurrentExercise(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  min="1"
                />
              )}
              <button
                type="button"
                className={styles.addButton}
                onClick={handleAddExercise}
              >
                Add Exercise
              </button>
            </div>

            <div className={styles.exerciseList}>
              {form.exercises.map((exercise, index) => (
                <motion.div
                  key={index}
                  className={styles.exerciseCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3>{exercise.name}</h3>
                  <p>
                    {exercise.sets && exercise.reps
                      ? `${exercise.sets} sets × ${exercise.reps} reps`
                      : exercise.duration
                      ? `${exercise.duration} minutes`
                      : ''}
                  </p>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => setForm(prev => ({
                      ...prev,
                      exercises: prev.exercises.filter((_, i) => i !== index)
                    }))}
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <motion.button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.back()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className={`${styles.submitButton} glow-effect`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Plan
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
} 