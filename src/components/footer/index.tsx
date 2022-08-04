import { useMemo } from 'react'

export const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), [])
  return (
    <footer className="bg-white h-28 border-t z-10 ">
      <div className="container mx-auto flex items-center justify-between h-full">
        <div />
        <div className="flex justify-center items-center">
          <span>&copy; {currentYear} Ignacio Miranda F. (aka N)</span>
        </div>
        <div />
      </div>
    </footer>
  )
}
