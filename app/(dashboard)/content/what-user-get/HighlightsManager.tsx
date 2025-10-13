'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

import { BeforeCtaHighlight } from '@/types/types';
import { createBeforeCtaHighlight, updateBeforeCtaHighlight, deleteBeforeCtaHighlight, HighlightFormState, DeleteActionResult } from '@/app/actions/whatUserGetActions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// --- مكونات فرعية ---
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'جاري الحفظ...' : children}</Button>;
}

function HighlightForm({ highlight, closeDialog }: { highlight?: BeforeCtaHighlight; closeDialog: () => void }) {
  const action = highlight ? updateBeforeCtaHighlight : createBeforeCtaHighlight;
  const [state, formAction] = useActionState<HighlightFormState, FormData>(action, null);
  
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
      {highlight && <input type="hidden" name="id" value={highlight.id} />}
      <div>
        <Label htmlFor="title">العنوان</Label>
        <Input id="title" name="title" defaultValue={highlight?.title} required />
        {state?.errors?.title && <p className="text-sm text-red-500 mt-1">{state.errors.title[0]}</p>}
      </div>
      <div>
        <Label htmlFor="description">الوصف</Label>
        <Textarea id="description" name="description" defaultValue={highlight?.description || ''} />
      </div>
      <div>
        <Label htmlFor="icon_name">اسم الأيقونة (من Lucide)</Label>
        <Input id="icon_name" name="icon_name" defaultValue={highlight?.icon_name || ''} placeholder="Award" />
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
        <SubmitButton>{highlight ? 'حفظ التعديلات' : 'إضافة نقطة'}</SubmitButton>
      </DialogFooter>
    </form>
  );
}

// --- المكون الرئيسي للمميزات ---
export function HighlightsManager({ initialHighlights }: { initialHighlights: BeforeCtaHighlight[] }) {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<BeforeCtaHighlight | null>(null);

  const handleDelete = (highlightId: number) => {
    toast.promise(deleteBeforeCtaHighlight(highlightId), {
      loading: 'جاري حذف النقطة...',
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
                <CardTitle className='py-1'>النقاط البارزة في القسم</CardTitle>
                <CardDescription>إدارة النقاط التي تشرح مميزات الدورة.</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild><Button><PlusCircle className="ml-2 h-4 w-4" />إضافة نقطة</Button></DialogTrigger>
                <DialogContent dir="rtl">
                    <DialogHeader><DialogTitle>إضافة نقطة بارزة جديدة</DialogTitle></DialogHeader>
                    <HighlightForm closeDialog={() => setAddDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={!!editingHighlight} onOpenChange={(open) => !open && setEditingHighlight(null)}>
          <DialogContent dir="rtl">
            <DialogHeader><DialogTitle>تعديل النقطة البارزة</DialogTitle></DialogHeader>
            {editingHighlight && <HighlightForm highlight={editingHighlight} closeDialog={() => setEditingHighlight(null)} />}
          </DialogContent>
        </Dialog>
        
        <Table>
          <TableHeader><TableRow><TableHead>العنوان</TableHead><TableHead>الوصف</TableHead><TableHead>الأيقونة</TableHead><TableHead>الإجراءات</TableHead></TableRow></TableHeader>
          <TableBody>
            {initialHighlights.map((highlight) => (
              <TableRow key={highlight.id}>
                <TableCell className="font-medium">{highlight.title}</TableCell>
                <TableCell>{highlight.description}</TableCell>
                <TableCell>{highlight.icon_name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => setEditingHighlight(highlight)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader><AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle></AlertDialogHeader>
                        <AlertDialogDescription>سيتم حذف هذه النقطة نهائياً.</AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(highlight.id)} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialHighlights.length === 0 && <p className="text-center text-sm text-muted-foreground py-4">لم تتم إضافة أي نقاط بعد.</p>}
      </CardContent>
    </Card>
  );
}