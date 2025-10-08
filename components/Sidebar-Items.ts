import {
  BookOpen,
  FileText,
  Home,
  Layers,
  LifeBuoy,
  Settings,
  Users,
  Video,
} from "lucide-react";
export const items = [
  {
    title: "الرئيسية",
    url: "/",
    icon: Home,
  },
  {
    title: "الكورس",
    url: "/chapters",
    icon: BookOpen,
  },
  
  {
    title: "الفيديوهات",
    url: "/videos",
    icon: Video,
  },
  {
    title: "المستخدمين",
    url: "/users",
    icon: Users,
  },
  {
    title: "محتوى الموقع",
    url: "/content",
    icon: FileText,
  },
  {
    title: "الحسابات",
    url: "/payments",
    icon: Layers, // ممكن تختار أي أيقونة مناسبة
  },
  {
    title: "الدعم الفني",
    url: "/support",
    icon: LifeBuoy,
  },

];
