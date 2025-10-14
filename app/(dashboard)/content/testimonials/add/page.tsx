import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AddTestimonialForm } from './AddTestimonialForm';


export default function AddTestimonialPage() {
  return (
    <main className="container mx-auto py-10" dir="rtl">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>إضافة رأي جديد</CardTitle>
          <CardDescription>
            املأ النموذج لإضافة شهادة عميل جديدة.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddTestimonialForm />
        </CardContent>
      </Card>
    </main>
  );
}