'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react'; // Correct import
import { createPartner } from '@/app/actions/partnersActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'جاري الإضافة...' : 'إضافة شريك'}
    </Button>
  );
}

export function AddPartnerForm() {
  // Correct hook name
  const [state, formAction] = useActionState(createPartner, null);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="src">رابط شعار الشريك (URL)</Label>
        <Input
          id="src"
          name="src"
          type="url"
          placeholder="https://example.com/logo.png"
          required
          dir="ltr"
          className="text-left"
        />
        {state?.errors?.src && (
          <p className="text-sm text-red-500">{state.errors.src[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="alt">النص البديل (Alt Text)</Label>
        <Input
          id="alt"
          name="alt"
          type="text"
          placeholder="اسم الشريك"
          required
        />
        {state?.errors?.alt && (
          <p className="text-sm text-red-500">{state.errors.alt[0]}</p>
        )}
      </div>
      {state?.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}
      <SubmitButton />
    </form>
  );
}