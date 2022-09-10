import { SVGProps } from 'react'

export const HamburgerIcon = ({ color, ...props }: SVGProps<SVGSVGElement>) => {
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
      {...props}
    >
      <path color={color} d="M12.8889 7H2"></path>
      <path color={color} d="M16 3H2"></path>
      <path color={color} d="M16 11H2"></path>
      <path color={color} d="M12.8889 15H2"></path>
    </svg>
  )
}
