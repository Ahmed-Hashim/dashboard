📦 cinematic-ai-admin/
├── 📁 app/
│   ├── 📁 (auth)/
│   │   └── 📁 login/
│   │       └── page.tsx               # صفحة تسجيل الدخول
│   ├── 📁 dashboard/                  # لوحة التحكم الرئيسية
│   │   ├── page.tsx                   # الصفحة الرئيسية للداشبورد (/)
│   │   ├── 📁 courses/
│   │   │   ├── page.tsx               # إدارة الكورسات
│   │   │   └── [id]/
│   │   │       └── page.tsx           # تفاصيل كورس معين
│   │   ├── 📁 videos/
│   │   │   ├── page.tsx               # إدارة الفيديوهات
│   │   │   └── upload.tsx             # رفع الفيديوهات (Bunny)
│   │   ├── 📁 users/
│   │   │   └── page.tsx               # إدارة المستخدمين (Admin only)
│   │   ├── 📁 content/
│   │   │   └── page.tsx               # إدارة محتوى الهوم / السيو / الأسئلة
│   │   ├── 📁 support/
│   │   │   └── page.tsx               # إدارة رسائل الدعم
│   │   └── layout.tsx                 # تصميم عام للداشبورد (sidebar + header)
│   ├── layout.tsx                      # Root layout
│   ├── globals.css                     # تنسيقات عامة
│   ├── favicon.ico
│   └── page.tsx                        # Redirect logic -> dashboard
│
├── 📁 components/
│   ├── ui/                             # Shadcn UI Components
│   ├── auth/                           # مكونات صفحة تسجيل الدخول
│   │   └── login-form.tsx
│   ├── dashboard/                      # مكونات عامة للوحة التحكم
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── stats-card.tsx
│   │   └── chart.tsx
│   └── forms/
│       └── course-form.tsx             # نموذج إضافة/تعديل كورس
│
├── 📁 lib/
│   ├── supabase.ts                     # تهيئة Supabase Client (client + server)
│   ├── bunny.ts                        # وظائف التعامل مع Bunny API
│   ├── utils.ts                        # دوال مساعدة (slugify, formatDate...)
│   └── auth.ts                         # دوال إدارة الجلسة (checkUserRole...)
│
├── 📁 public/
│   └── logo.svg
│
├── 📁 types/
│   └── database.ts                     # أنواع الجداول (generated from Supabase)
│
├── 📁 middleware.ts                    # حماية المسارات (redirect login)
├── 📁 .env.local                       # مفاتيح Supabase + Bunny
├── 📁 package.json
├── 📁 tailwind.config.ts
├── 📁 tsconfig.json
└── 📁 postcss.config.js
