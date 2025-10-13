<<<<<<< HEAD
import { getHeroSection } from "@/app/actions/heroSectionActions";
// نقوم باستيراد النموذج من الملف المجاور
import { HeroSectionForm } from "./Form"; 

export default async function AdminHeroSectionPage() {
  const heroSectionData = await getHeroSection();

  if (!heroSectionData) {
    return (
      <div className="text-red-500 p-10 text-center font-bold" dir="rtl">
        خطأ: تعذر تحميل بيانات قسم الهيرو. يرجى التأكد من وجود سجل بالمعرف (ID 1) في جدول hero_sections.
      </div>
    );
  }

  return (
    // إضافة dir="rtl" لدعم العربية
    <main className="container mx-auto py-10" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">تعديل قسم الهيرو (Hero Section)</h1>
        <p className="text-muted-foreground mb-8">
          قم بتحديث المحتوى الخاص بالواجهة الرئيسية للموقع.
        </p>
        {/* تمرير البيانات إلى مكون النموذج */}
        <HeroSectionForm heroSection={heroSectionData} />
      </div>
    </main>
  );
}
=======
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page
>>>>>>> 738145104b57bc838a840eb13459b0bc04138157
