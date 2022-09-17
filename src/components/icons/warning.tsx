import { SVGProps } from 'react'

export const WarningIcon = ({ color, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="warning"
      {...props}
    >
      <path
        fill={color}
        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      ></path>
      <line fill={color} x1="12" y1="9" x2="12" y2="13"></line>
      <line fill={color} x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  )
}
