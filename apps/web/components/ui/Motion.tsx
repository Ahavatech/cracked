'use client'

import { motion, type Variants } from 'framer-motion'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function MotionSection({
  children,
  className = '',
  id,
  ariaLabel
}: {
  children: React.ReactNode
  className?: string
  id?: string
  ariaLabel?: string
}) {
  return (
    <motion.section
      id={id}
      aria-label={ariaLabel}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  )
}

export function MotionDiv({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function MotionGrid({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div className={className} variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {children}
    </motion.div>
  )
}

export function MotionFade({
  children,
  className = '',
  ariaLabel
}: {
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}) {
  return (
    <motion.div
      aria-label={ariaLabel}
      className={className}
      variants={fadeIn}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
