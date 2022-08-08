import { SVGProps } from 'react'

export const ClockIcon = ({ color, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill={color}></circle>
      <polyline points="12 6 12 12 16 14" fill={color}></polyline>
    </svg>
  )
}
