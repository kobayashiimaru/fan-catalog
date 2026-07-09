import type { SVGProps } from 'react'

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']

export function getFanColor(index: number): string {
  return COLORS[index % COLORS.length]
}

export function AxialFanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={angle}
          x1="50"
          y1="50"
          x2={50 + 35 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 35 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="2"
        />
      ))}
      <path d="M50 10 A40 40 0 0 1 85 35" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
    </svg>
  )
}

export function CentrifugalFanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="12" fill="currentColor" opacity="0.3" />
      <circle cx="50" cy="50" r="6" fill="currentColor" />
      <path d="M50 50 C50 30, 70 20, 75 35 C80 50, 65 60, 55 55" fill="currentColor" opacity="0.5" />
      <path d="M50 50 C30 50, 20 70, 35 75 C50 80, 60 65, 55 55" fill="currentColor" opacity="0.5" />
      <path d="M50 50 C50 70, 30 80, 25 65 C20 50, 35 40, 45 45" fill="currentColor" opacity="0.5" />
      <path d="M50 50 C70 50, 80 30, 65 25 C50 20, 40 35, 45 45" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

export function RoofFanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="25" y="55" width="50" height="35" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M10 55 L50 15 L90 55" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="50" cy="40" r="10" fill="currentColor" opacity="0.4" />
      <circle cx="50" cy="40" r="4" fill="currentColor" />
      <line x1="50" y1="40" x2="50" y2="80" stroke="currentColor" strokeWidth="2" />
      <line x1="40" y1="45" x2="60" y2="45" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function getFanIcon(fanType: string) {
  switch (fanType.toLowerCase()) {
    case 'axial':
      return AxialFanIcon
    case 'centrifugal':
      return CentrifugalFanIcon
    case 'roof':
      return RoofFanIcon
    default:
      return AxialFanIcon
  }
}
