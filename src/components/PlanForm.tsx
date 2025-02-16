'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableExercise } from './SortableExercise'
import styles from './PlanForm.module.css'

interface Exercise {
  name: string
  sets?: number
  reps?: number
  duration?: number
  order: number
}

interface PlanFormProps {
  initialData?: {
    name: string
    description: string
    type: string
    duration: number
    exercises: Exercise[]
  }
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
}

export default function PlanForm({ initialData, onSubmit, onCancel }: PlanFormProps) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    type: 'strength',
    duration: 45,
    exercises: [{
      name: '',
      sets: 3,
      reps: 12,
      order: 0
    }]
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        formData.type === 'cardio'
          ? { name: '', duration: 60, order: prev.exercises.length }
          : { name: '', sets: 3, reps: 12, order: prev.exercises.length },
      ],
    }))
  }

  const removeExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }))
  }

  const updateExercise = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) =>
        i === index ? {
          ...exercise,
          [field]: value === '' ? null : value
        } : exercise
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = parseInt(active.id)
        const newIndex = parseInt(over.id)

        return {
          ...prev,
          exercises: arrayMove(prev.exercises, oldIndex, newIndex).map((exercise, index) => ({
            ...exercise,
            order: index
          }))
        }
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formContent}>
        <div className={styles.formGroup}>
          <label>Plan Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={e => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
              min="1"
              required
            />
          </div>
        </div>

        <div className={styles.exercises}>
          <h3>Exercises</h3>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={formData.exercises.map((_, index) => index.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div className={styles.exerciseList}>
                {formData.exercises.map((exercise, index) => (
                  <SortableExercise
                    key={index}
                    id={index.toString()}
                    exercise={exercise}
                    index={index}
                    formType={formData.type}
                    onUpdate={updateExercise}
                    onRemove={removeExercise}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <button
            type="button"
            className={styles.addButton}
            onClick={addExercise}
          >
            Add Exercise
          </button>
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
        >
          Save Changes
        </button>
      </div>
    </form>
  )
} 