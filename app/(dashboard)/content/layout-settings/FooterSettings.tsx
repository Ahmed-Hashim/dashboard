'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

import { FooterWithLinks, FooterLink } from '@/types/types';
import { updateFooter, createFooterLink, updateFooterLink, deleteFooterLink, LinkFormState, DeleteActionResult } from '@/app/actions/layoutSettingsActions';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- تعريف الأنواع الدقيقة ---

// 1. نوع لشكل بيانات نموذج الفوتر الرئيسي
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const footerFormSchema = z.object({
  brand_name: z.string().nullable(),
  brand_description: z.string().nullable(),
  quick_links_title: z.string().nullable(),
  social_links_title: z.string().nullable(),
  email: z.string().email("بريد إلكتروني غير صالح").nullable().or(z.literal('')),
  phone_number: z.string().nullable(),
  copyright_text: z.string().nullable(),
});
type FooterFormValues = z.infer<typeof footerFormSchema>;

// 2. نوع لنتيجة إجراءات التحديث والحذف القادمة من السيرفر
type UpdateActionResult = { message: string; error?: undefined } | { error: string; message?: undefined };


// ====================================================================
// المكونات الفرعية (Sub-components)
// ====================================================================

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'جاري الحفظ...' : children}</Button>;
}

function FooterLinkForm({ link, closeDialog }: { link?: FooterLink; closeDialog: () => void }) {
  const action = link ? updateFooterLink : createFooterLink;
  const [state, formAction] = useActionState<LinkFormState, FormData>(action, null);
  const [linkType, setLinkType] = useState<FooterLink['link_type']>(link?.link_type || 'quick_link');
  
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
        <Label>نوع الرابط</Label>
        <Select name="link_type" required defaultValue={linkType} onValueChange={(value) => setLinkType(value as FooterLink['link_type'])}>
            <SelectTrigger><SelectValue placeholder="اختر نوع الرابط" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="quick_link">رابط سريع</SelectItem>
                <SelectItem value="social_link">رابط تواصل اجتماعي</SelectItem>
            </SelectContent>
        </Select>
      </div>
      
      {linkType === 'quick_link' && (
        <div>
          <Label htmlFor="label">التسمية (Label)</Label>
          <Input id="label" name="label" defaultValue={link?.label || ''} required />
          {state?.errors?.label && <p className="text-sm text-red-500 mt-1">{state.errors.label[0]}</p>}
        </div>
      )}

      {linkType === 'social_link' && (
        <div>
          <Label htmlFor="icon_name">اسم الأيقونة (من Lucide)</Label>
          <Input id="icon_name" name="icon_name" defaultValue={link?.icon_name || ''} placeholder="Twitter" />
        </div>
      )}

      <div>
        <Label htmlFor="href">الرابط (Href)</Label>
        <Input id="href" name="href" defaultValue={link?.href} required dir="ltr" className="text-left" />
        {state?.errors?.href && <p className="text-sm text-red-500 mt-1">{state.errors.href[0]}</p>}
      </div>
      <div>
        <Label htmlFor="order_index">الترتيب</Label>
        <Input id="order_index" name="order_index" type="number" defaultValue={link?.order_index?.toString() || ''} />
      </div>

      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">إلغاء</Button></DialogClose>
        <SubmitButton>{link ? 'حفظ التعديلات' : 'إضافة رابط'}</SubmitButton>
      </DialogFooter>
    </form>
  );
}


// ====================================================================
// المكون الرئيسي (Main Component)
// ====================================================================

