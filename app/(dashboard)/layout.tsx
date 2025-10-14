import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";
import type { Metadata } from "next";


import { ThemeProvider } from "next-themes";
import "../globals.css";
import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin Dashboard",
  icons: {
    icon: '/favicon.svg',
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  

  if (!user) redirect("/login");
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={` font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar  />
            <main className="flex flex-col flex-1">
              <Navbar user={user}/>
              {children}
              
              <Toaster richColors />
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
