import { getFaqSection } from '@/app/actions/faqActions';
import { SectionForm } from './SectionForm';
import { FaqItemsManager } from './FaqItemsManager';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export default async function AdminFaqPage() {
  const data = await getFaqSection();

  if (!data) {
    return (
      <div className="container mx-auto py-10 text-red-500" dir="rtl">
        خطأ: لا يمكن تحميل بيانات قسم الأسئلة الشائعة. يرجى التأكد من وجود سجل بالمعرف ID=1
        في جدول faq_sections.
      </div>
    );
  }

  const { faq_items, ...sectionData } = data;

  return (
    <main className="container mx-auto py-10" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">إدارة قسم الأسئلة الشائعة</h1>
            <p className="text-muted-foreground">
              تعديل عنوان القسم وإدارة جميع الأسئلة والأجوبة.
            </p>
        </div>
        
        <SectionForm section={sectionData} />
        <Separator />
        <FaqItemsManager initialItems={faq_items} />
      </div>
    </main>
  );
}