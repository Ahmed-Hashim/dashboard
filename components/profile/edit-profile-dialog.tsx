"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { updateUserProfile, uploadAvatarToBunny } from "@/app/(dashboard)/profile/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Tables } from "@/types/database";
import { User } from "@supabase/supabase-js";

const profileSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل." }),
});

interface EditProfileDialogProps {
  profile: Tables<"profiles"> | null;
  user: User;
  children: React.ReactNode;
}

export function EditProfileDialog({ profile, user, children }: EditProfileDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile?.name || "" },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    startTransition(async () => {
      let finalAvatarUrl = profile?.avatar_url;

      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatarFile);
        const uploadResult = await uploadAvatarToBunny(avatarFormData);
        if (uploadResult.error || !uploadResult.url) {
          toast.error(uploadResult.error || "فشل الحصول على رابط الصورة.");
          return;
        }
        finalAvatarUrl = uploadResult.url;
      }

      const profileFormData = new FormData();
      profileFormData.append("name", values.name);
      if (finalAvatarUrl) {
        profileFormData.append("avatar_url", finalAvatarUrl);
      }
      
      const result = await updateUserProfile(profileFormData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        router.refresh(); // أهم سطر: لتحديث بيانات الصفحة من الخادم
        setIsOpen(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل الملف الشخصي</DialogTitle>
          <DialogDescription>
            قم بإجراء تغييرات على ملفك الشخصي هنا. انقر على حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarPreview || ""} />
              <AvatarFallback>{profile?.name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Input id="avatar" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleAvatarChange} className="hidden" />
            <Label htmlFor="avatar" className="cursor-pointer text-sm text-primary hover:underline">تغيير الصورة</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input id="name" {...form.register("name")} placeholder="اسمك الكامل" />
            {form.formState.errors.name && (<p className="text-sm text-destructive">{form.formState.errors.name.message}</p>)}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="ms-2 h-4 w-4 animate-spin" />}
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}