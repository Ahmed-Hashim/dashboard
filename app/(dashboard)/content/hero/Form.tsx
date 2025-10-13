'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import Image from 'next/image'; // لاستخدام الصورة

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// تأكد من مسار الأنواع (Types) الخاص بك
import { HeroSection } from '@/types/types'; 
import { updateHeroSection } from '@/app/actions/heroSectionActions';


// تعريب رسائل التحقق في Zod
const formSchema = z.object({
  title: z.string().min(3, 'يجب أن يحتوي العنوان على 3 أحرف على الأقل'),
  description: z.string().optional(),
  highlight_text: z.string().optional(),
  cta_primary_text: z.string().optional(),
  cta_secondary_text: z.string().optional(),
  video_src: z.string().url('يجب أن يكون رابطاً صالحاً (URL)').optional().or(z.literal('')),
});

type HeroSectionFormValues = z.infer<typeof formSchema>;

interface HeroSectionFormProps {
  heroSection: HeroSection | null;
}

export function HeroSectionForm({ heroSection }: HeroSectionFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<HeroSectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: heroSection?.title || '',
      description: heroSection?.description || '',
      highlight_text: heroSection?.highlight_text || '',
      cta_primary_text: heroSection?.cta_primary_text || '',
      cta_secondary_text: heroSection?.cta_secondary_text || '',
      video_src: heroSection?.video_src || '',
    },
  });

  const onSubmit = (values: HeroSectionFormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    startTransition(async () => {
      const result = await updateHeroSection(formData);
      if (result?.message) {
        // نفترض أن الرسالة القادمة من السيرفر ستكون أيضاً بالعربية أو يمكنك تعريبها هنا
        toast.success('تم تحديث البيانات بنجاح!'); 
      } else if (result?.errors) {
        toast.error('فشل التحقق. يرجى مراجعة الحقول في النموذج.');
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* الصورة التوضيحية */}
      <div className="rounded-lg overflow-hidden border border-border shadow-sm">
        <div className="bg-muted p-2 text-sm text-muted-foreground text-center border-b">
          معاينة المنطقة التي يتم تعديلها
        </div>
        <div className="relative w-full h-48 md:h-64 bg-gray-100">
            {/* تأكد من وضع الصورة في مجلد public/content/hero.webp */}
            <Image 
                src="/content/hero.png"
                alt="توضيح قسم الهيرو"
                fill
                className="object-cover"
                priority
            />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>العنوان الرئيسي</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل العنوان هنا..." {...field} className="text-right" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوصف</FormLabel>
                <FormControl>
                  <Textarea placeholder="أدخل وصف القسم هنا..." {...field} className="text-right min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="highlight_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>النص المميز (Highlight)</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: عرض خاص لفترة محدودة" {...field} className="text-right" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
              control={form.control}
              name="cta_primary_text"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>نص الزر الرئيسي</FormLabel>
                  <FormControl>
                      <Input placeholder="مثال: ابدأ الآن" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="cta_secondary_text"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>نص الزر الثانوي</FormLabel>
                  <FormControl>
                      <Input placeholder="مثال: اعرف المزيد" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
              />
          </div>
          
          <FormField
            control={form.control}
            name="video_src"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رابط الفيديو (اختياري)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/video.mp4" {...field} dir="ltr" className="text-left" />
                </FormControl>
                <p className="text-xs text-muted-foreground text-right">يفضل أن يكون الرابط مباشراً لملف mp4.</p>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isPending} className="w-full md:w-auto">
            {isPending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
          </Button>
        </form>
      </Form>
    </div>
  );
}