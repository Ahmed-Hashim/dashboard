'use client';

import { useRef, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ActionFormState, createLearnItem } from '@/app/actions/learn-sectionActions';
import { LearnSectionItem } from '@/types/types';
import { LearnItemRow } from './LearnItemRow';

export function LearnItemsManager({
  items,
  sectionId,
}: {
  items: LearnSectionItem[];
  sectionId: number;
}) {
  // حالة لتتبع العنصر الذي يتم تعديله حاليًا
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  // حالة خاصة بنموذج "إضافة عنصر جديد"
  const [addFormState, addFormAction, isAddFormPending] = useActionState<ActionFormState, FormData>(createLearnItem, null);
  const addFormRef = useRef<HTMLFormElement>(null);

  // إعادة تعيين نموذج الإضافة بعد الإرسال الناجح
  if (addFormState?.message && !addFormState.errors) {
    addFormRef.current?.reset();
    toast.success(addFormState.message);
    addFormState.message = undefined; // مسح الرسالة لمنع ظهورها مرة أخرى
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة عناصر التعلم</CardTitle>
        <CardDescription>إضافة، عرض، تعديل، وحذف العناصر في هذا القسم.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">العناصر الحالية</h3>
          {items.length > 0 ? (
            <ul className="space-y-3">
              {items.map((item) => (
                <LearnItemRow
                  key={item.id}
                  item={item}
                  isEditing={editingItemId === item.id}
                  onEditClick={setEditingItemId}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">لم تتم إضافة أي عناصر بعد.</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-4">إضافة عنصر جديد</h3>
          <form ref={addFormRef} action={addFormAction} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-start">
            <input type="hidden" name="learn_section_id" value={sectionId} />
            <div className="sm:col-span-3 space-y-2">
              <Label htmlFor="text">نص العنصر</Label>
              <Input id="text" name="text" placeholder="مثال: كيفية إعداد مشروعك" required />
              {addFormState?.errors?.text && <p className="text-sm text-red-500">{addFormState.errors.text[0]}</p>}
            </div>
            <div className="sm:col-span-1 space-y-2">
              <Label htmlFor="icon_name">اسم الأيقونة</Label>
              <Input id="icon_name" name="icon_name" placeholder="package" />
            </div>
            <div className="sm:col-span-1 pt-8">
              <Button type="submit" className="w-full" disabled={isAddFormPending}>
                {isAddFormPending ? 'جاري الإضافة...' : 'إضافة عنصر'}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}