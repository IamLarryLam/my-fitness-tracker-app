'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import styles from './StreakCard.module.css'
import type { StreakData } from '@/services/streakService'

interface StreakCardProps {
  streak: StreakData
  onStreakClick?: () => void
}

export default function StreakCard({ streak, onStreakClick }: StreakCardProps) {
  const progressPercentage = (streak.weeklyProgress / streak.weeklyGoal) * 100

  return (
    <motion.div 
      className={styles.streakCard}
      whileHover={{ scale: 1.02 }}
      onClick={onStreakClick}
    >
      <div className={styles.streakHeader}>
        <h3>Current Streak</h3>
        <motion.div 
          className={styles.streakCount}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          🔥 {streak.currentStreak} days
        </motion.div>
      </div>

      <div className={styles.streakInfo}>
        <div className={styles.infoItem}>
          <span>Longest Streak</span>
          <strong>{streak.longestStreak} days</strong>
        </div>
        <div className={styles.infoItem}>
          <span>Last Workout</span>
          <strong>
            {streak.lastWorkoutDate 
              ? format(streak.lastWorkoutDate, 'MMM d, yyyy')
              : 'No workouts yet'}
          </strong>
        </div>
      </div>

      <div className={styles.weeklyProgress}>
        <div className={styles.progressLabel}>
          <span>Weekly Goal</span>
          <span>{streak.weeklyProgress}/{streak.weeklyGoal} workouts</span>
        </div>
        <div className={styles.progressBar}>
          <motion.div 
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className={styles.nextMilestone}>
        <span>Next Milestone</span>
        <strong>{streak.nextMilestone} days</strong>
        <small>{streak.nextMilestone - streak.currentStreak} days to go!</small>
      </div>
    </motion.div>
  )
} 