export function FooterSettings({ initialData }: { initialData: FooterWithLinks }) {
  // استخدام النوع الدقيق `FooterFormValues` لـ useForm
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FooterFormValues>({
    defaultValues: {
      brand_name: initialData.brand_name,
      brand_description: initialData.brand_description,
      quick_links_title: initialData.quick_links_title,
      social_links_title: initialData.social_links_title,
      email: initialData.email,
      phone_number: initialData.phone_number,
      copyright_text: initialData.copyright_text,
    },
  });

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);

  // استخدام الأنواع الدقيقة في دالة إرسال النموذج الرئيسي
  const onFooterSubmit: SubmitHandler<FooterFormValues> = async (data) => {
    const formData = new FormData();
    // حلقة آمنة من ناحية النوع على مفاتيح النموذج
    (Object.keys(data) as Array<keyof FooterFormValues>).forEach(key => {
        const value = data[key];
        if (value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    });

    toast.promise(updateFooter(formData), {
      loading: 'جاري حفظ الفوتر...',
      success: (res: UpdateActionResult) => {
        if (res.error) throw new Error(res.error);
        return res.message;
      },
      error: (err: Error) => err.message,
    });
  };

  const handleDelete = (linkId: number) => {
    toast.promise(deleteFooterLink(linkId), {
      loading: 'جاري حذف الرابط...',
      success: (result: DeleteActionResult) => {
        if ('error' in result) throw new Error(result.error);
        return result.message;
      },
      error: (err: Error) => err.message,
    });
  };
  
  const quickLinks = initialData.footer_links.filter(l => l.link_type === 'quick_link');
  const socialLinks = initialData.footer_links.filter(l => l.link_type === 'social_link');

  return (
    <div className="space-y-6 pt-4">
      <Card>
        <CardHeader><CardTitle>بيانات الفوتر الرئيسية</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFooterSubmit)} className="space-y-4">
             <div><Label>اسم العلامة التجارية</Label><Input {...register('brand_name')} /></div>
             <div><Label>وصف العلامة التجارية</Label><Textarea {...register('brand_description')} /></div>
             <div className="grid md:grid-cols-2 gap-4">
                <div><Label>عنوان الروابط السريعة</Label><Input {...register('quick_links_title')} /></div>
                <div><Label>عنوان روابط التواصل</Label><Input {...register('social_links_title')} /></div>
                <div><Label>البريد الإلكتروني</Label><Input type="email" {...register('email')} dir="ltr" className="text-left" /></div>
                <div><Label>رقم الهاتف</Label><Input {...register('phone_number')} dir="ltr" className="text-left" /></div>
             </div>
             <div><Label>نص حقوق النشر</Label><Input {...register('copyright_text')} /></div>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'جاري الحفظ...' : 'حفظ الفوتر'}</Button>
          </form>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>روابط الفوتر</CardTitle>
                    <CardDescription>إدارة الروابط السريعة وروابط التواصل.</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="ml-2 h-4 w-4" />إضافة رابط</Button></DialogTrigger>
                    <DialogContent dir="rtl">
                        <DialogHeader><DialogTitle>إضافة رابط جديد للفوتر</DialogTitle></DialogHeader>
                        <FooterLinkForm closeDialog={() => setAddDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </CardHeader>
        <CardContent>
            <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
                <DialogContent dir="rtl">
                    <DialogHeader><DialogTitle>تعديل رابط الفوتر</DialogTitle></DialogHeader>
                    {editingLink && <FooterLinkForm link={editingLink} closeDialog={() => setEditingLink(null)} />}
                </DialogContent>
            </Dialog>
            
            <div className="space-y-4">
                <h3 className="font-semibold">{initialData.quick_links_title || 'الروابط السريعة'}</h3>
                {quickLinks.length > 0 ? quickLinks.map(link => (
                    <div key={link.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted">
                        <span>{link.label} ({link.href})</span>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" onClick={() => setEditingLink(link)}><Edit className="h-4 w-4" /></Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                <AlertDialogContent dir="rtl">
                                    <AlertDialogHeader><AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle></AlertDialogHeader>
                                    <AlertDialogDescription>سيتم حذف هذا الرابط نهائياً.</AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(link.id)} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                )) : <p className="text-xs text-muted-foreground">لا توجد روابط سريعة.</p>}

                <h3 className="font-semibold pt-4">{initialData.social_links_title || 'روابط التواصل'}</h3>
                {socialLinks.length > 0 ? socialLinks.map(link => (
                    <div key={link.id} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted">
                        <span>{link.icon_name} ({link.href})</span>
                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" onClick={() => setEditingLink(link)}><Edit className="h-4 w-4" /></Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                <AlertDialogContent dir="rtl">
                                    <AlertDialogHeader><AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle></AlertDialogHeader>
                                    <AlertDialogDescription>سيتم حذف هذا الرابط نهائياً.</AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(link.id)} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                )) : <p className="text-xs text-muted-foreground">لا توجد روابط تواصل اجتماعي.</p>}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}