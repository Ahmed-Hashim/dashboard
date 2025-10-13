import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  const path = req.nextUrl.pathname;

  const isPublicRoute =
    path.startsWith("/login") ||
    path.startsWith("/auth") ||
    path.startsWith("/api/public") ||
    path.startsWith("/favicon.ico");

  console.log("🧠 Middleware triggered on:", path, "| user:", user ? user.email : "none");

  // Redirect to login if not signed in
  if (!user && !isPublicRoute) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in user away from login
  if (user && path === "/login") {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  return res;
}

// ✅ Matcher without capturing groups
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}
