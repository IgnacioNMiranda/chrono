import { SVGProps } from 'react'

export const SpinnerIcon = ({ color, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="animate-spin"
      {...props}
    >
      <path d="M12 3a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7V3Z" fill={color} />
    </svg>
  )
}
