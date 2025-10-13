'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { deletePartner } from '@/app/actions/partnersActions';
import { Button } from '@/components/ui/button';

export function DeletePartnerButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الشريك؟')) {
      startTransition(async () => {
        const result = await deletePartner(id);
        if (result?.message) {
          toast.error(result.message);
        } else {
          toast.success('تم حذف الشريك بنجاح.');
        }
      });
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? 'جاري الحذف...' : 'حذف'}
    </Button>
  );
}