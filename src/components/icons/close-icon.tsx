import { SVGProps } from 'react'

export const CloseIcon = ({ color, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M19.764 19.764a.8.8 0 0 1-1.132 0L12 13.13l-6.634 6.634a.8.8 0 1 1-1.132-1.132L10.87 12 4.235 5.366a.8.8 0 1 1 1.132-1.132L12 10.87l6.634-6.634a.8.8 0 1 1 1.131 1.131L13.13 12l6.634 6.634c.315.31.315.82 0 1.13Z"
        fill={color}
      />
    </svg>
  )
}
