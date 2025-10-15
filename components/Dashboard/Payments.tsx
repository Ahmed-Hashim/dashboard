"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { supabase } from "@/lib/supabaseClient";

interface Purchase {
  id: string;
  user_email: string;
  course_name: string;
  amount: number;
  purchased_at: string;
  user_image?: string;
  currency?: string;
}

const CardList = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const { data, error } = await supabase
          .from("purchases_with_users")
          .select("*")
          .order("purchased_at", { ascending: false })
          .limit(5);

        if (error) {
          console.error("Supabase error:", error.message);
          return;
        }

        setPurchases(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) return <p>جاري التحميل...</p>;

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">آخر الاشتراكات</h1>
      <div className="flex flex-col gap-2">
        {purchases.map((item) => (
          <Card
            key={item.id}
            className="flex-row items-center justify-between gap-4 p-4"
          >
            <div className="w-12 h-12 rounded-sm relative overflow-hidden">
              <Image
                src={item.user_image || "/placeholder.jpg"}
                alt={item.course_name || "صورة المستخدم"}
                fill
                className="object-cover rounded-full"
              />
            </div>

            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">
                {item.course_name}
              </CardTitle>
              <Badge variant="secondary">{item.user_email}</Badge>
            </CardContent>

            <CardFooter className="p-0 text-sm font-medium">
              {new Intl.NumberFormat("ar-EG", {
                style: "currency",
                currency: item.currency || "EGP",
                currencyDisplay: "name", // ممكن تغيرها لـ "symbol" لو عايز علامة العملة
              }).format(item.amount)}
            </CardFooter>
          </Card>
        ))}

        {purchases.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            لا توجد اشتراكات بعد.
          </p>
        )}
      </div>
    </div>
  );
};

export default CardList;
