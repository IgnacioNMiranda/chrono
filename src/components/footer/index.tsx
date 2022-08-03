import { useMemo } from 'react'

export const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), [])
  return (
    <footer className="bg-white h-28 border-t">
      <div className="container mx-auto flex items-center h-full">
        <div className="flex justify-center items-center w-full">
          <span>&copy; {currentYear} Ignacio Miranda F.</span>
        </div>
      </div>
    </footer>
  )
}
