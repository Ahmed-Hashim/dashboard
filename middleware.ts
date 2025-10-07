import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // ✅ Supabase client (SSR)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ✅ Fetch user session
  const { data, error } = await supabase.auth.getUser()
  const user = data?.user

  const path = req.nextUrl.pathname
  const isPublicRoute =
    path.startsWith('/login') ||
    path.startsWith('/auth') ||
    path.startsWith('/api/public') ||
    path.startsWith('/favicon.ico')

  console.log('🧠 Middleware triggered on:', path, '| user:', user ? user.email : 'none')

  // 🚫 redirect to login if not signed in
  if (!user && !isPublicRoute) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // ✅ redirect logged-in user away from login
  if (user && path === '/login') {
    const homeUrl = req.nextUrl.clone()
    homeUrl.pathname = '/'
    return NextResponse.redirect(homeUrl)
  }

  return res
}

// ✅ This matcher ensures middleware runs on all routes except static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}
