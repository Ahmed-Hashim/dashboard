'use server';

import { supabase } from '@/lib/supabaseClient';
import { TestimonialFormState } from '@/types/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Zod Schema for validation
const testimonialSchema = z.object({
  name: z.string().min(2, { message: 'يجب أن يكون الاسم حرفين على الأقل' }),
  text: z.string().min(10, { message: 'يجب أن يكون نص الشهادة 10 أحرف على الأقل' }),
  img_src: z.string().url({ message: 'يجب أن يكون رابط الصورة صالحاً' }).optional().or(z.literal('')),
});

// --- GET all testimonials ---
export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return data;
}

// --- CREATE a new testimonial ---
export async function createTestimonial(
  previousState: TestimonialFormState | null, // <-- Use the new type instead of `any`
  formData: FormData
): Promise<TestimonialFormState> { // <-- Add a return type for the function
  const validatedFields = testimonialSchema.safeParse({
    name: formData.get('name'),
    text: formData.get('text'),
    img_src: formData.get('img_src'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const dataToInsert = {
    ...validatedFields.data,
    img_src: validatedFields.data.img_src || null,
  };

  const { error } = await supabase.from('testimonials').insert(dataToInsert);

  if (error) {
    return { message: 'فشل في إضافة شهادة الرأي.' };
  }

  // On success, redirect. The redirect throws an error, so no return is needed here.
  revalidatePath('/content/testimonials');
  redirect('/content/testimonials');
}

// --- UPDATE an existing testimonial ---
export async function updateTestimonial(formData: FormData) {
  const id = formData.get('id');
  if (!id) return { message: 'لم يتم العثور على المعرف (ID).' };

  const validatedFields = testimonialSchema.safeParse({
    name: formData.get('name'),
    text: formData.get('text'),
    img_src: formData.get('img_src'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }
  
  const dataToUpdate = {
    ...validatedFields.data,
    img_src: validatedFields.data.img_src || null,
  };


  const { error } = await supabase
    .from('testimonials')
    .update(dataToUpdate)
    .eq('id', Number(id));

  if (error) {
    return { message: 'فشل في تحديث شهادة الرأي.' };
  }

  revalidatePath('/content/testimonials');
  return { message: 'تم تحديث شهادة الرأي بنجاح!' };
}

// --- DELETE a testimonial ---
export async function deleteTestimonial(id: number) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);

  if (error) {
    return { message: 'فشل في حذف شهادة الرأي.' };
  }

  revalidatePath('/content/testimonials');
}