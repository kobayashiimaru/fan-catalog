import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
        variant === 'success' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
        variant === 'warning' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
        variant === 'danger' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
        variant === 'info' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        className,
      )}
    >
      {children}
    </span>
  )
}
