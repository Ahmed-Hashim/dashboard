import Link from 'next/link';
import Image from 'next/image';
import { getPartners } from '@/app/actions/partnersActions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DeletePartnerButton } from './DeletePartnerButton';
import { EditPartnerDialog } from './EditPartnerDialog'; // <-- 1. Import the new component

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <main className="container mx-auto py-10" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">إدارة الشركاء</h1>
          <p className="text-muted-foreground">إضافة، عرض، وحذف شعارات الشركاء.</p>
        </div>
        <Button asChild>
          <Link href="/content/partners/add">إضافة شريك جديد</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الشركاء</CardTitle>
          <CardDescription>
            يتم عرض {partners.length} شريك حالياً.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الشعار</TableHead>
                <TableHead>النص البديل (Alt Text)</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.length > 0 ? (
                partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell>
                      <div className="relative h-12 w-24 bg-muted rounded-md overflow-hidden">
                        <Image
                          src={partner.src}
                          alt={partner.alt}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{partner.alt}</TableCell>
                    <TableCell>
                      {/* 2. Add the component here */}
                      <div className="flex gap-2">
                        <EditPartnerDialog partner={partner} />
                        <DeletePartnerButton id={partner.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    لا يوجد شركاء لعرضهم.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}