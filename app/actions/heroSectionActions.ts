'use server';

import { supabase } from '@/lib/supabaseClient'; // <-- UPDATED IMPORT
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { HeroSection } from '@/types/types';


// Zod schema for validation (no changes here)
const heroSectionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  highlight_text: z.string().optional(),
  cta_primary_text: z.string().optional(),
  cta_secondary_text: z.string().optional(),
  video_src: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// We hardcode the ID to 1 because we are only editing the first entry.
const HERO_SECTION_ID = 1;

// --- Server Action to GET the hero section data ---
export async function getHeroSection(): Promise<HeroSection | null> {
  // No longer need createClient(). We use the imported 'supabase' instance directly.
  const { data, error } = await supabase
    .from('hero_sections')
    .select('*')
    .eq('id', HERO_SECTION_ID)
    .single();

  if (error) {
    console.error('Error fetching hero section:', error);
    return null;
  }

  return data;
}

// --- Server Action to UPDATE the hero section data ---
export async function updateHeroSection(formData: FormData) {
  const rawFormData = {
    title: formData.get('title'),
    description: formData.get('description'),
    highlight_text: formData.get('highlight_text'),
    cta_primary_text: formData.get('cta_primary_text'),
    cta_secondary_text: formData.get('cta_secondary_text'),
    video_src: formData.get('video_src'),
  };

  const validatedFields = heroSectionSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Use the imported 'supabase' instance directly here as well.
  const { error } = await supabase
    .from('hero_sections')
    .update(validatedFields.data)
    .eq('id', HERO_SECTION_ID);

  if (error) {
    console.error('Supabase update error:', error);
    return {
      message: 'Database Error: Failed to update hero section.',
    };
  }
  
  revalidatePath('/content/hero-section');
  
  return {
    message: 'Hero section updated successfully!',
  };
}