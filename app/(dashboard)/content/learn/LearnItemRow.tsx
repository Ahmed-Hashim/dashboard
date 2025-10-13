'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, Package, Trash2, Edit, X, Save } from 'lucide-react';
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
import { deleteLearnItem, ActionFormState, updateLearnItem } from '@/app/actions/learn-sectionActions';
import { LearnSectionItem } from '@/types/types';

// --- (1) ابدأ التعديل هنا: تعريف نوع دقيق لنتيجة الحذف ---
// هذا النوع يصف بالضبط ما تعيده دالة السيرفر: إما رسالة نجاح أو رسالة خطأ
type DeleteActionResult = { message: string; error?: undefined } | { error: string; message?: undefined };
// --- نهاية التعديل (1) ---

interface LearnItemRowProps {
  item: LearnSectionItem;
  isEditing: boolean;
  onEditClick: (id: number | null) => void;
}

function DeleteItemButton({ itemId }: { itemId: number }) {
  const handleDelete = () => {
    // `deleteLearnItem` تعيد Promise<DeleteActionResult>
    const promiseToDelete = deleteLearnItem(itemId);

    // --- (2) ابدأ التعديل هنا: استخدام النوع الدقيق داخل toast.promise ---
    toast.promise(promiseToDelete, {
      loading: 'جاري حذف العنصر...',
      // `result` الآن من نوع `DeleteActionResult`، وليس `any`
      success: (result: DeleteActionResult) => {
        // إذا أعاد السيرفر كائن خطأ، نلقي به لكي يلتقطه قسم الخطأ في التوست
        if (result.error) {
          throw new Error(result.error);
        }
        // إذا كان هناك رسالة نجاح، نعرضها
        return result.message || 'تم الحذف بنجاح!';
      },
      // `err` الآن من نوع `Error`، وليس `any`
      error: (err: Error) => {
        // نعرض رسالة الخطأ
        return err.message || 'فشل حذف العنصر.';
      },
    });
    // --- نهاية التعديل (2) ---
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد تماماً؟</AlertDialogTitle>
          <AlertDialogDescription>
            هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف العنصر نهائياً
            من قاعدة البيانات.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            نعم، قم بالحذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// --- لا توجد تغييرات في بقية الملف ---
export function LearnItemRow({ item, isEditing, onEditClick }: LearnItemRowProps) {
  const [updateState, updateFormAction, isUpdatePending] = useActionState<ActionFormState, FormData>(updateLearnItem, null);

  useEffect(() => {
    if (updateState?.message && !updateState.errors) {
      toast.success(updateState.message);
      onEditClick(null);
    } else if (updateState?.message && updateState.errors) {
      toast.error(updateState.message);
    }
  }, [updateState, onEditClick]);

  if (isEditing) {
    return (
      <li className="flex items-center justify-between p-3 bg-secondary rounded-md">
        <form action={updateFormAction} className="flex-grow flex items-center gap-2">
          <input type="hidden" name="id" value={item.id} />
          <Input name="text" defaultValue={item.text} className="h-9 flex-grow" required />
          <Input name="icon_name" defaultValue={item.icon_name || ''} placeholder="أيقونة" className="h-9 w-24" />
          <Button type="submit" size="icon" variant="ghost" disabled={isUpdatePending}>
            <Save className="h-4 w-4 text-primary" />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => onEditClick(null)}>
            <X className="h-4 w-4" />
          </Button>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between p-3 bg-muted rounded-md">
      <div className="flex items-center gap-3">
        {item.icon_name === 'package' ? <Package className="h-5 w-5 text-primary" /> : <CheckCircle className="h-5 w-5 text-primary" />}
        <span>{item.text}</span>
      </div>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => onEditClick(item.id)}>
          <Edit className="h-4 w-4" />
        </Button>
        <DeleteItemButton itemId={item.id} />
      </div>
    </li>
  );
}