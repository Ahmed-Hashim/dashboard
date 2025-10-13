
import { getCourseWithBenefits } from '@/app/actions/courseActions';
import { CourseBenefitsManager } from './CourseBenefitsManager';
import { Separator } from '@/components/ui/separator';
import { CourseForm } from './CourseDetailsForm';

export const dynamic = 'force-dynamic';

export default async function AdminCoursePage() {
  const data = await getCourseWithBenefits();

  if (!data) {
    return (
      <div className="container mx-auto py-10 text-red-500" dir="rtl">
        خطأ: لا يمكن تحميل بيانات الكورس. يرجى التأكد من وجود كورس بالمعرف ID=1
        في جدول courses.
      </div>
    );
  }

  const { course_benefits, ...courseData } = data;

  return (
    <main className="container mx-auto py-10" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">إدارة بيانات الدورة</h1>
            <p className="text-muted-foreground">
              تعديل جميع تفاصيل الدورة التدريبية ومميزاتها من مكان واحد.
            </p>
        </div>
        
        <CourseForm course={courseData} />
        <Separator />
        <CourseBenefitsManager initialBenefits={course_benefits} />
      </div>
    </main>
  );
}