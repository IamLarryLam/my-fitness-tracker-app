'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './workouts.module.css'

type WorkoutType = 'strength' | 'cardio' | 'flexibility'

interface Exercise {
  name: string
  sets: number
  reps: number
  weight: number
}

interface WorkoutForm {
  type: WorkoutType
  duration: number
  intensity: number
  mood: number
  notes: string
  exercises: Exercise[]
  planId?: string | null
}

interface ErrorMessage {
  message: string
  timestamp: number
}

const initialForm: WorkoutForm = {
  type: 'strength',
  duration: 30,
  intensity: 3,
  mood: 3,
  notes: '',
  exercises: [],
  planId: null,
}

export default function WorkoutTracker() {
  const router = useRouter()
  const [form, setForm] = useState<WorkoutForm>(initialForm)
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<ErrorMessage[]>([])

  const addError = (message: string) => {
    const newError = { message, timestamp: Date.now() }
    setErrors(prev => [...prev, newError])
    // Remove error after 5 seconds
    setTimeout(() => {
      setErrors(prev => prev.filter(e => e.timestamp !== newError.timestamp))
    }, 5000)
  }

  const handleAddExercise = () => {
    if (currentExercise.name) {
      setForm(prev => ({
        ...prev,
        exercises: [...prev.exercises, currentExercise],
      }))
      setCurrentExercise({ name: '', sets: 3, reps: 10, weight: 0 })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // First ensure the temporary user exists
      const setupResponse = await fetch('/api/setup')
      if (!setupResponse.ok) {
        throw new Error('Failed to setup temporary user')
      }

      if (form.exercises.length === 0) {
        throw new Error('Please add at least one exercise')
      }

      const workoutData = {
        type: form.type,
        duration: Number(form.duration),
        intensity: Number(form.intensity),
        mood: Number(form.mood),
        notes: form.notes,
        userId: 'temp-user-id',
        exercises: form.exercises.map(exercise => ({
          name: exercise.name,
          sets: Number(exercise.sets),
          reps: Number(exercise.reps),
          weight: Number(exercise.weight),
        })),
      }

      console.log('Sending workout data:', workoutData)

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Failed to parse error response'
        }))
        throw new Error(errorData.error || 'Failed to save workout')
      }

      const data = await response.json()
      console.log('Success response:', data)

      if (data.success) {
        router.push('/')
      } else {
        throw new Error('Failed to save workout')
      }
    } catch (error) {
      console.error('Error saving workout:', error)
      addError(error instanceof Error ? error.message : 'Failed to save workout')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {errors.map((error) => (
          <motion.div
            key={error.timestamp}
            className={styles.errorToast}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <p>{error.message}</p>
            <button
              onClick={() => setErrors(prev => prev.filter(e => e.timestamp !== error.timestamp))}
              className={styles.closeButton}
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header className={styles.header}>
          <h1 className={styles.title}>Log Workout</h1>
          <p className={styles.subtitle}>Track your progress and stay motivated</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
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

            <div className={styles.formGroup}>
              <label>Intensity (1-5)</label>
              <div className={styles.ratingGroup}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.ratingButton} ${form.intensity === value ? styles.active : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, intensity: value }))}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Mood (1-5)</label>
              <div className={styles.ratingGroup}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.ratingButton} ${form.mood === value ? styles.active : ''}`}
                    onClick={() => setForm(prev => ({ ...prev, mood: value }))}
                  >
                    {value}
                  </button>
                ))}
              </div>
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
                placeholder="Weight (kg)"
                value={currentExercise.weight}
                onChange={e => setCurrentExercise(prev => ({ ...prev, weight: Number(e.target.value) }))}
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
              {form.exercises.map((exercise, index) => (
                <motion.div
                  key={index}
                  className={styles.exerciseCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3>{exercise.name}</h3>
                  <p>
                    {exercise.sets} sets × {exercise.reps} reps
                    {exercise.weight > 0 ? ` @ ${exercise.weight}kg` : ''}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="How did it go? Any achievements or challenges?"
            />
          </div>

          <motion.button
            type="submit"
            className={`${styles.submitButton} glow-effect`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Log Workout'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
} 