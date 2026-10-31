import React from 'react'

const props = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function SocialIcon({ platform }: { platform?: string | null }) {
  switch (platform) {
    case 'instagram':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </svg>
      )
    case 'facebook':
      return (
        <svg {...props}>
          <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15V3Z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 10.5V17M8 7.2v.1M11.5 17v-3.8a2.2 2.2 0 0 1 4.4 0V17M11.5 10.5V17" />
        </svg>
      )
    case 'youtube':
      return (
        <svg {...props}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="m10.5 9.5 4 2.5-4 2.5v-5Z" />
        </svg>
      )
    case 'google':
      return (
        <svg {...props}>
          <path d="M20 12.2c0 4.6-3.2 7.8-8 7.8a8 8 0 1 1 5.4-13.9" />
          <path d="M12.5 12H20" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      )
  }
}

export const socialLabel = (platform?: string | null) =>
  ({
    instagram: 'Instagram',
    facebook: 'Facebook',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    google: 'Google',
    onedoc: 'OneDoc',
  })[platform || ''] || 'Profilo'
