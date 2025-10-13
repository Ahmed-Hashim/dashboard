'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Trash2, Edit, X, Save } from 'lucide-react';

import { InstructorHighlight } from '@/types/types';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from "@/components/ui/alert-dialog";
import { deleteInstructorHighlight, DeleteActionResult, updateInstructorHighlight } from '@/app/actions/instractorActions';
import { ActionFormState } from '@/app/actions/learn-sectionActions';

interface HighlightRowProps {
  highlight: InstructorHighlight;
  isEditing: boolean;
  onEditClick: (id: number | null) => void;
}

function DeleteHighlightButton({ highlightId }: { highlightId: number }) {
  const handleDelete = () => {
    const promiseToDelete = deleteInstructorHighlight(highlightId);
    toast.promise(promiseToDelete, {
      loading: 'جاري حذف النقطة...',
      success: (result: DeleteActionResult) => {
        if (result.error) throw new Error(result.error);
        return result.message || 'تم الحذف بنجاح!';
      },
      error: (err: Error) => err.message || 'فشل حذف النقطة.',
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription>هذا الإجراء سيحذف النقطة نهائياً ولا يمكن التراجع عنه.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function HighlightRow({ highlight, isEditing, onEditClick }: HighlightRowProps) {
  const [updateState, updateFormAction, isUpdatePending] = useActionState<ActionFormState, FormData>(updateInstructorHighlight, null);

  useEffect(() => {
    if (updateState?.message && !updateState.errors) {
      toast.success(updateState.message);
      onEditClick(null);
    } else if (updateState?.message) {
      toast.error(updateState.message);
    }
  }, [updateState, onEditClick]);

  if (isEditing) {
    return (
      <li className="p-3 bg-secondary rounded-md">
        <form action={updateFormAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={highlight.id} />
          <Input name="text" defaultValue={highlight.text} className="h-9 flex-grow" required />
          <Input name="order_index" type="number" defaultValue={highlight.order_index ?? ''} placeholder="ترتيب" className="h-9 w-24" />
          <Button type="submit" size="icon" variant="ghost" disabled={isUpdatePending}><Save className="h-4 w-4 text-primary" /></Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => onEditClick(null)}><X className="h-4 w-4" /></Button>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between p-3 bg-muted rounded-md">
      <span>{highlight.text}</span>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => onEditClick(highlight.id)}><Edit className="h-4 w-4" /></Button>
        <DeleteHighlightButton highlightId={highlight.id} />
      </div>
    </li>
  );
}