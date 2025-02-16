'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PlanForm from '@/components/PlanForm'
import styles from './create.module.css'

export default function CreatePlan() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create plan')
      }

      router.push('/plans')
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create plan')
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Create New Workout Plan</h1>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
      </header>
      <PlanForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </div>
  )
} 