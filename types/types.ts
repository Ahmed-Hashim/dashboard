export interface DashboardStats {
  courses: number;
  videos: number;
  users: number;
  support: number;
}

// types/enrollment.ts
export interface EnrollmentData {
  date: string;      // تاريخ التسجيل (مثال: "01/10")
  students: number;  // عدد الطلاب المسجلين
}

// types/video.ts
export interface VideoEngagementData {
  title: string;         // اسم الفيديو
  views: number;         // عدد المشاهدات
  avgWatchTime: number;  // متوسط مدة المشاهدة بالدقائق أو النسبة
}

// types/progress.ts
export interface ProgressDistributionData {
  name: string;    // مثال: "أنهو الكورس" / "في منتصف الكورس" / "بدأ فقط"
  value: number;   // نسبة أو عدد الطلاب
}


// types/completion.ts
export interface CompletionVsActiveData {
  date: string;           // التاريخ
  completionRate: number; // نسبة الإنجاز %
  activeStudents: number; // عدد الطلاب النشطين
}

// types/dropoff.ts
export interface VideoDropOffData {
  time: number;       // الوقت بالدقائق أو النسبة من الفيديو
  watchRate: number;  // نسبة المشاهدة
}


// types/support.ts
export interface SupportMessagesData {
  date: string;     // تاريخ الرسالة
  messages: number; // عدد الرسائل الواردة
}

export type HeroSection = {
  id: number;
  slug: string;
  title: string | null;
  description: string | null;
  highlight_text: string | null;
  cta_primary_text: string | null;
  cta_secondary_text: string | null;
  video_src: string | null;
  created_at: string;
};

export type LearnSectionItem = {
  id: number;
  learn_section_id: number;
  icon_name: string | null;
  text: string;
};

export type LearnSection = {
  id: number;
  slug: string;
  section_title: string | null;
  highlighted_word: string | null;
};

// This type represents the combined data we will fetch
export type LearnSectionWithItems = LearnSection & {
  learn_section_items: LearnSectionItem[];
};
export type InstructorHighlight = {
  id: number;
  instructor_id: number;
  text: string;
  order_index: number | null;
};

export type Instructor = {
  id: number;
  name: string;
  title: string | null;
  image_src: string | null;
  linkedin_url: string | null;
};

// نوع مركب لجلب المدرب مع نقاط التميز الخاصة به مرة واحدة
export type InstructorWithHighlights = Instructor & {
  instructor_highlights: InstructorHighlight[];
};

// ... الأنواع الموجودة

export type Benefit = {
  id: number;
  icon_name: string | null;
  title: string;
  description: string | null;
  created_at: string;
};
// ... الأنواع الموجودة

export type CourseBenefit = {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
};

export type Course = {
  id: number;
  title: string;
  yt_video_id: string | null;
  description: string | null;
  image_url: string | null;
  slug: string | null;
  seo_meta: Record<string, unknown> | null; // للتعامل مع JSONB
  price: number | null;
  instructor: string | null;
  published: boolean | null;
};

// نوع مركب لجلب الكورس مع مميزاته
export type CourseWithBenefits = Course & {
  course_benefits: CourseBenefit[];
};

export type BeforeCtaHighlight = {
  id: number;
  section_id: number;
  icon_name: string | null;
  title: string;
  description: string | null;
};

export type BeforeCtaSection = {
  id: number;
  slug: string;
  title_main: string | null;
  title_highlight: string | null;
};

// نوع مركب لجلب القسم مع نقاطه البارزة
export type BeforeCtaSectionWithHighlights = BeforeCtaSection & {
  before_cta_highlights: BeforeCtaHighlight[];
};


export type FaqItem = {
  id: number;
  section_id: number;
  question: string;
  answer: string;
  order_index: number | null;
};

export type FaqSection = {
  id: number;
  slug: string;
  title_part_1: string | null;
  title_part_2: string | null;
};

// نوع مركب لجلب القسم مع أسئلته
export type FaqSectionWithItems = FaqSection & {
  faq_items: FaqItem[];
};

// أنواع الهيدر
export type HeaderNavLink = { id: number; header_id: number; label: string; href: string; };
export type Header = { id: number; slug: string; logo_src: string | null; logo_alt: string | null; home_href: string | null; primary_button_text: string | null; primary_button_href: string | null; };
export type HeaderWithNavLinks = Header & { header_nav_links: HeaderNavLink[]; };

// أنواع الفوتر
export type FooterLink = { id: number; footer_id: number; link_type: 'quick_link' | 'social_link'; label: string | null; href: string; icon_name: string | null; order_index: number | null; };
export type Footer = { id: number; slug: string; brand_name: string | null; brand_description: string | null; quick_links_title: string | null; social_links_title: string | null; email: string | null; phone_number: string | null; copyright_text: string | null; };
export type FooterWithLinks = Footer & { footer_links: FooterLink[]; };
export type Testimonial = {
  id: number;
  name: string;
  text: string;
  img_src: string | null;
  created_at: string;
};
export type TestimonialFormState = {
  errors?: {
    name?: string[];
    text?: string[];
    img_src?: string[];
  };
  message?: string;
};