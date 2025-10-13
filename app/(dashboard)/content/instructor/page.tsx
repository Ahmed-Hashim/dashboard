
import { getInstructorWithHighlights } from '@/app/actions/instractorActions';
import { Separator } from '@/components/ui/separator';
import { InstructorForm } from './InstructorForm';
import { HighlightsManager } from './HighlightsManager';

export const dynamic = 'force-dynamic';

export default async function AdminInstructorPage() {
  const data = await getInstructorWithHighlights();

  if (!data) {
    return (
      <div className="container mx-auto py-10 text-red-500" dir="rtl">
        خطأ: لا يمكن تحميل بيانات المدرب. يرجى التأكد من وجود مدرب بالمعرف ID=1
        في جدول instructors.
      </div>
    );
  }

  const { instructor_highlights, ...instructorData } = data;

  return (
    <main className="container mx-auto py-10" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">إدارة بيانات المدرب</h1>
            <p className="text-muted-foreground">
              تعديل بيانات المدرب الرئيسي وإدارة نقاط التميز الخاصة به.
            </p>
        </div>
        
        <InstructorForm instructor={instructorData} />
        <Separator />
        <HighlightsManager highlights={instructor_highlights} instructorId={instructorData.id} />
      </div>
    </main>
  );
}