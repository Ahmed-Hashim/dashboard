import Link from 'next/link';
import { getTestimonials } from '@/app/actions/testimonialsActions';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { EditTestimonialDialog } from './EditTestimonialDialog';
import { DeleteTestimonialButton } from './DeleteTestimonialButton';

// Helper to get initials from a name
const getInitials = (name: string) => {
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.toUpperCase();
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <main className="container mx-auto py-10" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">إدارة آراء العملاء</h1>
          <p className="text-muted-foreground">إضافة، عرض، وتعديل شهادات العملاء.</p>
        </div>
        <Button asChild>
          <Link href="/content/testimonials/add">إضافة رأي جديد</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة آراء العملاء</CardTitle>
          <CardDescription>
            يتم عرض {testimonials.length} رأي حالياً.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الصورة</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead className="w-[50%]">الاقتباس</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={testimonial.img_src || ''} alt={testimonial.name} />
                        <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-sm">
                      {testimonial.text}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <EditTestimonialDialog testimonial={testimonial} />
                        <DeleteTestimonialButton id={testimonial.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    لا يوجد آراء لعرضها.
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