// app/content/layout-settings/actions.ts

'use server';


import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { HeaderWithNavLinks, FooterWithLinks } from '@/types/types';
import { createClient } from '@/lib/server';

const ADMIN_PATH = '/content/layout-settings';
const HEADER_ID = 1;
const FOOTER_ID = 1;

// --- أنواع عامة ---
export type LinkFormState = { errors?: { [key: string]: string[] }; message?: string; success?: boolean; } | null;
export type DeleteActionResult = { message: string } | { error: string };

// --- مخططات Zod للهيدر ---
const headerSchema = z.object({
  logo_src: z.string().optional(),
  logo_alt: z.string().optional(),
  home_href: z.string().optional(),
  primary_button_text: z.string().optional(),
  primary_button_href: z.string().optional(),
});
const navLinkSchema = z.object({ label: z.string().min(1, "التسمية مطلوبة"), href: z.string().min(1, "الرابط مطلوب") });
const updateNavLinkSchema = navLinkSchema.extend({ id: z.coerce.number() });

// --- مخططات Zod للفوتر ---
const footerSchema = z.object({
  brand_name: z.string().optional(),
  brand_description: z.string().optional(),
  quick_links_title: z.string().optional(),
  social_links_title: z.string().optional(),
  email: z.string().email("بريد إلكتروني غير صالح").optional().or(z.literal('')),
  phone_number: z.string().optional(),
  copyright_text: z.string().optional(),
});
const footerLinkSchema = z.object({
    link_type: z.enum(['quick_link', 'social_link']),
    href: z.string().min(1, "الرابط مطلوب"),
    label: z.string().optional(),
    icon_name: z.string().optional(),
    order_index: z.coerce.number().optional(),
});
const updateFooterLinkSchema = footerLinkSchema.extend({ id: z.coerce.number() });

// --- دوال جلب البيانات ---
export async function getLayoutData(): Promise<{ headerData: HeaderWithNavLinks | null; footerData: FooterWithLinks | null }> {
    const supabase = await createClient();
    const [headerResult, footerResult] = await Promise.all([
        supabase.from('headers').select('*, header_nav_links(*)').eq('id', HEADER_ID).single(),
        supabase.from('footers').select('*, footer_links(*)').eq('id', FOOTER_ID).single()
    ]);
    if(headerResult.error) console.error("Header fetch error:", headerResult.error);
    if(footerResult.error) console.error("Footer fetch error:", footerResult.error);
    return { headerData: headerResult.data, footerData: footerResult.data };
}

// --- دوال الهيدر ---
export async function updateHeader(formData: FormData) {
    const supabase = await createClient();
    const validated = headerSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validated.success) return { error: "بيانات غير صالحة" };
    const { error } = await supabase.from('headers').update(validated.data).eq('id', HEADER_ID);
    if (error) return { error: "فشل تحديث الهيدر" };
    revalidatePath(ADMIN_PATH);
    return { message: "تم تحديث الهيدر بنجاح" };
}

export async function createHeaderNavLink(prevState: LinkFormState, formData: FormData): Promise<LinkFormState> {
    const supabase = await createClient();
    const validated = navLinkSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validated.success) return { errors: validated.error.flatten().fieldErrors, success: false };
    const { error } = await supabase.from('header_nav_links').insert({ ...validated.data, header_id: HEADER_ID });
    if (error) return { message: 'فشل إضافة الرابط', success: false };
    revalidatePath(ADMIN_PATH);
    return { message: 'تمت إضافة الرابط بنجاح', success: true };
}

export async function updateHeaderNavLink(prevState: LinkFormState, formData: FormData): Promise<LinkFormState> {
    const supabase = await createClient();
    const validated = updateNavLinkSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validated.success) return { errors: validated.error.flatten().fieldErrors, success: false };
    const { id, ...updateData } = validated.data;
    const { error } = await supabase.from('header_nav_links').update(updateData).eq('id', id);
    if (error) return { message: 'فشل تحديث الرابط', success: false };
    revalidatePath(ADMIN_PATH);
    return { message: 'تم تحديث الرابط بنجاح', success: true };
}

export async function deleteHeaderNavLink(linkId: number): Promise<DeleteActionResult> {
    const supabase = await createClient();
    const { error } = await supabase.from('header_nav_links').delete().eq('id', linkId);
    if (error) return { error: 'فشل حذف الرابط' };
    revalidatePath(ADMIN_PATH);
    return { message: 'تم حذف الرابط بنجاح' };
}

// --- دوال الفوتر ---
export async function updateFooter(formData: FormData) {
    const supabase = await createClient();
    const validated = footerSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validated.success) return { error: "بيانات غير صالحة" };
    const { error } = await supabase.from('footers').update(validated.data).eq('id', FOOTER_ID);
    if (error) return { error: "فشل تحديث الفوتر" };
    revalidatePath(ADMIN_PATH);
    return { message: "تم تحديث الفوتر بنجاح" };
}

export async function createFooterLink(prevState: LinkFormState, formData: FormData): Promise<LinkFormState> {
    const supabase = await createClient();
    const validated = footerLinkSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validated.success) return { errors: validated.error.flatten().fieldErrors, success: false };
    const { error } = await supabase.from('footer_links').insert({ ...validated.data, footer_id: FOOTER_ID });
    if (error) return { message: 'فشل إضافة الرابط', success: false };
    revalidatePath(ADMIN_PATH);
    return { message: 'تمت إضافة الرابط بنجاح', success: true };
}

export async function updateFooterLink(prevState: LinkFormState, formData: FormData): Promise<LinkFormState> {
    const supabase = await createClient();
    const validated = updateFooterLinkSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validated.success) return { errors: validated.error.flatten().fieldErrors, success: false };
    const { id, ...updateData } = validated.data;
    const { error } = await supabase.from('footer_links').update(updateData).eq('id', id);
    if (error) return { message: 'فشل تحديث الرابط', success: false };
    revalidatePath(ADMIN_PATH);
    return { message: 'تم تحديث الرابط بنجاح', success: true };
}

export async function deleteFooterLink(linkId: number): Promise<DeleteActionResult> {
    const supabase = await createClient();
    const { error } = await supabase.from('footer_links').delete().eq('id', linkId);
    if (error) return { error: 'فشل حذف الرابط' };
    revalidatePath(ADMIN_PATH);
    return { message: 'تم حذف الرابط بنجاح' };
}