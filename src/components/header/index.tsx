import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0'
import { UserData } from './user-data'

export const Header = () => {
  const { user } = useUser()

  return (
    <header className="bg-primary h-12 z-20">
      <div className="container mx-auto h-full flex justify-between font-medium text-white">
        <ul className="flex items-center h-full">
          {!!user && (
            <li className="h-full px-2 hover:bg-primary-light">
              <Link href="/" className="">
                <a className="h-full flex items-center">Home</a>
              </Link>
            </li>
          )}
        </ul>
        {!!user && <UserData />}
      </div>
    </header>
  )
}
