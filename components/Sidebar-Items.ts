import {
  BookOpen,
  Edit,
  FileText,
  Home,
  ImageIcon,
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
    type: "single",
  },
  {
    title: "الكورس",
    url: "/chapters",
    icon: BookOpen,
    type: "single",
  },
  
  {
    title: "الفيديوهات",
    url: "/videos",
    icon: Video,
    type: "single",
  },
  {
    title: "المستخدمين",
    url: "/users",
    icon: Users,
    type: "single",
  },
  
  {
    title: "الحسابات",
    url: "/payments",
    icon: Layers, // ممكن تختار أي أيقونة مناسبة
    type: "single",
  },
  {
    title: "الدعم الفني",
    url: "/support",
    icon: LifeBuoy,
    type: "single",
  },
  {
    title: "محتوى الموقع",
    url: "/content",
    icon: FileText,
    type: "group",
    children: [
      {
        title: "هيرو",
        url: "/content/hero",
        icon: Edit,
      },
      {
        title: "الصور",
        url: "/content/images",
        icon: ImageIcon,
      },
      {
        title: "الفيديوهات",
        url: "/content/videos",
        icon: Video,
      },
    ]
  },

];
