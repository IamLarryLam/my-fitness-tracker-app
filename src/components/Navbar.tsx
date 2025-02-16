'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './Navbar.module.css'

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/workouts', label: 'Workouts' },
  { path: '/plans', label: 'Plans' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  if (pathname === '/') return null

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <motion.span
            className={styles.logoText}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            FitTrack
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.links}>
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={`${styles.link} ${pathname === path ? styles.active : ''}`}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {label}
              </motion.span>
            </Link>
          ))}
        </div>

        {/* Profile Dropdown */}
        <div className={styles.profile}>
          <motion.button
            className={styles.profileButton}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className={styles.avatar}>👤</span>
            <span className={styles.username}>User</span>
          </motion.button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                className={styles.profileDropdown}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Link href="/profile" className={styles.dropdownItem}>Profile</Link>
                <Link href="/settings" className={styles.dropdownItem}>Settings</Link>
                <button className={styles.dropdownItem}>Sign Out</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className={styles.mobileMenu}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween' }}
            >
              {navItems.map(({ path, label }) => (
                <Link
                  key={path}
                  href={path}
                  className={`${styles.mobileLink} ${pathname === path ? styles.active : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
} 