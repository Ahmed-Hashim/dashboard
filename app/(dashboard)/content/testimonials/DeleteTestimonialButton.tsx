'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { deleteTestimonial } from '@/app/actions/testimonialsActions';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function DeleteTestimonialButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  // The deletion logic is now triggered by the "Continue" button in the dialog
  const handleConfirmDelete = () => {
    startTransition(async () => {
      const result = await deleteTestimonial(id);
      if (result?.message) {
        toast.error(result.message);
      } else {
        toast.success('تم حذف الرأي بنجاح.');
      }
      // The dialog will close automatically after the action
    });
  };

  return (
    <AlertDialog >
      <AlertDialogTrigger asChild>
        {/* This is the button that opens the dialog */}
        <Button variant="destructive" size="sm" disabled={isPending}>
          حذف
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right text-red-300">هل أنت متأكد تماماً؟</AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف شهادة الرأي بشكل دائم من قاعدة البيانات.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* The Cancel button simply closes the dialog */}
          <AlertDialogCancel disabled={isPending}>إلغاء</AlertDialogCancel>
          
          {/* The Action button triggers our deletion logic */}
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'جاري الحذف...' : 'نعم، حذف'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}