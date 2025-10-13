'use server';


import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { BeforeCtaSectionWithHighlights } from '@/types/types';
import { createClient } from '@/lib/server';

const ADMIN_PATH = '/content/what-user-get';
const SECTION_ID = 1; // نعمل دائمًا على القسم رقم 1

// --- مخططات Zod للتحقق ---
const sectionSchema = z.object({
  title_main: z.string().min(3, 'العنوان الرئيسي قصير جدًا').optional(),
  title_highlight: z.string().optional(),
});

const highlightSchema = z.object({
  title: z.string().min(3, 'العنوان قصير جدًا'),
  description: z.string().optional(),
  icon_name: z.string().optional(),
});

const createHighlightSchema = highlightSchema.extend({
  section_id: z.coerce.number(),
});

const updateHighlightSchema = highlightSchema.extend({
  id: z.coerce.number(),
});

// --- أنواع للحالات والنتائج ---
export type HighlightFormState = {
  errors?: { title?: string[]; description?: string[]; icon_name?: string[] };
  message?: string;
  success?: boolean;
} | null;

export type DeleteActionResult = { message: string } | { error: string };

// --- جلب بيانات القسم ---
export async function getBeforeCtaSection(): Promise<BeforeCtaSectionWithHighlights | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('before_cta_sections')
    .select('*, before_cta_highlights (*)')
    .eq('id', SECTION_ID)
    .single();

  if (error) {
    console.error('خطأ في جلب بيانات القسم:', error);
    return null;
  }
  return data;
}

// --- تحديث القسم الرئيسي ---
export async function updateBeforeCtaSection(formData: FormData) {
  const supabase = await createClient();
  const validatedFields = sectionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'بيانات غير صالحة.' };
  }

  const { error } = await supabase.from('before_cta_sections').update(validatedFields.data).eq('id', SECTION_ID);

  if (error) {
    return { error: 'فشل تحديث القسم.' };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تم تحديث القسم بنجاح!' };
}

// --- إضافة نقطة بارزة ---
export async function createBeforeCtaHighlight(prevState: HighlightFormState, formData: FormData): Promise<HighlightFormState> {
  const supabase = await createClient();
  const rawData = { ...Object.fromEntries(formData.entries()), section_id: SECTION_ID };
  const validatedFields = createHighlightSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, success: false };
  }

  const { error } = await supabase.from('before_cta_highlights').insert(validatedFields.data);

  if (error) {
    return { message: 'فشل إضافة النقطة.', success: false };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تمت إضافة النقطة بنجاح.', success: true };
}

// --- تعديل نقطة بارزة ---
export async function updateBeforeCtaHighlight(prevState: HighlightFormState, formData: FormData): Promise<HighlightFormState> {
  const supabase = await createClient();
  const validatedFields = updateHighlightSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, success: false };
  }
  
  const { id, ...updateData } = validatedFields.data;
  const { error } = await supabase.from('before_cta_highlights').update(updateData).eq('id', id);

  if (error) {
    return { message: 'فشل تحديث النقطة.', success: false };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تم تحديث النقطة بنجاح.', success: true };
}

// --- حذف نقطة بارزة ---
export async function deleteBeforeCtaHighlight(highlightId: number): Promise<DeleteActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('before_cta_highlights').delete().eq('id', highlightId);

  if (error) {
    return { error: 'فشل حذف النقطة.' };
  }
  
  revalidatePath(ADMIN_PATH);
  return { message: 'تم حذف النقطة بنجاح.' };
}