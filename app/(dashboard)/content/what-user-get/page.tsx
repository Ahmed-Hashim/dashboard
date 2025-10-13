import { getBeforeCtaSection } from '@/app/actions/whatUserGetActions';
import { SectionForm } from './SectionForm';
import { HighlightsManager } from './HighlightsManager';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export default async function AdminBeforeCtaPage() {
  const data = await getBeforeCtaSection();

  if (!data) {
    return (
      <div className="container mx-auto py-10 text-red-500" dir="rtl">
        خطأ: لا يمكن تحميل بيانات القسم. يرجى التأكد من وجود سجل بالمعرف ID=1
        في جدول before_cta_sections.
      </div>
    );
  }

  const { before_cta_highlights, ...sectionData } = data;

  return (
    <main className="container mx-auto py-10" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">إدارة قسم لماذا نحن</h1>
            <p className="text-muted-foreground">
              تعديل عنوان القسم وإدارة جميع النقاط البارزة فيه.
            </p>
        </div>
        
        <SectionForm section={sectionData} />
        <Separator />
        <HighlightsManager initialHighlights={before_cta_highlights} />
      </div>
    </main>
  );
}