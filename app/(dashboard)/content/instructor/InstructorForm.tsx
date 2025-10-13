'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Instructor } from '@/types/types';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateInstructor } from '@/app/actions/instractorActions';

const formSchema = z.object({
  name: z.string().min(3, 'الاسم قصير جدًا'),
  title: z.string().optional(),
  image_src: z.string().optional(),
  linkedin_url: z.string().url('رابط LinkedIn غير صالح').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

export function InstructorForm({ instructor }: { instructor: Instructor }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: instructor.name || '',
      title: instructor.title || '',
      image_src: instructor.image_src || '',
      linkedin_url: instructor.linkedin_url || '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || '');
    });

    startTransition(async () => {
      const result = await updateInstructor(formData);
      if (result.error) toast.error(result.error);
      else if (result.message) toast.success(result.message);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>تعديل بيانات المدرب</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl><Input placeholder="اسم المدرب" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>اللقب الوظيفي</FormLabel>
                  <FormControl><Input placeholder="مثال: مطور ويب خبير" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="image_src" render={({ field }) => (
              <FormItem>
                <FormLabel>رابط الصورة</FormLabel>
                <FormControl><Input dir="ltr" className="text-left" placeholder="/images/instructor.png" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="linkedin_url" render={({ field }) => (
              <FormItem>
                <FormLabel>رابط حساب LinkedIn</FormLabel>
                <FormControl><Input dir="ltr" className="text-left" placeholder="https://linkedin.com/in/..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" disabled={isPending}>
              {isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}