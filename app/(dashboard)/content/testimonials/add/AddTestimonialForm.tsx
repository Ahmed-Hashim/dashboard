'use client';

import { useActionState } from 'react'; // 1. Change the import source from 'react-dom' to 'react'
import { useFormStatus } from 'react-dom'; // `useFormStatus` remains in 'react-dom'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TestimonialFormState } from '@/types/types';
import { createTestimonial } from '@/app/actions/testimonialsActions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'جاري الإضافة...' : 'إضافة رأي'}
    </Button>
  );
}

const initialState: TestimonialFormState = {
    message: undefined,
    errors: undefined,
};

export function AddTestimonialForm() {
  // 2. Rename useFormState to useActionState
  const [state, formAction] = useActionState(createTestimonial, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">اسم العميل</Label>
        <Input id="name" name="name" placeholder="مثال: محمد أحمد" required />
        {state?.errors?.name && <p className="text-sm text-red-500">{state.errors.name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">نص الشهادة</Label>
        <Textarea id="text" name="text" placeholder="اكتب شهادة العميل هنا..." required />
        {state?.errors?.text && <p className="text-sm text-red-500">{state.errors.text[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="img_src">رابط صورة العميل (اختياري)</Label>
        <Input id="img_src" name="img_src" type="url" placeholder="https://example.com/image.jpg" dir="ltr" className="text-left" />
        {state?.errors?.img_src && <p className="text-sm text-red-500">{state.errors.img_src[0]}</p>}
      </div>

      {state?.message && <p className="text-sm text-red-500">{state.message}</p>}
      <SubmitButton />
    </form>
  );
}