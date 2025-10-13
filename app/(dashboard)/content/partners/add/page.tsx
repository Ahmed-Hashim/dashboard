import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AddPartnerForm } from './AddPartnerForm'; // سنقوم بإنشاء هذا المكون

export default function AddPartnerPage() {
  return (
    <main className="container mx-auto py-10" dir="rtl">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>إضافة شريك جديد</CardTitle>
          <CardDescription>
            أدخل رابط شعار الشريك والنص البديل الخاص به.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddPartnerForm />
        </CardContent>
      </Card>
    </main>
  );
}