import { useMemo } from 'react'
import { ChronoLogoIcon, GithubIcon, LinkedinIcon } from '../icons'

export const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), [])
  return (
    <footer className="bg-white h-28 border-t z-10">
      <div className="container mx-auto flex flex-col gap-y-3 sm:flex-row items-start sm:items-center justify-between h-full px-4">
        <span className="font-medium pt-4 sm:pt-0 flex items-center">
          <ChronoLogoIcon width={20} height={32} />
        </span>
        <div className="flex justify-center items-center">
          <span>&copy; {currentYear} - Ignacio Miranda Figueroa</span>
        </div>
        <div className="flex gap-x-2 pb-4 sm:pb-0">
          <a
            href="https://github.com/IgnacioNMiranda"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            <GithubIcon width={30} height={30} color="currentColor" />
          </a>
          <a
            href="https://www.linkedin.com/in/ignacio-miranda-figueroa/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            <LinkedinIcon width={32} height={32} color="currentColor" />
          </a>
        </div>
      </div>
    </footer>
  )
}
