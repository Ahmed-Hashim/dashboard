'use server';


import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { InstructorWithHighlights } from '@/types/types';
import { createClient } from '@/lib/server';

const ADMIN_PATH = '/content/instructor';
const INSTRUCTOR_ID = 1; // نحن نعمل دائمًا على المدرب رقم 1

// --- مخططات Zod للتحقق من صحة البيانات ---
const instructorSchema = z.object({
  name: z.string().min(3, 'الاسم قصير جدًا'),
  title: z.string().optional(),
  image_src: z.string().optional(),
  linkedin_url: z.string().url('رابط LinkedIn غير صالح').optional().or(z.literal('')),
});

const highlightSchema = z.object({
  text: z.string().min(5, 'النص قصير جدًا'),
  order_index: z.coerce.number().optional(),
});

const createHighlightSchema = highlightSchema.extend({
  instructor_id: z.coerce.number(),
});

const updateHighlightSchema = highlightSchema.extend({
  id: z.coerce.number(),
});

// --- أنواع الحالات والنماذج ---
export type ActionFormState = {
  errors?: { text?: string[]; order_index?: string[] };
  message?: string;
} | null;

export type DeleteActionResult = { message: string; error?: undefined } | { error: string; message?: undefined };


// --- جلب بيانات المدرب مع نقاط التميز ---
export async function getInstructorWithHighlights(): Promise<InstructorWithHighlights | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('instructors')
    .select('*, instructor_highlights (*, order_by: order_index)')
    .eq('id', INSTRUCTOR_ID)
    .single();

  if (error) {
    console.error('خطأ في جلب بيانات المدرب:', error);
    return null;
  }
  return data;
}

// --- تحديث بيانات المدرب ---
export async function updateInstructor(formData: FormData) {
  const supabase = await createClient();
  const validatedFields = instructorSchema.safeParse({
    name: formData.get('name'),
    title: formData.get('title'),
    image_src: formData.get('image_src'),
    linkedin_url: formData.get('linkedin_url'),
  });

  if (!validatedFields.success) {
    return { error: 'البيانات المُدخلة غير صالحة.' };
  }

  const { error } = await supabase
    .from('instructors')
    .update(validatedFields.data)
    .eq('id', INSTRUCTOR_ID);

  if (error) {
    return { error: 'فشل تحديث بيانات المدرب.' };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تم تحديث بيانات المدرب بنجاح!' };
}

// --- إضافة نقطة تميز جديدة ---
export async function createInstructorHighlight(prevState: ActionFormState, formData: FormData): Promise<ActionFormState> {
  const supabase = await createClient();
  const validatedFields = createHighlightSchema.safeParse({
    text: formData.get('text'),
    order_index: formData.get('order_index'),
    instructor_id: formData.get('instructor_id'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { error } = await supabase.from('instructor_highlights').insert(validatedFields.data);

  if (error) {
    return { message: 'فشل في إضافة النقطة.' };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تمت إضافة النقطة بنجاح.' };
}

// --- تعديل نقطة تميز ---
export async function updateInstructorHighlight(prevState: ActionFormState, formData: FormData): Promise<ActionFormState> {
    const supabase = await createClient();
    const validatedFields = updateHighlightSchema.safeParse({
        id: formData.get('id'),
        text: formData.get('text'),
        order_index: formData.get('order_index'),
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const { id, ...updateData } = validatedFields.data;

    const { error } = await supabase.from('instructor_highlights').update(updateData).eq('id', id);

    if (error) {
        return { message: 'فشل تحديث النقطة.' };
    }

    revalidatePath(ADMIN_PATH);
    return { message: 'تم تحديث النقطة بنجاح.' };
}


// --- حذف نقطة تميز ---
export async function deleteInstructorHighlight(highlightId: number): Promise<DeleteActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('instructor_highlights').delete().eq('id', highlightId);

  if (error) {
    return { error: 'فشل حذف النقطة.' };
  }
  
  revalidatePath(ADMIN_PATH);
  return { message: 'تم حذف النقطة بنجاح.' };
}