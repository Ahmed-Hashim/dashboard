import {
  Home,
  BookOpen,
  Video,
  Users,
  CreditCard,
  LifeBuoy,
  FileText,
  Settings,
  ImageIcon,
  GraduationCap,
  User,
  MessageSquare,
  HelpCircle,
  Sparkles,
  Gift,
  ClipboardList,
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
    title: "الاشتراكات",
    url: "/enrolments",
    icon: ClipboardList,
    type: "single",
  },
  {
    title: "الحسابات",
    url: "/payments",
    icon: CreditCard,
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
        title: "الإعدادات الرئيسية",
        url: "/content/layout-settings",
        icon: Settings,
      },
      {
        title: "هيرو",
        url: "/content/hero",
        icon: ImageIcon,
      },
      {
        title: "شركائنا",
        url: "/content/partners",
        icon: Sparkles,
      },
      {
        title: "هتتعلم ايه",
        url: "/content/learn",
        icon: GraduationCap,
      },
      {
        title: "المدرب",
        url: "/content/instructor",
        icon: User,
      },
      {
        title: "الآراء",
        url: "/content/testimonials",
        icon: MessageSquare,
      },
      {
        title: "لماذا نحن",
        url: "/content/whyus",
        icon: HelpCircle,
      },
      {
        title: "الكورس",
        url: "/content/course-details",
        icon: BookOpen,
      },
      {
        title: "ما سيحصل عليه",
        url: "/content/what-user-get",
        icon: Gift,
      },
      {
        title: "الأسئلة المتكررة",
        url: "/content/fqa",
        icon: HelpCircle,
      },
    ],
  },
];
