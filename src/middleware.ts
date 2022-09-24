import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (!request.cookies.get('appSession')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
// https://nextjs.org/docs/advanced-features/middleware#matching-paths
export const config = {
  matcher: ['/profile', '/changelog'],
}
