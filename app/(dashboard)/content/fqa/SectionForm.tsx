'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { FaqSection } from '@/types/types';
import { updateFaqSection } from '@/app/actions/faqActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SectionForm({ section }: { section: FaqSection }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      title_part_1: section.title_part_1 || '',
      title_part_2: section.title_part_2 || '',
    },
  });

  const onSubmit = (values: { title_part_1?: string; title_part_2?: string }) => {
    const formData = new FormData();
    formData.append('title_part_1', values.title_part_1 || '');
    formData.append('title_part_2', values.title_part_2 || '');

    startTransition(async () => {
      const result = await updateFaqSection(formData);
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
              <FormField control={form.control} name="title_part_1" render={({ field }) => (
                <FormItem><FormLabel>الجزء الأول من العنوان</FormLabel><FormControl><Input placeholder="لديك أسئلة؟" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="title_part_2" render={({ field }) => (
                <FormItem><FormLabel>الجزء الثاني من العنوان</FormLabel><FormControl><Input placeholder="لدينا الأجوبة" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <Button type="submit" disabled={isPending}>{isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}