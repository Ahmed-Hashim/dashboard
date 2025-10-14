'use server';

import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Zod Schema for validation (no changes here)
const partnerSchema = z.object({
  src: z.string().url({ message: 'يجب أن يكون رابط الصورة صالحاً' }),
  alt: z.string().min(2, { message: 'يجب أن يكون النص البديل حرفين على الأقل' }),
});

// Type for our form state
export type FormState = {
  errors?: {
    src?: string[];
    alt?: string[];
  };
  message?: string;
} | null;


// --- NEW: Update an existing partner ---
export async function updatePartner(formData: FormData) {
  const id = formData.get('id');
  if (!id) {
    return { message: 'لم يتم العثور على المعرف (ID).' };
  }

  const validatedFields = partnerSchema.safeParse({
    src: formData.get('src'),
    alt: formData.get('alt'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from('partners')
    .update(validatedFields.data)
    .eq('id', Number(id));

  if (error) {
    console.error('Supabase update error:', error);
    return {
      message: 'فشل في تحديث الشريك في قاعدة البيانات.',
    };
  }

  revalidatePath('/content/partners'); // Refresh the partners list
  return {
    message: 'تم تحديث الشريك بنجاح!',
  };
}
// Fetch all partners (no changes here)
export async function getPartners() {
  // ... (this function is correct)
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching partners:', error);
    return [];
  }
  return data;
}


// --- THIS IS THE CORRECTED FUNCTION ---
// Add `prevState` as the first argument
export async function createPartner(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = partnerSchema.safeParse({
    src: formData.get('src'),
    alt: formData.get('alt'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from('partners').insert(validatedFields.data);

  if (error) {
    return {
      message: 'فشل في إضافة الشريك إلى قاعدة البيانات.',
    };
  }

  revalidatePath('/content/partners');
  redirect('/content/partners');
}
// حذف شريك
export async function deletePartner(id: number) {
  const { error } = await supabase.from('partners').delete().eq('id', id);

  if (error) {
    return {
      message: 'فشل في حذف الشريك.',
    };
  }

  revalidatePath('/content/partners'); // لتحديث قائمة الشركاء
}