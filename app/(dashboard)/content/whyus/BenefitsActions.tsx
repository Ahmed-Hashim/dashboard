'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

import { Benefit } from '@/types/types';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ActionFormState, createBenefit, DeleteActionResult, deleteBenefit, updateBenefit } from '@/app/actions/benefitsActions';

// --- مكونات فرعية ---

// زر الإرسال للنماذج لإظهار حالة التحميل
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'جاري الحفظ...' : children}</Button>;
}

// زر الحذف مع مربع حوار للتأكيد
function DeleteBenefitButton({ benefitId }: { benefitId: number }) {
  const handleDelete = () => {
    toast.promise(deleteBenefit(benefitId), {
      loading: 'جاري حذف الميزة...',
      success: (result: DeleteActionResult) => {
        if ('error' in result) throw new Error(result.error);
        return result.message;
      },
      error: (err: Error) => err.message,
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader><AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle></AlertDialogHeader>
        <AlertDialogDescription>هذا الإجراء سيحذف الميزة نهائياً ولا يمكن التراجع عنه.</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// نموذج الإضافة/التعديل
function BenefitForm({ benefit, closeDialog }: { benefit?: Benefit; closeDialog: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = benefit ? updateBenefit : createBenefit;
  const [state, formAction] = useActionState<ActionFormState, FormData>(action, null);
  
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      closeDialog();
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, closeDialog]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {benefit && <input type="hidden" name="id" value={benefit.id} />}
      <div>
        <Label htmlFor="title">العنوان</Label>
        <Input id="title" name="title" defaultValue={benefit?.title} required />
        {state?.errors?.title && <p className="text-sm text-red-500 mt-1">{state.errors.title[0]}</p>}
      </div>
      <div>
        <Label htmlFor="description">الوصف</Label>
        <Textarea id="description" name="description" defaultValue={benefit?.description || ''} />
      </div>
      <div>
        <Label htmlFor="icon_name">اسم الأيقونة (من Lucide)</Label>
        <Input id="icon_name" name="icon_name" defaultValue={benefit?.icon_name || ''} placeholder="Rocket" />
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
        <SubmitButton>{benefit ? 'حفظ التعديلات' : 'إضافة ميزة'}</SubmitButton>
      </DialogFooter>
    </form>
  );
}


// --- المكون الرئيسي ---
export function BenefitsActions({ initialBenefits }: { initialBenefits: Benefit[] }) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);

  return (
    <div className="space-y-4">
      <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="ml-2 h-4 w-4" />
            إضافة ميزة جديدة
          </Button>
        </DialogTrigger>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>إضافة ميزة جديدة</DialogTitle></DialogHeader>
          <BenefitForm closeDialog={() => setAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!editingBenefit} onOpenChange={(open) => !open && setEditingBenefit(null)}>
        <DialogContent dir="rtl">
          <DialogHeader><DialogTitle>تعديل الميزة</DialogTitle></DialogHeader>
          {editingBenefit && <BenefitForm benefit={editingBenefit} closeDialog={() => setEditingBenefit(null)} />}
        </DialogContent>
      </Dialog>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>العنوان</TableHead>
            <TableHead>الوصف</TableHead>
            <TableHead>الأيقونة</TableHead>
            <TableHead>الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialBenefits.length > 0 ? (
            initialBenefits.map((benefit) => (
              <TableRow key={benefit.id}>
                <TableCell className="font-medium">{benefit.title}</TableCell>
                <TableCell>{benefit.description}</TableCell>
                <TableCell>{benefit.icon_name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => setEditingBenefit(benefit)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DeleteBenefitButton benefitId={benefit.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">لم تتم إضافة أي مميزات بعد.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}