'use server';


import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { LearnSectionWithItems } from '@/types/types';
import { createClient } from '@/lib/server';


const ADMIN_PATH = '/admin/learn-section';
const SECTION_SLUG = 'ai-course-learn-section'; // هذا هو القسم المحدد الذي نقوم بتعديله

// --- مخططات Zod للتحقق من صحة المدخلات ---
const updateSectionSchema = z.object({
  section_title: z.string().min(3, 'العنوان قصير جداً'),
  highlighted_word: z.string().optional(),
});

const createItemSchema = z.object({
  text: z.string().min(5, 'نص العنصر يجب أن يكون 5 أحرف على الأقل'),
  icon_name: z.string().optional(),
  learn_section_id: z.coerce.number(),
});

const updateItemSchema = z.object({
  id: z.coerce.number(),
  text: z.string().min(5, 'نص العنصر يجب أن يكون 5 أحرف على الأقل'),
  icon_name: z.string().optional(),
});

// --- تعريف نوع لحالة النموذج (للأخطاء والرسائل) ---
export type ActionFormState = {
  errors?: {
    text?: string[];
    icon_name?: string[];
  };
  message?: string;
} | null;


// --- دالة جلب بيانات القسم مع العناصر ---
export async function getLearnSectionWithItems(): Promise<LearnSectionWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('learn_sections')
    .select('*, learn_section_items (*)')
    .eq('slug', SECTION_SLUG)
    .single();

  if (error) {
    console.error('خطأ في جلب قسم التعلم:', error);
    return null;
  }
  return data;
}

// --- دالة تحديث بيانات القسم الرئيسي ---
export async function updateLearnSection(sectionId: number, formData: FormData) {
  const supabase = await createClient();
  const validatedFields = updateSectionSchema.safeParse({
    section_title: formData.get('section_title'),
    highlighted_word: formData.get('highlighted_word'),
  });

  if (!validatedFields.success) {
    return { error: 'البيانات المُدخلة غير صالحة.' };
  }

  const { error } = await supabase
    .from('learn_sections')
    .update(validatedFields.data)
    .eq('id', sectionId);

  if (error) {
    return { error: 'فشل تحديث القسم.' };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تم تحديث القسم بنجاح!' };
}

// --- دالة إضافة عنصر جديد ---
export async function createLearnItem(prevState: ActionFormState, formData: FormData): Promise<ActionFormState> {
  const supabase = await createClient();
  const validatedFields = createItemSchema.safeParse({
    text: formData.get('text'),
    icon_name: formData.get('icon_name'),
    learn_section_id: formData.get('learn_section_id'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { error } = await supabase.from('learn_section_items').insert(validatedFields.data);

  if (error) {
    return { message: 'خطأ في قاعدة البيانات: فشل في إنشاء العنصر.' };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تمت إضافة العنصر بنجاح.' };
}

// --- دالة تعديل عنصر موجود ---
export async function updateLearnItem(prevState: ActionFormState, formData: FormData): Promise<ActionFormState> {
  const supabase = await createClient();
  const validatedFields = updateItemSchema.safeParse({
    id: formData.get('id'),
    text: formData.get('text'),
    icon_name: formData.get('icon_name'),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { id, ...updateData } = validatedFields.data;

  const { error } = await supabase.from('learn_section_items').update(updateData).eq('id', id);

  if (error) {
    return { message: 'خطأ في قاعدة البيانات: فشل تحديث العنصر.' };
  }

  revalidatePath(ADMIN_PATH);
  return { message: 'تم تحديث العنصر بنجاح.' };
}

// --- دالة حذف عنصر ---
export async function deleteLearnItem(itemId: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('learn_section_items').delete().eq('id', itemId);

  if (error) {
    return { error: 'فشل حذف العنصر.' };
  }
  
  revalidatePath(ADMIN_PATH);
  return { message: 'تم حذف العنصر بنجاح.' };
}