'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

import { CourseBenefit } from '@/types/types';
import { createCourseBenefit, updateCourseBenefit, deleteCourseBenefit, BenefitFormState, DeleteActionResult } from '@/app/actions/courseActions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// --- مكونات فرعية معاد استخدامها ---
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'جاري الحفظ...' : children}</Button>;
}

function BenefitForm({ benefit, closeDialog }: { benefit?: CourseBenefit; closeDialog: () => void }) {
  const action = benefit ? updateCourseBenefit : createCourseBenefit;
  const [state, formAction] = useActionState<BenefitFormState, FormData>(action, null);
  
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      closeDialog();
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, closeDialog]);

  return (
    <form action={formAction} className="space-y-4">
      {benefit && <input type="hidden" name="id" value={benefit.id} />}
      <div>
        <Label htmlFor="title">عنوان الميزة</Label>
        <Input id="title" name="title" defaultValue={benefit?.title} required />
        {state?.errors?.title && <p className="text-sm text-red-500 mt-1">{state.errors.title[0]}</p>}
      </div>
      <div>
        <Label htmlFor="description">الوصف (اختياري)</Label>
        <Textarea id="description" name="description" defaultValue={benefit?.description || ''} />
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
        <SubmitButton>{benefit ? 'حفظ التعديلات' : 'إضافة ميزة'}</SubmitButton>
      </DialogFooter>
    </form>
  );
}

// --- المكون الرئيسي للمميزات ---
export function CourseBenefitsManager({ initialBenefits }: { initialBenefits: CourseBenefit[] }) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<CourseBenefit | null>(null);

  const handleDelete = (benefitId: number) => {
    toast.promise(deleteCourseBenefit(benefitId), {
      loading: 'جاري حذف الميزة...',
      success: (result: DeleteActionResult) => {
        if ('error' in result) throw new Error(result.error);
        return result.message;
      },
      error: (err: Error) => err.message,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>مميزات الكورس</CardTitle>
                <CardDescription>إدارة النقاط التي تظهر كمميزات رئيسية للدورة.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild><Button><PlusCircle className="ml-2 h-4 w-4" />إضافة ميزة</Button></DialogTrigger>
                <DialogContent dir="rtl">
                    <DialogHeader><DialogTitle>إضافة ميزة جديدة</DialogTitle></DialogHeader>
                    <BenefitForm closeDialog={() => setAddDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={!!editingBenefit} onOpenChange={(open) => !open && setEditingBenefit(null)}>
          <DialogContent dir="rtl">
            <DialogHeader><DialogTitle>تعديل الميزة</DialogTitle></DialogHeader>
            {editingBenefit && <BenefitForm benefit={editingBenefit} closeDialog={() => setEditingBenefit(null)} />}
          </DialogContent>
        </Dialog>
        
        <Table>
          <TableHeader><TableRow><TableHead>العنوان</TableHead><TableHead>الوصف</TableHead><TableHead>الإجراءات</TableHead></TableRow></TableHeader>
          <TableBody>
            {initialBenefits.map((benefit) => (
              <TableRow key={benefit.id}>
                <TableCell className="font-medium">{benefit.title}</TableCell>
                <TableCell>{benefit.description}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => setEditingBenefit(benefit)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader><AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogDescription>سيتم حذف هذه الميزة نهائياً.</AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(benefit.id)} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialBenefits.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">لم تتم إضافة أي مميزات بعد.</p>}
      </CardContent>
    </Card>
  );
}