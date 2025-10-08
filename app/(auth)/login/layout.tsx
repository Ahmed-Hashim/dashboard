import { ReactNode } from "react";

import type { Metadata } from "next";

import { ThemeProvider } from "next-themes";
import "../../globals.css";

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
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={` font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
        >
          <main className="flex flex-col flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
