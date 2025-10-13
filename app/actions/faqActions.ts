'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { FaqSectionWithItems } from '@/types/types';
import { createClient } from '@/lib/server';

const ADMIN_PATH = '/content/faq';
const SECTION_ID = 1; // نعمل دائمًا على القسم رقم 1

// --- مخططات Zod للتحقق ---
const sectionSchema = z.object({
  title_part_1: z.string().optional(),
  title_part_2: z.string().optional(),
});

const itemSchema = z.object({
  question: z.string().min(5, 'السؤال قصير جدًا'),
  answer: z.string().min(10, 'الإجابة قصيرة جدًا'),
  order_index: z.coerce.number().optional(),
});

const createItemSchema = itemSchema.extend({
  section_id: z.coerce.number(),
});

const updateItemSchema = itemSchema.extend({
  id: z.coerce.number(),
});

// --- أنواع للحالات والنتائج ---
export type ItemFormState = {
  errors?: { question?: string[]; answer?: string[]; order_index?: string[] };
  message?: string;
  success?: boolean;
} | null;

export type DeleteActionResult = { message: string } | { error: string };

// --- جلب بيانات القسم ---
export async function getFaqSection(): Promise<FaqSectionWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('faq_sections')
    .select('*, faq_items (*, order_by: order_index)')
    .eq('id', SECTION_ID)
    .single();

  if (error) {
    console.error('خطأ في جلب قسم الأسئلة الشائعة:', error);
    return null;
  }
  return data;
}

// --- تحديث القسم الرئيسي ---
export async function updateFaqSection(formData: FormData) {
  const supabase = await createClient();
  const validatedFields = sectionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'بيانات غير صالحة.' };
  }

  const { error } = await supabase.from('faq_sections').update(validatedFields.data).eq('id', SECTION_ID);

  if (error) {
    return { error: 'فشل تحديث القسم.' };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تم تحديث القسم بنجاح!' };
}

// --- إضافة سؤال جديد ---
export async function createFaqItem(prevState: ItemFormState, formData: FormData): Promise<ItemFormState> {
  const supabase = await createClient();
  const rawData = { ...Object.fromEntries(formData.entries()), section_id: SECTION_ID };
  const validatedFields = createItemSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, success: false };
  }

  const { error } = await supabase.from('faq_items').insert(validatedFields.data);

  if (error) {
    return { message: 'فشل إضافة السؤال.', success: false };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تمت إضافة السؤال بنجاح.', success: true };
}

// --- تعديل سؤال ---
export async function updateFaqItem(prevState: ItemFormState, formData: FormData): Promise<ItemFormState> {
  const supabase = await createClient();
  const validatedFields = updateItemSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, success: false };
  }
  
  const { id, ...updateData } = validatedFields.data;
  const { error } = await supabase.from('faq_items').update(updateData).eq('id', id);

  if (error) {
    return { message: 'فشل تحديث السؤال.', success: false };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تم تحديث السؤال بنجاح.', success: true };
}

// --- حذف سؤال ---
export async function deleteFaqItem(itemId: number): Promise<DeleteActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('faq_items').delete().eq('id', itemId);

  if (error) {
    return { error: 'فشل حذف السؤال.' };
  }
  
  revalidatePath(ADMIN_PATH);
  return { message: 'تم حذف السؤال بنجاح.' };
}