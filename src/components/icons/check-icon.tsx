import { SVGProps } from 'react'

export const CheckIcon = ({ color, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      fill="none"
      height={24}
      width={24}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M21.79 5.21a.709.709 0 0 1 0 1.008L9.646 18.361a.709.709 0 0 1-1.009 0l-6.429-6.429a.713.713 0 0 1 0-1.008.71.71 0 0 1 1.01 0l5.923 5.923L20.78 5.21a.712.712 0 0 1 1.01 0Z"
        fill={color}
      />
    </svg>
  )
}
