
import { getLayoutData } from '@/app/actions/layoutSettingsActions';
import { LayoutManager } from './LayoutManager';

export const dynamic = 'force-dynamic';

export default async function AdminLayoutPage() {
  const { headerData, footerData } = await getLayoutData();

  if (!headerData || !footerData) {
    return (
      <div className="container mx-auto py-10 text-red-500" dir="rtl">
        خطأ: لا يمكن تحميل بيانات الهيدر أو الفوتر. يرجى التأكد من وجود سجلات
        بالـ ID=1 في جدولي headers و footers.
      </div>
    );
  }

  return (
    <main className="container mx-auto py-10" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">إعدادات الهيدر والفوتر</h1>
          <p className="text-muted-foreground">
            إدارة المحتوى والروابط التي تظهر في رأس وتذييل الموقع.
          </p>
        </div>
        <LayoutManager initialHeaderData={headerData} initialFooterData={footerData} />
      </div>
    </main>
  );
}