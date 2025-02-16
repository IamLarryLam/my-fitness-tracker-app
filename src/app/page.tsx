'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './landing.module.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useState } from 'react'

const mockData = [
  { date: 'Mon', workouts: 3, duration: 45 },
  { date: 'Tue', workouts: 2, duration: 60 },
  { date: 'Wed', workouts: 4, duration: 50 },
  { date: 'Thu', workouts: 1, duration: 30 },
  { date: 'Fri', workouts: 3, duration: 55 },
  { date: 'Sat', workouts: 5, duration: 75 },
  { date: 'Sun', workouts: 2, duration: 40 },
]

function DumbbellModel() {
  return (
    <mesh>
      <cylinderGeometry args={[0.5, 0.5, 4, 32]} />
      <meshStandardMaterial color="#3366ff" metalness={0.8} roughness={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <ambientLight intensity={0.5} />
    </mesh>
  )
}

const features = [
  {
    icon: '📊',
    title: 'Advanced Analytics',
    description: 'Track your progress with interactive charts, weekly/monthly views, and detailed statistics.',
  },
  {
    icon: '🎯',
    title: 'Customizable Workout Plans',
    description: 'Create, manage, and follow personalized workout plans with detailed exercise tracking.',
  },
  {
    icon: '📱',
    title: 'Intuitive Workout Logging',
    description: 'Log workouts effortlessly with our modern interface, tracking sets, reps, and duration.',
  },
  {
    icon: '🔥',
    title: 'Performance Metrics',
    description: 'Monitor calories burned, active minutes, and completion rates for every workout.',
  },
  {
    icon: '📈',
    title: 'Progress Visualization',
    description: 'View your fitness journey through interactive line and bar charts with customizable views.',
  },
  {
    icon: '🗂️',
    title: 'Workout History',
    description: 'Access your complete workout history and track long-term progress over time.',
  },
]

// Add these variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const scaleVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
}

// Add testimonials data
const testimonials = [
  {
    quote: "FitTrack has completely transformed how I manage my workouts. The analytics are incredible!",
    author: "Sarah J.",
    role: "Fitness Enthusiast",
    avatar: "/avatars/sarah.jpg"
  },
  {
    quote: "The best fitness tracking app I've used. Clean interface and powerful features.",
    author: "Mike R.",
    role: "Personal Trainer",
    avatar: "/avatars/mike.jpg"
  },
  {
    quote: "Love how easy it is to track progress and stay motivated with the visual charts.",
    author: "Emma L.",
    role: "CrossFit Athlete",
    avatar: "/avatars/emma.jpg"
  }
]

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className={styles.title}
            variants={itemVariants}
          >
            Transform Your Fitness Journey with{' '}
            <motion.span
              className={styles.gradient}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ backgroundSize: '200% 100%' }}
            >
              FitTrack
            </motion.span>
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            variants={itemVariants}
          >
            A modern fitness tracking platform with advanced analytics, customizable workout plans,
            and detailed progress monitoring.
          </motion.p>
          <motion.div
            className={styles.cta}
            variants={itemVariants}
          >
            <motion.div
              variants={scaleVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link href="/dashboard" className={`${styles.ctaButton} glow-effect`}>
                Start Your Journey
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            className={styles.statsPreview}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/dashboard-preview.png"
              alt="FitTrack Dashboard"
              className={styles.previewImage}
            />
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        className={styles.features}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Powerful Features for Your Fitness Goals
        </motion.h2>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={styles.featureCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              }}
            >
              <motion.div
                className={styles.featureIcon}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                {feature.icon}
              </motion.div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section className={styles.metrics}>
        <div className={styles.metricsContent}>
          <motion.div
            className={styles.metricsGrid}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.metricCard}>
              <h3>10K+</h3>
              <p>Active Users</p>
            </div>
            <div className={styles.metricCard}>
              <h3>500K+</h3>
              <p>Workouts Tracked</p>
            </div>
            <div className={styles.metricCard}>
              <h3>98%</h3>
              <p>User Satisfaction</p>
            </div>
            <div className={styles.metricCard}>
              <h3>24/7</h3>
              <p>Support</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>Loved by Fitness Enthusiasts</h2>
        <div className={styles.testimonialGrid}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              className={styles.testimonialCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.testimonialContent}>
                <p>"{testimonial.quote}"</p>
                <div className={styles.testimonialAuthor}>
                  <img src={testimonial.avatar} alt={testimonial.author} />
                  <div>
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <motion.div
          className={styles.ctaContent}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Ready to Transform Your Fitness Journey?</h2>
          <p>
            Join FitTrack today and experience a modern approach to fitness tracking
            and workout management.
          </p>
          <Link href="/dashboard" className={`${styles.ctaButton} glow-effect`}>
            Get Started Now
          </Link>
        </motion.div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>FitTrack</span>
            <p>Your modern fitness companion</p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h4>Product</h4>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/workouts">Workouts</Link>
              <Link href="/plans">Plans</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4>Company</h4>
              <Link href="/about">About</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4>Connect</h4>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="mailto:support@fittrack.com">Contact</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 FitTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
