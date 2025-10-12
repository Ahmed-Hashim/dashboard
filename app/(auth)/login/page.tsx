"use client";

import { useState, useEffect } from "react"; // ✅ Import useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { login } from "./actions";

export default function LoginPage() {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // ✅ State to track mount status

  // ✅ Ensures this code runs only on the client, after the initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Render a placeholder for the theme toggle button to prevent mismatch
  if (!mounted) {
    // Render a minimal version or a loader on the server and initial client render
    // This prevents the theme-dependent part from causing a mismatch
    return (
       <div className="flex min-h-screen items-center justify-center bg-neutral-950">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
       </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen items-center justify-center px-4 transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-neutral-900"
      }`}
    >
      <Card
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border backdrop-blur-lg transition-all duration-300 ${
          theme === "dark"
            ? "bg-neutral-900/70 border-neutral-800 hover:shadow-indigo-900/40"
            : "bg-white/80 border-slate-200 hover:shadow-indigo-200/40"
        }`}
      >
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <Image
              src="/logo_icon.svg"
              alt="Logo"
              width={70}
              height={70}
              className="drop-shadow-lg"
            />
          </div>
          <CardTitle
            className={`text-2xl font-bold tracking-wide ${
              theme === "dark"
                ? "bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            }`}
          >
            فالوريم
          </CardTitle>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            قم بتسجيل الدخول إلى لوحة التحكم الخاصة بك
          </p>
        </CardHeader>

        <CardContent>
          <form
            action={async (formData) => {
              setLoading(true);
              await login(formData);
              // Consider setting setLoading(false) in case of an error
            }}
            className="space-y-4"
          >
            <Input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              required
              className="text-right"
            />
            <Input
              type="password"
              name="password"
              placeholder="كلمة المرور"
              required
              className="text-right"
            />

            <Button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold transition-all duration-300 ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
              }`}
            >
              {loading && (
                <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" />
              )}
              {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>

          {/* 🌗 زر التبديل بين الوضعين */}
          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              {theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-600" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}