"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // 1. تم حذف `CommandLoading` من هنا
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { Tables } from "@/types/database";
import { Check, ChevronsUpDown, Loader2, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

// تعريف أنواع البيانات
type Course = Pick<Tables<"courses">, "id" | "title" | "price">;
type UserProfile = Pick<Tables<"profiles">, "user_id" | "email">;

interface AddPaymentDialogProps {
  onPaymentAdded: () => void;
}

// Custom Hook for debouncing
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function AddPaymentDialog({ onPaymentAdded }: AddPaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [amount, setAmount] = useState<number | string>("");
  const [status, setStatus] = useState<"succeeded" | "pending" | "failed">(
    "succeeded"
  );
  const [currency, setCurrency] = useState("USD");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [userSearch, setUserSearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [userOptions, setUserOptions] = useState<UserProfile[]>([]);
  const [courseOptions, setCourseOptions] = useState<Course[]>([]);
  const [isUserSearchLoading, setIsUserSearchLoading] = useState(false);
  const [isCourseSearchLoading, setIsCourseSearchLoading] = useState(false);
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
  const [isCoursePopoverOpen, setIsCoursePopoverOpen] = useState(false);

  const debouncedUserSearch = useDebounce(userSearch, 300);
  const debouncedCourseSearch = useDebounce(courseSearch, 300);

  // Fetch users based on search term
  useEffect(() => {
    if (debouncedUserSearch.length < 2) {
      setUserOptions([]);
      return;
    }
    const searchUsers = async () => {
      setIsUserSearchLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, email")
        .ilike("email", `%${debouncedUserSearch}%`)
        .limit(10);

      if (error) console.error("Error searching users:", error);
      setUserOptions(data || []);
      setIsUserSearchLoading(false);
    };
    searchUsers();
  }, [debouncedUserSearch]);

  // Fetch courses based on search term
  useEffect(() => {
    if (debouncedCourseSearch.length < 2) {
      setCourseOptions([]);
      return;
    }
    const searchCourses = async () => {
      setIsCourseSearchLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, price")
        .ilike("title", `%${debouncedCourseSearch}%`)
        .limit(10);

      if (error) console.error("Error searching courses:", error);
      setCourseOptions(data || []);
      setIsCourseSearchLoading(false);
    };
    searchCourses();
  }, [debouncedCourseSearch]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!selectedUser) errors.user = "يجب اختيار مستخدم.";
    if (!selectedCourse) errors.course = "يجب اختيار دورة.";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      errors.amount = "يجب إدخال مبلغ صحيح وأكبر من صفر.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setFormErrors({});

    try {
      const { error: insertError } = await supabase.from("purchases").insert({
        user_id: selectedUser!.user_id,
        course_id: selectedCourse!.id,
        amount: Number(amount),
        currency: currency,
        status: status,
      });

      if (insertError) throw insertError;

      onPaymentAdded();
      resetForm();
      setOpen(false);
    } catch (err: unknown) {
      console.error("Error creating payment:", err);
      setFormErrors({
        submit: `فشل في إضافة الدفعة: ${
          err instanceof Error ? err.message : String(err)
        }`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setSelectedCourse(null);
    setAmount("");
    setStatus("succeeded");
    setCurrency("جنيه مصري");
    setUserSearch("");
    setCourseSearch("");
    setFormErrors({});
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button>إضافة دفعة جديدة</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center gap-2 text-center">
            <Newspaper className="w-6 h-6" />
            <span>إضافة عملية دفع يدوية</span>
          </DialogTitle>
          <DialogDescription className="flex flex-col items-center gap-1 text-center">
            ابحث عن المستخدم والدورة لإضافة سجل دفع جديد.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* User Combobox */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="user" className="text-right pt-2">
              المستخدم <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3">
              <Popover
                open={isUserPopoverOpen}
                onOpenChange={setIsUserPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isUserPopoverOpen}
                    className="w-full justify-between"
                  >
                    {selectedUser ? selectedUser.email : "اختر مستخدم..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[370px] p-0">
                  <Command className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <CommandInput
                      placeholder="ابحث بالبريد الإلكتروني..."
                      value={userSearch}
                      onValueChange={setUserSearch}
                    />
                    <CommandList>
                      {/* 2. هذا هو التعديل الأول */}
                      {isUserSearchLoading && (
                        <div className="p-2 flex items-center justify-center text-sm text-muted-foreground">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>جاري البحث...</span>
                        </div>
                      )}
                      <CommandEmpty>
                        {userSearch.length > 1
                          ? "لم يتم العثور على مستخدم."
                          : "ابدأ بالكتابة للبحث..."}
                      </CommandEmpty>
                      <CommandGroup>
                        {userOptions.map((user) => (
                          <CommandItem
                            key={user.user_id}
                            value={user.email!}
                            onSelect={() => {
                              setSelectedUser(user);
                              setIsUserPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUser?.user_id === user.user_id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {formErrors.user && (
                <p className="text-sm text-red-500 mt-1">{formErrors.user}</p>
              )}
            </div>
          </div>

          {/* Course Combobox */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="course" className="text-right pt-2">
              الدورة <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3">
              <Popover
                open={isCoursePopoverOpen}
                onOpenChange={setIsCoursePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isCoursePopoverOpen}
                    className="w-full justify-between"
                  >
                    {selectedCourse ? selectedCourse.title : "اختر دورة..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[370px] p-0">
                  <Command className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <CommandInput
                      placeholder="ابحث عن دورة..."
                      value={courseSearch}
                      onValueChange={setCourseSearch}
                    />
                    <CommandList>
                      {/* 3. وهذا هو التعديل الثاني */}
                      {isCourseSearchLoading && (
                        <div className="p-2 flex items-center justify-center text-sm text-muted-foreground">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>جاري البحث...</span>
                        </div>
                      )}
                      <CommandEmpty>
                        {courseSearch.length > 1
                          ? "لم يتم العثور على دورة."
                          : "ابدأ بالكتابة للبحث..."}
                      </CommandEmpty>
                      <CommandGroup>
                        {courseOptions.map((course) => (
                          <CommandItem
                            key={course.id}
                            value={course.title}
                            onSelect={() => {
                              setSelectedCourse(course);
                              setAmount(course.price || "");
                              setIsCoursePopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCourse?.id === course.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {course.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {formErrors.course && (
                <p className="text-sm text-red-500 mt-1">{formErrors.course}</p>
              )}
            </div>
          </div>

          {/* Other Fields */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="amount" className="text-right pt-2">
              المبلغ <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="مثل: 100"
              />
              {formErrors.amount && (
                <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currency" className="text-right">
              العملة
            </Label>
            <Input
              id="currency"
              value={currency}
              disabled
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              الحالة
            </Label>
            <ShadSelect
              onValueChange={(v) =>
                setStatus(v as "succeeded" | "pending" | "failed")
              }
              value={status}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
                <SelectItem value="succeeded">ناجحة</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="failed">فشلت</SelectItem>
              </SelectContent>
            </ShadSelect>
          </div>
          {formErrors.submit && (
            <p className="text-sm text-red-500 col-span-4 text-center">
              {formErrors.submit}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "جاري الحفظ..." : "حفظ الدفعة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
