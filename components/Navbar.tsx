"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { LogOut, Moon, Settings, Sun, User, Monitor } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "./ui/sidebar";
import { User as UserSupa } from "@supabase/supabase-js";
import { signout } from "@/app/(auth)/login/actions";
import Link from "next/link";
import { Tables } from "@/types/database";

export type Profile = Tables<"profiles">;

const Navbar = ({ user }: { user: UserSupa }) => {
  const { setTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);

  // جلب بيانات المستخدم من جدول profiles
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error && data) setProfile(data);
    };

    fetchProfile();
  }, [user]);

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0 bg-background z-50 border-b">
      {/* القسم الأيسر */}
      <SidebarTrigger />

      {/* القسم الأيمن */}
      <div className="flex items-center gap-4">
        {/* قائمة المظاهر */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">تبديل المظهر</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent
              align="end"
              className="z-[9999] min-w-0 w-fit bg-primary text-primary-foreground border-none shadow-lg rounded-xl"
            >
             

              <DropdownMenuItem
                className="hover:bg-primary-foreground/10 cursor-pointer p-0 h-8 w-8 flex items-center justify-center"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4" />
              </DropdownMenuItem>

              <DropdownMenuItem
                className="hover:bg-primary-foreground/10 cursor-pointer p-0 h-8 w-8 flex items-center justify-center"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4" />
              </DropdownMenuItem>

              <DropdownMenuItem
                className="hover:bg-primary-foreground/10 cursor-pointer p-0 h-8 w-8 flex items-center justify-center"
                onClick={() => setTheme("system")}
              >
                <Monitor className="h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

        {/* قائمة المستخدم */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={profile?.avatar_url || "/default-avatar.jpg"} />
              <AvatarFallback>
                {profile?.name?.[0]?.toUpperCase() || "م"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent
              sideOffset={10}
              className="z-[9999] bg-primary text-primary-foreground border-none shadow-lg rounded-xl"
            >
              <DropdownMenuLabel className="flex items-center justify-center">
                {profile?.name || "حسابي"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary-foreground/30" />

              <DropdownMenuItem className="hover:bg-primary-foreground/10 cursor-pointer">
                <Link href={"/profile"} className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  الملف الشخصي
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="hover:bg-primary-foreground/10 cursor-pointer">
                <Link href={"/"} className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  الإعدادات
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={signout}
                className="hover:bg-primary-foreground/10 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
