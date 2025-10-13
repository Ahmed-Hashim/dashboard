'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { BeforeCtaSection } from '@/types/types';
import { updateBeforeCtaSection } from '@/app/actions/whatUserGetActions';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  title_main: z.string().min(3, 'العنوان قصير جدًا').optional(),
  title_highlight: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

export function SectionForm({ section }: { section: BeforeCtaSection }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title_main: section.title_main || '',
      title_highlight: section.title_highlight || '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value || ''));

    startTransition(async () => {
      const result = await updateBeforeCtaSection(formData);
      if (result.error) toast.error(result.error);
      else if (result.message) toast.success(result.message);
    });
  };

  return (
    <Card>
      <CardHeader><CardTitle>تعديل عنوان القسم</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="title_main" render={({ field }) => (
                <FormItem><FormLabel>العنوان الرئيسي</FormLabel><FormControl><Input placeholder="لماذا تختار دورتنا؟" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="title_highlight" render={({ field }) => (
                <FormItem><FormLabel>النص المُميّز</FormLabel><FormControl><Input placeholder="دورتنا" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <Button type="submit" disabled={isPending}>{isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}