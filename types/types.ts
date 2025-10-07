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

