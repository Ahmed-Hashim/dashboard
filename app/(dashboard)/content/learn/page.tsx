
import { LearnSectionForm } from './LearnSectionForm';
import { LearnItemsManager } from './LearnItemsManager';
import { Separator } from '@/components/ui/separator';
import { getLearnSectionWithItems } from '@/app/actions/learn-sectionActions';

// يضمن أن هذه الصفحة يتم تحديثها دائمًا عند كل طلب
export const dynamic = 'force-dynamic';

export default async function AdminLearnSectionPage() {
  const data = await getLearnSectionWithItems();

  if (!data) {
    return (
      <div className="container mx-auto py-10 text-red-500" dir="rtl">
        خطأ: لا يمكن تحميل بيانات قسم التعلم. يرجى التأكد من وجود سجل بالمعرف
        main-learn-section في جدول learn_sections.
      </div>
    );
  }

  // نفصل بيانات القسم عن بيانات العناصر
  const { learn_section_items, ...sectionData } = data;

  return (
    <main className="container mx-auto py-10" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
            <h1 className="text-3xl font-bold mb-2">إدارة قسم ماذا ستتعلم</h1>
            <p className="text-muted-foreground">
              تعديل عنوان القسم وإدارة جميع النقاط التعليمية المرتبطة به.
            </p>
        </div>
        
        <LearnSectionForm section={sectionData} />
        <Separator />
        <LearnItemsManager items={learn_section_items} sectionId={sectionData.id} />
      </div>
    </main>
  );
}