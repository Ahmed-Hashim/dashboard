<<<<<<< HEAD

import { getBenefits } from '@/app/actions/benefitsActions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BenefitsActions } from './BenefitsActions';

export const dynamic = 'force-dynamic';

export default async function AdminBenefitsPage() {
  const benefits = await getBenefits();

  return (
    <main className="container mx-auto py-10" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>إدارة مميزات الدورة</CardTitle>
                <CardDescription>إضافة وتعديل وحذف المميزات التي تظهر للطلاب.</CardDescription>
              </div>
              {/* زر الإضافة سيكون داخل المكون التفاعلي */}
            </div>
          </CardHeader>
          <CardContent>
            {/* تمرير البيانات الأولية إلى المكون التفاعلي */}
            <BenefitsActions initialBenefits={benefits} />
          </CardContent>
        </Card>
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
