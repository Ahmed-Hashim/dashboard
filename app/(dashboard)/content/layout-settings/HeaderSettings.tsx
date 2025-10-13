"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { toast } from "sonner";
import { Edit, Trash2} from "lucide-react";

import { HeaderWithNavLinks, HeaderNavLink } from "@/types/types";
import {
  updateHeader,
  createHeaderNavLink,
  updateHeaderNavLink,
  deleteHeaderNavLink,
  LinkFormState,
  DeleteActionResult,
} from "@/app/actions/layoutSettingsActions";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// --- تعريف الأنواع الدقيقة ---

// 1. نوع لشكل بيانات نموذج الهيدر الرئيسي
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const headerFormSchema = z.object({
  logo_src: z.string().nullable(),
  logo_alt: z.string().nullable(),
  home_href: z.string().nullable(),
  primary_button_text: z.string().nullable(),
  primary_button_href: z.string().nullable(),
});
type HeaderFormValues = z.infer<typeof headerFormSchema>;

// 2. نوع لنتيجة إجراءات التحديث والحذف القادمة من السيرفر
type UpdateActionResult =
  | { message: string; error?: undefined }
  | { error: string; message?: undefined };

// ====================================================================
// المكونات الفرعية (Sub-components)
// ====================================================================

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "جاري الحفظ..." : children}
    </Button>
  );
}

function NavLinkForm({
  link,
  closeDialog,
}: {
  link?: HeaderNavLink;
  closeDialog: () => void;
}) {
  const action = link ? updateHeaderNavLink : createHeaderNavLink;
  const [state, formAction] = useActionState<LinkFormState, FormData>(
    action,
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      closeDialog();
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, closeDialog]);

  return (
    <form action={formAction} className="space-y-4">
      {link && <input type="hidden" name="id" value={link.id} />}
      <div>
        <Label htmlFor="label">التسمية (Label)</Label>
        <Input id="label" name="label" defaultValue={link?.label} required />
        {state?.errors?.label && (
          <p className="text-sm text-red-500 mt-1">{state.errors.label[0]}</p>
        )}
      </div>
      <div>
        <Label htmlFor="href">الرابط (Href)</Label>
        <Input
          id="href"
          name="href"
          defaultValue={link?.href}
          required
          dir="ltr"
          className="text-left"
        />
        {state?.errors?.href && (
          <p className="text-sm text-red-500 mt-1">{state.errors.href[0]}</p>
        )}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            إلغاء
          </Button>
        </DialogClose>
        <SubmitButton>{link ? "حفظ التعديلات" : "إضافة رابط"}</SubmitButton>
      </DialogFooter>
    </form>
  );
}

// ====================================================================
// المكون الرئيسي (Main Component)
// ====================================================================

export function HeaderSettings({
  initialData,
}: {
  initialData: HeaderWithNavLinks;
}) {
  // استخدام النوع الدقيق `HeaderFormValues` لـ useForm
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<HeaderFormValues>({
    defaultValues: {
      logo_src: initialData.logo_src,
      logo_alt: initialData.logo_alt,
      home_href: initialData.home_href,
      primary_button_text: initialData.primary_button_text,
      primary_button_href: initialData.primary_button_href,
    },
  });

  const [editingLink, setEditingLink] = useState<HeaderNavLink | null>(null);

  // استخدام الأنواع الدقيقة في دالة إرسال النموذج الرئيسي
  const onHeaderSubmit: SubmitHandler<HeaderFormValues> = async (data) => {
    const formData = new FormData();
    (Object.keys(data) as Array<keyof HeaderFormValues>).forEach((key) => {
      const value = data[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    toast.promise(updateHeader(formData), {
      loading: "جاري حفظ الهيدر...",
      success: (res: UpdateActionResult) => {
        if (res.error) throw new Error(res.error);
        return res.message;
      },
      error: (err: Error) => err.message,
    });
  };

  const handleDelete = (linkId: number) => {
    toast.promise(deleteHeaderNavLink(linkId), {
      loading: "جاري حذف الرابط...",
      success: (result: DeleteActionResult) => {
        if ("error" in result) throw new Error(result.error);
        return result.message;
      },
      error: (err: Error) => err.message,
    });
  };

  return (
    <div className="space-y-6 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>بيانات الهيدر الرئيسية</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onHeaderSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>رابط الشعار</Label>
                <Input
                  {...register("logo_src")}
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div>
                <Label>النص البديل للشعار</Label>
                <Input {...register("logo_alt")} />
              </div>
              <div>
                <Label>رابط الصفحة الرئيسية</Label>
                <Input
                  {...register("home_href")}
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div>
                <Label>نص الزر الرئيسي</Label>
                <Input {...register("primary_button_text")} />
              </div>
              <div>
                <Label>رابط الزر الرئيسي</Label>
                <Input
                  {...register("primary_button_href")}
                  dir="ltr"
                  className="text-left"
                />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "حفظ الهيدر"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>روابط التنقل</CardTitle>
              <CardDescription>
                إدارة الروابط التي تظهر في الهيدر.
              </CardDescription>
            </div>
            
          </div>
        </CardHeader>
        <CardContent>
          <Dialog
            open={!!editingLink}
            onOpenChange={(open) => !open && setEditingLink(null)}
          >
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle>تعديل رابط التنقل</DialogTitle>
              </DialogHeader>
              {editingLink && (
                <NavLinkForm
                  link={editingLink}
                  closeDialog={() => setEditingLink(null)}
                />
              )}
            </DialogContent>
          </Dialog>

          <Table dir="rtl">
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التسمية</TableHead>
                <TableHead className="text-right">الرابط</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialData.header_nav_links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell>{link.label}</TableCell>
                  <TableCell  className="text-right">
                    {link.href}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingLink(link)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription>
                            سيتم حذف هذا الرابط نهائياً.
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(link.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {initialData.header_nav_links.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              لم تتم إضافة أي روابط بعد.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
