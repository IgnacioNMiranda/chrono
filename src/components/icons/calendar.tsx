import { SVGProps } from 'react'

export const CalendarIcon = ({ color, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Calendar icon"
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6" fill={color}></line>
      <line x1="8" y1="2" x2="8" y2="6" fill={color}></line>
      <line x1="3" y1="10" x2="21" y2="10" fill={color}></line>
    </svg>
  )
}
