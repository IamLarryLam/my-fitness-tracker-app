'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import styles from './landing.module.css'

export default function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 25,
        y: (e.clientY - window.innerHeight / 2) / 25,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.title}>
            TRACK YOUR FITNESS
            <span className={styles.highlight}> JOURNEY</span>
          </h1>
          <p className={styles.subtitle}>
            Advanced workout tracking with stunning visualizations
          </p>
          <div className={styles.buttonGroup}>
            <motion.button
              className={`${styles.cta} glow-effect`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Tracking Now
            </motion.button>
            <motion.a
              href="/"
              className={`${styles.dashboardBtn} glow-effect`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Dashboard
            </motion.a>
          </div>
        </motion.div>

        {/* ... rest of the existing landing page code ... */}
      </section>
    </main>
  )
} 