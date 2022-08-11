import { SVGProps } from 'react'

export const ClockAnimated = ({ color, ...props }: SVGProps<SVGSVGElement>) => {
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
      <line x1="12" y1="6" x2="12" y2="12" fill={color}>
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="3s"
          repeatCount="indefinite"
        ></animateTransform>
      </line>
      <line x1="16" y1="14" x2="12" y2="12" fill={color}>
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="30s"
          repeatCount="indefinite"
        ></animateTransform>
      </line>
    </svg>
  )
}
