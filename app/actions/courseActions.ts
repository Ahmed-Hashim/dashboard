'use server';


import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { CourseWithBenefits } from '@/types/types';
import { createClient } from '@/lib/server';

const ADMIN_PATH = '/content/course-details';
const COURSE_ID = 2; // نحن نعمل دائمًا على الكورس رقم 1

// --- مخططات Zod للتحقق من صحة البيانات ---
const courseSchema = z.object({
  title: z.string().min(3, 'العنوان قصير جدًا'),
  description: z.string().optional(),
  yt_video_id: z.string().optional(),
  image_url: z.string().optional(),
  price: z.coerce.number().min(0, 'السعر يجب أن يكون إيجابيًا').optional(),
  instructor: z.string().optional(),
  published: z.boolean().default(false),
  seo_meta: z.string().transform((str, ctx) => { // تحويل النص إلى JSON
    try { return JSON.parse(str); }
    catch (e) { 
      ctx.addIssue({ code: 'custom', message: 'بيانات SEO غير صالحة (JSON).'});
      return z.NEVER;
    }
  }).optional(),
});

const benefitSchema = z.object({
  title: z.string().min(3, 'العنوان قصير جدًا'),
  description: z.string().optional(),
});

const createBenefitSchema = benefitSchema.extend({
  course_id: z.coerce.number(),
});

const updateBenefitSchema = benefitSchema.extend({
  id: z.coerce.number(),
});

// --- أنواع للحالات والنتائج ---
export type BenefitFormState = {
  errors?: { title?: string[]; description?: string[] };
  message?: string;
  success?: boolean;
} | null;

export type DeleteActionResult = { message: string } | { error: string };

// --- جلب بيانات الكورس مع المميزات ---
export async function getCourseWithBenefits(): Promise<CourseWithBenefits | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('courses')
    .select('*, course_benefits (*)')
    .eq('id', COURSE_ID)
    .single();

  if (error) {
    console.error('خطأ في جلب بيانات الكورس:', error);
    return null;
  }
  return data;
}

// --- تحديث بيانات الكورس ---
export async function updateCourse(formData: FormData) {
  const supabase = await createClient();
  // تحويل `published` من 'on' إلى boolean
  const isPublished = !!formData.get('published');

  const rawData = {
    ...Object.fromEntries(formData.entries()),
    published: isPublished,
  };
  
  const validatedFields = courseSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from('courses')
    .update(validatedFields.data)
    .eq('id', COURSE_ID);

  if (error) {
    return { error: { _form: ['فشل تحديث الكورس.'] }};
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تم تحديث الكورس بنجاح!' };
}

// --- إضافة ميزة جديدة للكورس ---
export async function createCourseBenefit(prevState: BenefitFormState, formData: FormData): Promise<BenefitFormState> {
  const supabase = await createClient();
  const validatedFields = createBenefitSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    course_id: COURSE_ID,
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, success: false };
  }

  const { error } = await supabase.from('course_benefits').insert(validatedFields.data);

  if (error) {
    return { message: 'فشل في إضافة الميزة.', success: false };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تمت إضافة الميزة بنجاح.', success: true };
}

// --- تعديل ميزة ---
export async function updateCourseBenefit(prevState: BenefitFormState, formData: FormData): Promise<BenefitFormState> {
  const supabase = await createClient();
  const validatedFields = updateBenefitSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, success: false };
  }
  
  const { id, ...updateData } = validatedFields.data;
  const { error } = await supabase.from('course_benefits').update(updateData).eq('id', id);

  if (error) {
    return { message: 'فشل تحديث الميزة.', success: false };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تم تحديث الميزة بنجاح.', success: true };
}

// --- حذف ميزة ---
export async function deleteCourseBenefit(benefitId: number): Promise<DeleteActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('course_benefits').delete().eq('id', benefitId);

  if (error) {
    return { error: 'فشل حذف الميزة.' };
  }
  
  revalidatePath(ADMIN_PATH);
  return { message: 'تم حذف الميزة بنجاح.' };
}