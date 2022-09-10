import { SVGProps } from 'react'

export const ArrowIcon = ({
  color,
  iconPosition,
  ...props
}: SVGProps<SVGSVGElement> & { iconPosition: 'left' | 'right' }) => {
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
      className={iconPosition === 'left' ? 'rotate-180' : ''}
      {...props}
    >
      <line x1="5" y1="12" x2="19" y2="12" color={color}></line>
      <polyline points="12 5 19 12 12 19" color={color}></polyline>
    </svg>
  )
}
