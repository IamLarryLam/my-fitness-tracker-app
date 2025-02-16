import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { FiMoreVertical } from 'react-icons/fi'
import styles from './PlanForm.module.css'

interface Exercise {
  name: string
  sets?: number
  reps?: number
  duration?: number
  order: number
}

interface SortableExerciseProps {
  id: string
  exercise: Exercise
  index: number
  formType: string
  onUpdate: (index: number, field: string, value: string | number) => void
  onRemove: (index: number) => void
}

export function SortableExercise({ id, exercise, index, formType, onUpdate, onRemove }: SortableExerciseProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`${styles.exercise} ${isDragging ? styles.dragging : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div {...attributes} {...listeners} className={styles.dragHandle}>
        <FiMoreVertical size={20} />
      </div>
      <div className={styles.exerciseFields}>
        <input
          type="text"
          placeholder="Exercise name"
          value={exercise.name}
          onChange={e => onUpdate(index, 'name', e.target.value)}
          required
        />
        {formType === 'cardio' ? (
          <input
            type="number"
            placeholder="Duration (seconds)"
            value={exercise.duration || ''}
            onChange={e => onUpdate(index, 'duration', Number(e.target.value))}
            min="1"
            required
          />
        ) : (
          <>
            <input
              type="number"
              placeholder="Sets"
              value={exercise.sets || ''}
              onChange={e => onUpdate(index, 'sets', Number(e.target.value))}
              min="1"
              required
            />
            <input
              type="number"
              placeholder="Reps"
              value={exercise.reps || ''}
              onChange={e => onUpdate(index, 'reps', Number(e.target.value))}
              min="1"
              required
            />
          </>
        )}
      </div>
      <button
        type="button"
        className={styles.removeButton}
        onClick={() => onRemove(index)}
      >
        ×
      </button>
    </motion.div>
  )
} 