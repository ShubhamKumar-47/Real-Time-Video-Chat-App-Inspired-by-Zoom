import React from 'react'

export default function Logo({ size = 40, ...props }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      {...props}
    >
      {/* Dark blue background circle */}
      <circle cx="50" cy="50" r="48" fill="#0F172A" />
      
      {/* Outer light-blue ring */}
      <circle cx="50" cy="50" r="43" stroke="#38BDF8" strokeWidth="5.5" fill="none" />
      
      {/* Person silhouette (Shoulders & Head) */}
      <path d="M26 73 C26 58, 32 55, 50 55 C68 55, 74 58, 74 73 Z" fill="#FFFFFF" />
      <circle cx="50" cy="41" r="13" fill="#FFFFFF" />
      
      {/* Collar/Tie area */}
      <path d="M43 55 L50 65 L57 55 Z" fill="#0F172A" />
      <path d="M47 62 L53 62 L52 75 L48 75 Z" fill="#38BDF8" />
      
      {/* Headset arc */}
      <path d="M34 41 A16.5 16.5 0 0 1 66 41" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      
      {/* Headset ear cups */}
      <rect x="30" y="36" width="5.5" height="11.5" rx="2.5" fill="#38BDF8" />
      <rect x="64.5" y="36" width="5.5" height="11.5" rx="2.5" fill="#38BDF8" />
      
      {/* Mic arm & tip */}
      <path d="M35 47 C35 53.5, 44 53.5, 46.5 50.5" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="47.5" cy="50.5" r="2.2" fill="#38BDF8" />
    </svg>
  )
}
