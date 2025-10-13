import {
  BookOpen,
  Edit,
  FileText,
  Home,
  ImageIcon,
  Layers,
  LifeBuoy,
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
<<<<<<< HEAD
        title: "الإعدادات الرئيسية",
        url: "/content/layout-settings",
        icon: Edit,
      },
      {
=======
>>>>>>> 738145104b57bc838a840eb13459b0bc04138157
        title: "هيرو",
        url: "/content/hero",
        icon: Edit,
      },
      {
<<<<<<< HEAD
        title: "شركائنا",
        url: "/content/partners",
        icon: ImageIcon,
      },
      {
        title: "هتتعلم ايه",
        url: "/content/learn",
        icon: ImageIcon,
      },
      {
        title: "المدرب",
        url: "/content/instructor",
        icon: Video,
      },
      {
        title: "لماذا نحن",
        url: "/content/whyus",
        icon: Video,
      },
      {
        title: "الكورس",
        url: "/content/course-details",
        icon: Video,
      },
      {
        title: "ما سيحصل عليه",
        url: "/content/what-user-get",
        icon: Video,
      },
      {
        title: "الأسئلة المتكررة",
        url: "/content/fqa",
=======
        title: "الصور",
        url: "/content/images",
        icon: ImageIcon,
      },
      {
        title: "الفيديوهات",
        url: "/content/videos",
>>>>>>> 738145104b57bc838a840eb13459b0bc04138157
        icon: Video,
      },
    ]
  },

];