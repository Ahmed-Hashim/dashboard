'use client';

import { toast } from 'sonner';
import { Trash2, Edit } from 'lucide-react';

import { CourseBenefit } from '@/types/types';


import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DeleteActionResult, deleteCourseBenefit } from '@/app/actions/courseActions';

// مكون زر الحذف (لا تغيير هنا، هو جيد كما هو)
function DeleteBenefitButton({ benefitId }: { benefitId: number }) {
  const handleDelete = () => {
    toast.promise(deleteCourseBenefit(benefitId), {
      loading: 'جاري الحذف...',
      success: (result: DeleteActionResult) => {
        if ('error' in result) throw new Error(result.error);
        return result.message;
      },
      error: (err: Error) => err.message,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader><AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle></AlertDialogHeader>
        <AlertDialogDescription>سيؤدي هذا إلى حذف الميزة نهائياً.</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface BenefitRowProps {
  benefit: CourseBenefit;
  // دالة جديدة لاستدعائها عند الضغط على زر التعديل
  onEdit: (benefit: CourseBenefit) => void;
}

export function BenefitRow({ benefit, onEdit }: BenefitRowProps) {
  return (
    <li className="flex items-start justify-between p-3 bg-muted rounded-md">
      <div>
        <p className="font-semibold">{benefit.title}</p>
        <p className="text-sm text-muted-foreground">{benefit.description}</p>
      </div>
      <div className="flex items-center flex-shrink-0">
        {/* زر التعديل الآن يستدعي دالة onEdit */}
        <Button variant="ghost" size="icon" onClick={() => onEdit(benefit)}>
          <Edit className="h-4 w-4" />
        </Button>
        <DeleteBenefitButton benefitId={benefit.id} />
      </div>
    </li>
  );
}