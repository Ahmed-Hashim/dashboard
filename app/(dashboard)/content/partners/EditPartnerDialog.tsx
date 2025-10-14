'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';


import { updatePartner } from '@/app/actions/partnersActions';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tables } from '@/types/database';

// Zod schema for client-side validation
const formSchema = z.object({
  src: z.string().url({ message: 'يجب أن يكون رابط الصورة صالحاً' }),
  alt: z.string().min(2, { message: 'يجب أن يكون النص البديل حرفين على الأقل' }),
});

type PartnerFormValues = z.infer<typeof formSchema>;

// Type for our partner from the database
type Partner = Tables<"partners">;

interface EditPartnerDialogProps {
  partner: Partner;
}

export function EditPartnerDialog({ partner }: EditPartnerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      src: partner.src,
      alt: partner.alt,
    },
  });

  const onSubmit = (values: PartnerFormValues) => {
    const formData = new FormData();
    formData.append('id', partner.id.toString());
    formData.append('src', values.src);
    formData.append('alt', values.alt);

    startTransition(async () => {
      const result = await updatePartner(formData);
      if (result.message?.includes('بنجاح')) {
        toast.success(result.message);
        setIsOpen(false); // Close the dialog on success
      } else {
        toast.error(result.message || 'حدث خطأ ما.');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          تعديل
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل الشريك</DialogTitle>
          <DialogDescription>
            قم بتغيير بيانات الشريك هنا. انقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="src"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رابط الشعار (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/logo.png" {...field} dir="ltr" className="text-left" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النص البديل (Alt Text)</FormLabel>
                  <FormControl>
                    <Input placeholder="اسم الشريك" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        إلغاء
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}