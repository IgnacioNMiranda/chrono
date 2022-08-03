import Link from 'next/link'

export const Header = () => {
  return (
    <header className="bg-[#9f5fd4] h-12">
      <div className="container mx-auto h-full flex justify-between text-white">
        <ul className="flex items-center h-full font-medium">
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
        </ul>
        <div className="self-center">Login</div>
      </div>
    </header>
  )
}
