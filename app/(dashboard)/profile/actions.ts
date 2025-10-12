"use server";

import { createClient } from "@/lib/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod Schema for profile update
const profileSchema = z.object({
  name: z.string().min(3, { message: "يجب أن يكون الاسم 3 أحرف على الأقل" }),
  avatar_url: z.string().url({ message: "رابط الصورة غير صالح" }).optional().nullable(),
});

export async function updateUserProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "User not authenticated" };

  const rawData = {
    name: formData.get("name"),
    avatar_url: formData.get("avatar_url"),
  };
  
  const validatedFields = profileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error("Zod Validation Error:", validatedFields.error.flatten().fieldErrors);
    return { error: "البيانات المدخلة غير صالحة." };
  }

  // استخدام .select().single() سيعيد خطأ إذا لم يتم تحديث أي صف
  // وهذا يساعد في اكتشاف مشاكل RLS (Row Level Security)
  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update({ 
      name: validatedFields.data.name,
      avatar_url: validatedFields.data.avatar_url,
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Supabase profile update error:", error);
    return { error: "فشل تحديث الملف الشخصي." };
  }
  
  if (!updatedProfile) {
    return { error: "لم يتم العثور على الملف الشخصي للتحديث. تحقق من أذونات RLS." };
  }

  revalidatePath("/profile");
  return { success: "تم تحديث الملف الشخصي بنجاح!" };
}

export async function updateUserPassword(password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return { error: "فشل تغيير كلمة المرور. حاول مرة أخرى." };
    }
    return { success: "تم تغيير كلمة المرور بنجاح!" };
}

export async function uploadAvatarToBunny(formData: FormData) {
  const file = formData.get("avatar") as File;
  if (!file) {
    return { error: "لم يتم تقديم أي ملف." };
  }

  const accessKey = process.env.BUNNY_STORAGE_API_KEY;
  const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME;
  const region = process.env.BUNNY_STORAGE_ZONE_REGION;
  const pullZoneHostname = process.env.BUNNY_PULL_ZONE_HOSTNAME;

  if (!accessKey || !storageZoneName || !pullZoneHostname) {
    console.error("Bunny CDN environment variables are not configured.");
    return { error: "خطأ في إعدادات الخادم." };
  }
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "User not authenticated" };

  const fileExtension = file.name.split('.').pop();
  const fileName = `${user.id}-${Date.now()}.${fileExtension}`;
  
  const baseHostname = 'storage.bunnycdn.com';
  const hostname = region ? `${region}.${baseHostname}` : baseHostname;
  const uploadUrl = `https://${hostname}/${storageZoneName}/${fileName}`;

  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: { AccessKey: accessKey, "Content-Type": file.type },
      body: await file.arrayBuffer(),
    });

    if (!response.ok) {
        const responseText = await response.text();
        console.error("Bunny CDN upload failed:", responseText);
        return { error: `فشل رفع الصورة. الحالة: ${response.status}` };
    }

    const publicUrl = `https://${pullZoneHostname}/${fileName}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error uploading to Bunny CDN:", error);
    return { error: "حدث خطأ غير متوقع أثناء رفع الملف." };
  }
}