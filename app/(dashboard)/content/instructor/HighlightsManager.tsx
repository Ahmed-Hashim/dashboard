'use client';

import { useRef, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';

import { InstructorHighlight } from '@/types/types';


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ActionFormState, createInstructorHighlight } from '@/app/actions/instractorActions';
import { HighlightRow } from './HighlightRow';

export function HighlightsManager({
  highlights,
  instructorId,
}: {
  highlights: InstructorHighlight[];
  instructorId: number;
}) {
  const [editingHighlightId, setEditingHighlightId] = useState<number | null>(null);
  const [addFormState, addFormAction, isAddFormPending] = useActionState<ActionFormState, FormData>(createInstructorHighlight, null);
  const addFormRef = useRef<HTMLFormElement>(null);

  if (addFormState?.message && !addFormState.errors) {
    addFormRef.current?.reset();
    toast.success(addFormState.message);
    addFormState.message = undefined;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة نقاط التميز</CardTitle>
        <CardDescription>إضافة، تعديل، وحذف النقاط التي تظهر في صفحة المدرب.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">النقاط الحالية</h3>
          {highlights.length > 0 ? (
            <ul className="space-y-3">
              {highlights.map((highlight) => (
                <HighlightRow
                  key={highlight.id}
                  highlight={highlight}
                  isEditing={editingHighlightId === highlight.id}
                  onEditClick={setEditingHighlightId}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">لم تتم إضافة أي نقاط تميز بعد.</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-4">إضافة نقطة جديدة</h3>
          <form ref={addFormRef} action={addFormAction} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-start">
            <input type="hidden" name="instructor_id" value={instructorId} />
            <div className="sm:col-span-3 space-y-2">
              <Label htmlFor="text">نص النقطة</Label>
              <Input id="text" name="text" placeholder="مثال: أكثر من 10 سنوات خبرة" required />
              {addFormState?.errors?.text && <p className="text-sm text-red-500">{addFormState.errors.text[0]}</p>}
            </div>
            <div className="sm:col-span-1 space-y-2">
              <Label htmlFor="order_index">الترتيب</Label>
              <Input id="order_index" name="order_index" type="number" placeholder="1" />
            </div>
            <div className="sm:col-span-1 pt-8">
              <Button type="submit" className="w-full" disabled={isAddFormPending}>
                {isAddFormPending ? 'جاري الإضافة...' : 'إضافة'}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}