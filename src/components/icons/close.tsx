import { SVGProps } from 'react'

export const CloseIcon = ({ color, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="X icon"
      {...props}
    >
      <path fill={color} d="M14.25 3.75L3.75 14.25"></path>
      <path fill={color} d="M3.75 3.75L14.25 14.25"></path>
    </svg>
  )
}
