import { createBrowserClient } from '@supabase/ssr';

// This creates a single, session-aware Supabase client instance that can be
// imported and used in any client component.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);