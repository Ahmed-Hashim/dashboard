'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

import { FaqItem } from '@/types/types';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { createFaqItem, DeleteActionResult, deleteFaqItem, ItemFormState, updateFaqItem } from '@/app/actions/faqActions';

// --- مكونات فرعية ---
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'جاري الحفظ...' : children}</Button>;
}

function FaqItemForm({ item, closeDialog }: { item?: FaqItem; closeDialog: () => void }) {
  const action = item ? updateFaqItem : createFaqItem;
  const [state, formAction] = useActionState<ItemFormState, FormData>(action, null);
  
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
      {item && <input type="hidden" name="id" value={item.id} />}
      <div>
        <Label htmlFor="question">السؤال</Label>
        <Input id="question" name="question" defaultValue={item?.question} required />
        {state?.errors?.question && <p className="text-sm text-red-500 mt-1">{state.errors.question[0]}</p>}
      </div>
      <div>
        <Label htmlFor="answer">الإجابة</Label>
        <Textarea id="answer" name="answer" defaultValue={item?.answer || ''} required rows={5} />
        {state?.errors?.answer && <p className="text-sm text-red-500 mt-1">{state.errors.answer[0]}</p>}
      </div>
      <div>
        <Label htmlFor="order_index">الترتيب (اختياري)</Label>
        <Input type="number" id="order_index" name="order_index" defaultValue={item?.order_index || ''} />
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
        <SubmitButton>{item ? 'حفظ التعديلات' : 'إضافة سؤال'}</SubmitButton>
      </DialogFooter>
    </form>
  );
}

// --- المكون الرئيسي للأسئلة ---
export function FaqItemsManager({ initialItems }: { initialItems: FaqItem[] }) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);

  const handleDelete = (itemId: number) => {
    toast.promise(deleteFaqItem(itemId), {
      loading: 'جاري حذف السؤال...',
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
                <CardTitle>الأسئلة الشائعة</CardTitle>
                <CardDescription>إدارة الأسئلة والأجوبة التي تظهر في القسم.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild><Button><PlusCircle className="ml-2 h-4 w-4" />إضافة سؤال</Button></DialogTrigger>
                <DialogContent dir="rtl">
                    <DialogHeader><DialogTitle>إضافة سؤال جديد</DialogTitle></DialogHeader>
                    <FaqItemForm closeDialog={() => setAddDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent dir="rtl">
            <DialogHeader><DialogTitle>تعديل السؤال</DialogTitle></DialogHeader>
            {editingItem && <FaqItemForm item={editingItem} closeDialog={() => setEditingItem(null)} />}
          </DialogContent>
        </Dialog>
        
        <Table>
          <TableHeader><TableRow><TableHead>السؤال</TableHead><TableHead className="w-1/3">الإجابة</TableHead><TableHead>الإجراءات</TableHead></TableRow></TableHeader>
          <TableBody>
            {initialItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.question}</TableCell>
                <TableCell className="text-sm text-muted-foreground truncate">{item.answer}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader><AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogDescription>سيتم حذف هذا السؤال نهائياً.</AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialItems.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">لم تتم إضافة أي أسئلة بعد.</p>}
      </CardContent>
    </Card>
  );
}