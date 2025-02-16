'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import styles from './CreateHabitModal.module.css'

interface CreateHabitModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (habit: { name: string; goal: number }) => void
}

export default function CreateHabitModal({ isOpen, onClose, onSave }: CreateHabitModalProps) {
  const [habitName, setHabitName] = useState('')
  const [weeklyGoal, setWeeklyGoal] = useState(3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      name: habitName,
      goal: weeklyGoal
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
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
            <h2>Create New Habit</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Habit Name</label>
                <input
                  type="text"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g., Daily Workout"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Weekly Goal</label>
                <select
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'time' : 'times'} per week
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.actions}>
                <button type="button" onClick={onClose}>Cancel</button>
                <button type="submit" className={styles.primary}>Create Habit</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 