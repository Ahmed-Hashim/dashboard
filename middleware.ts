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

  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  const path = req.nextUrl.pathname;

  // ✅ Public routes (no auth needed)
  const isPublicRoute =
    path.startsWith("/login") ||
    path.startsWith("/auth") ||
    path.startsWith("/api/public") ||
    path === "/favicon.ico";

  console.log("🧠 Middleware:", path, "| user:", user ? user.email : "none");

  // 🚫 Not logged in → redirect to login
  if (!user && !isPublicRoute) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Redirect logged-in users away from /login
  if (user && path === "/login") {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }







let role: string | null = null;

if (user) {
  const { data, error } = await supabase
    .from("user_roles")
    .select(`role:roles(name)`)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching role:", error);
  } else {
    // Safely assign role name
    role = (data?.role as unknown as { name: string } | null)?.name ?? null;
  }
}

console.log("User role:", role);







  // ⚙️ Allowed pages for Sales
  const allowedSalesPages = [
    "/", // homepage
    "/sales",
    "/dashboard",
    "/orders",
    "/clients",
  ];

  // 🛡️ Role-based logic
  if (role === "admin") {
    // ✅ Admin can access everything
    return res;
  }

  if (role === "sales") {
    // 🚫 Block access if page not in allowed list
    if (!allowedSalesPages.includes(path)) {
      return new NextResponse("🚫 Forbidden: Not authorized for this page", { status: 403 });
    }
    return res;
  }

  // 🚫 Other roles (users or missing role)
  if (!isPublicRoute) {
    return new NextResponse("🚫 Forbidden: Access denied", { status: 403 });
  }

  return res;
}
// ✅ Matcher without capturing groups
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}