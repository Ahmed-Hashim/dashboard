// components/Dashboard/PaymentsCard.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Purchase } from "@/types/types";
import Link from "next/link";

interface PaymentsCardProps {
  purchases: Purchase[];
}

export default function PaymentsCard({ purchases }: PaymentsCardProps) {
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "";
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>آخر المبيعات</CardTitle>
        <CardDescription>
          آخر 5 عمليات شراء ناجحة تمت على المنصة.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length > 0 ? (
          purchases.map((purchase) => (
            <div key={purchase.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={purchase.user_image || ''} alt="Avatar" />
                <AvatarFallback>{purchase.user_name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1 flex-1">
                <p className="text-sm font-medium leading-none">{purchase.user_name}</p>
                <p className="text-sm text-muted-foreground truncate">{purchase.course_title}</p>
              </div>
              <div className="font-medium">{formatCurrency(purchase.amount)}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            لا توجد عمليات شراء حديثة.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
            <Link href="/dashboard/sales">
                عرض جميع المبيعات <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}