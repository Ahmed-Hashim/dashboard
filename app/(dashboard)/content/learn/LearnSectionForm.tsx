'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateLearnSection } from '@/app/actions/learn-sectionActions';
import { LearnSection } from '@/types/types';

const formSchema = z.object({
  section_title: z.string().min(3, 'العنوان قصير جداً'),
  highlighted_word: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function LearnSectionForm({ section }: { section: LearnSection }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      section_title: section.section_title || '',
      highlighted_word: section.highlighted_word || '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value || '');
    });

    startTransition(async () => {
      const result = await updateLearnSection(section.id, formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.message) {
        toast.success(result.message);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>تعديل تفاصيل القسم</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="section_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان القسم</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: ماذا ستتعلم في هذه الدورة" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="highlighted_word"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الكلمة المميزة</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: ستتعلم" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'جاري الحفظ...' : 'حفظ القسم'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}