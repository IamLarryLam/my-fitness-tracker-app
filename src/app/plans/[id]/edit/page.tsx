'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import PlanForm from '@/components/PlanForm'
import styles from '../../create/create.module.css'

interface Exercise {
  id: string
  name: string
  sets?: number | null
  reps?: number | null
  duration?: number | null
  order: number
}

interface Plan {
  id: string
  name: string
  description: string | null
  type: string
  duration: number
  exercises: Exercise[]
}

export default function EditPlan({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [plan, setPlan] = useState<Plan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const resolvedParams = use(params)

  useEffect(() => {
    async function fetchPlan() {
      try {
        const response = await fetch(`/api/plans/${resolvedParams.id}`)
        if (!response.ok) throw new Error('Failed to fetch plan')
        const data = await response.json()
        setPlan(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch plan')
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [resolvedParams.id])

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/plans/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          exercises: data.exercises.map((exercise: any, index: number) => ({
            ...exercise,
            order: index
          }))
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update plan')
      }

      router.push('/plans')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update plan')
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading...</div>
  }

  if (error) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Edit Workout Plan</h1>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
      </header>
      {plan && (
        <PlanForm
          initialData={{
            name: plan.name,
            description: plan.description || '',
            type: plan.type,
            duration: plan.duration,
            exercises: plan.exercises.map(e => ({
              name: e.name,
              sets: e.sets || undefined,
              reps: e.reps || undefined,
              duration: e.duration || undefined,
              order: e.order
            }))
          }}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      )}
    </div>
  )
} 