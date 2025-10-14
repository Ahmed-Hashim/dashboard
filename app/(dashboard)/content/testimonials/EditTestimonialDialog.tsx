'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';


import { updateTestimonial } from '@/app/actions/testimonialsActions';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Testimonial } from '@/types/types';

const formSchema = z.object({
  name: z.string().min(2, { message: 'الاسم مطلوب' }),
  text: z.string().min(10, { message: 'نص الشهادة مطلوب' }),
  img_src: z.string().url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export function EditTestimonialDialog({ testimonial }: { testimonial: Testimonial }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: testimonial.name,
      text: testimonial.text,
      img_src: testimonial.img_src || '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    formData.append('id', testimonial.id.toString());
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || '');
    });

    startTransition(async () => {
      const result = await updateTestimonial(formData);
      if (result.message?.includes('بنجاح')) {
        toast.success(result.message);
        setIsOpen(false);
      } else {
        toast.error(result.message || 'حدث خطأ ما.');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild><Button variant="outline" size="sm">تعديل</Button></DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل رأي العميل</DialogTitle>
          <DialogDescription>قم بتغيير بيانات شهادة العميل هنا.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>اسم العميل</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="text" render={({ field }) => (
              <FormItem><FormLabel>نص الشهادة</FormLabel><FormControl><Textarea {...field} rows={5} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="img_src" render={({ field }) => (
              <FormItem><FormLabel>رابط الصورة (اختياري)</FormLabel><FormControl><Input {...field} dir="ltr" className="text-left" /></FormControl><FormMessage /></FormItem>
            )}/>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">إلغاء</Button></DialogClose>
              <Button type="submit" disabled={isPending}>{isPending ? 'جاري الحفظ...' : 'حفظ'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}