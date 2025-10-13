'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Course } from '@/types/types';
import { updateCourse } from '@/app/actions/courseActions';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  title: z.string().min(3, 'العنوان قصير جدًا'),
  description: z.string().optional(),
  yt_video_id: z.string().optional(),
  image_url: z.string().optional(),
  // سنجعل Zod أكثر مرونة مع القيم الاختيارية
  price: z.coerce.number().min(0, 'السعر يجب أن يكون موجبًا').optional().nullable(),
  instructor: z.string().optional(),
  published: z.boolean().default(false),
  seo_meta: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CourseForm({ course }: { course: Course }) {
  const [isPending, startTransition] = useTransition();

  // نستخدم الحل الذي يزيل النوع العام من useForm ويثق في zodResolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title || '',
      description: course.description || '',
      yt_video_id: course.yt_video_id || '',
      image_url: course.image_url || '',
      price: course.price, // يمكن أن يكون null
      instructor: course.instructor || '',
      published: course.published || false,
      seo_meta: course.seo_meta ? JSON.stringify(course.seo_meta, null, 2) : '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const formData = new FormData();
    
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'published') {
        formData.append(key, String(value));
      }
    });

    if (values.published) {
      formData.append('published', 'on');
    }

    startTransition(async () => {
      const result = await updateCourse(formData);
      if (result.error) {
        toast.error('حدث خطأ أثناء التحديث.');
        console.error(result.error);
      } else if (result.message) {
        toast.success(result.message);
      }
    });
  };

  return (
    <Card>
      <CardHeader><CardTitle>بيانات الكورس الأساسية</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ... بقية الحقول تبقى كما هي ... */}
            <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>عنوان الكورس</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>الوصف</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- ابدأ التعديل هنا: هذا هو التصحيح لحقل السعر --- */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السعر</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="99.99"
                          // نزيل {...field} لتوفير التحكم الكامل
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          // نعرض القيمة الحالية، ونجعلها نصًا فارغًا إذا كانت null أو undefined
                     
                          // هذا هو الجزء الأهم: نحول القيمة إلى رقم عند التغيير
                          onChange={(e) => {
                            const value = e.target.value;
                            // إذا كان الحقل فارغًا، نمرر null
                            // وإلا، نستخدم '+' لتحويل النص إلى رقم
                            field.onChange(value === '' ? null : +value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* --- نهاية التعديل --- */}
                <FormField control={form.control} name="instructor" render={({ field }) => (
                    <FormItem><FormLabel>اسم المدرب</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>

            {/* ... بقية الحقول تبقى كما هي ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="yt_video_id" render={({ field }) => (
                    <FormItem><FormLabel>معرف فيديو يوتيوب</FormLabel><FormControl><Input dir="ltr" className="text-left" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="image_url" render={({ field }) => (
                    <FormItem><FormLabel>رابط صورة الكورس</FormLabel><FormControl><Input dir="ltr" className="text-left" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
            <FormField control={form.control} name="seo_meta" render={({ field }) => (
                <FormItem><FormLabel>بيانات SEO (JSON)</FormLabel><FormControl><Textarea dir="ltr" className="text-left font-mono" rows={5} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="published" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5"><FormLabel>منشور؟</FormLabel></div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
            )} />
            <Button type="submit" disabled={isPending}>{isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}