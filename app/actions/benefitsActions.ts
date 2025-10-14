'use server';


import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Benefit } from '@/types/types';
import { createClient } from '@/lib/server';

const ADMIN_PATH = '/content/benefits';

// --- مخطط Zod للتحقق من صحة البيانات ---
const benefitSchema = z.object({
  title: z.string().min(3, 'العنوان قصير جدًا'),
  description: z.string().optional(),
  icon_name: z.string().optional(),
});

const updateBenefitSchema = benefitSchema.extend({
  id: z.coerce.number(),
});

// --- أنواع للحالات والنتائج ---
export type ActionFormState = {
  errors?: { title?: string[]; description?: string[]; icon_name?: string[] };
  message?: string;
  success?: boolean;
} | null;

export type DeleteActionResult = { message: string } | { error: string };

// --- جلب جميع المميزات ---
export async function getBenefits(): Promise<Benefit[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('benefits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('خطأ في جلب المميزات:', error);
    return [];
  }
  return data;
}

// --- إضافة ميزة جديدة ---
export async function createBenefit(prevState: ActionFormState, formData: FormData): Promise<ActionFormState> {
  const supabase = await createClient();
  const validatedFields = benefitSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, success: false };
  }

  const { error } = await supabase.from('benefits').insert(validatedFields.data);

  if (error) {
    return { message: 'فشل في إضافة الميزة.', success: false };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تمت إضافة الميزة بنجاح.', success: true };
}

// --- تعديل ميزة ---
export async function updateBenefit(prevState: ActionFormState, formData: FormData): Promise<ActionFormState> {
  const supabase = await createClient();
  const validatedFields = updateBenefitSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, success: false };
  }

  const { id, ...updateData } = validatedFields.data;
  const { error } = await supabase.from('benefits').update(updateData).eq('id', id);

  if (error) {
    return { message: 'فشل تحديث الميزة.', success: false };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تم تحديث الميزة بنجاح.', success: true };
}

// --- حذف ميزة ---
export async function deleteBenefit(benefitId: number): Promise<DeleteActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('benefits').delete().eq('id', benefitId);

  if (error) {
    return { error: 'فشل حذف الميزة.' };
  }
  
  revalidatePath(ADMIN_PATH);
  return { message: 'تم حذف الميزة بنجاح.' };
}