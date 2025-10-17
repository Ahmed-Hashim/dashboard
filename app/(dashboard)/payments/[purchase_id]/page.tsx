// app/invoices/[purchase_id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // تأكد من أن هذا هو العميل الصحيح
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/Invoices/InvoicePDF"; // مكون الـ PDF الذي أنشأناه
import { Button } from "@/components/ui/button";

// تعريف نوع البيانات المستلمة من الدالة
type InvoiceData = {
  purchase_id: string;
  purchased_at: string;
  amount: number;
  currency: string;
  course_title: string;
  user_name: string;
  user_email: string;
};

export default function InvoicePage() {
  const params = useParams();
  const purchase_id = params.purchase_id as string;

  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!purchase_id) return;

    const fetchInvoice = async () => {
      setLoading(true);
      setError(null);

      // استدعاء دالة Supabase الآمنة
      const { data, error } = await supabase.rpc("get_invoice_details", {
        p_purchase_id: purchase_id,
      });

      if (error) {
        console.error("Error fetching invoice:", error);
        setError("حدث خطأ أثناء جلب الفاتورة.");
      } else if (data && data.length > 0) {
        setInvoiceData(data[0]);
      } else {
        setError("الفاتورة غير موجودة أو ليس لديك صلاحية لعرضها.");
      }
      setLoading(false);
    };

    fetchInvoice();
  }, [purchase_id]);

  // عرض حالة التحميل
  if (loading) {
    return <div className="p-10 text-center">جاري تحميل الفاتورة...</div>;
  }

  // عرض رسالة الخطأ
  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  // عرض الفاتورة وزر التحميل
  if (invoiceData) {
    return (
      <div dir="rtl" className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">تفاصيل الفاتورة</h1>

          {/* زر التحميل - يظهر فقط بعد تحميل البيانات */}
          <PDFDownloadLink
            document={<InvoicePDF data={invoiceData} />}
            fileName={`invoice-${invoiceData.purchase_id}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <Button disabled>جاري تجهيز الـ PDF...</Button>
              ) : (
                <Button>تحميل PDF</Button>
              )
            }
          </PDFDownloadLink>
        </div>

        {/* عرض الفاتورة على الشاشة (HTML version) */}
        <div className="bg-white p-6 border rounded-lg shadow-sm text-black">
          {/* يمكنك هنا تصميم عرض HTML للفاتورة مشابه لمكون الـ PDF */}
          <p className=" text-black">
            <span className="font-bold text-black">رقم الفاتورة:</span>{" "}
            {invoiceData.purchase_id}
          </p>
          <p className=" text-black">
            <span className="font-bold text-black">التاريخ:</span>{" "}
            {new Date(invoiceData.purchased_at).toLocaleDateString("ar-EG")}
          </p>
          <hr className="my-4" />
          <p className="font-bold text-black">فاتورة إلى:</p>
          <p className=" text-black">{invoiceData.user_name}</p>
          <p className=" text-black">{invoiceData.user_email}</p>
          <hr className="my-4" />
          <p className="font-bold text-black">البيان:</p>
          <p className=" text-black">شراء دورة: {invoiceData.course_title}</p>
          <hr className="my-4 bg-black" />
          <p className="text-xl font-bold text-black text-left">
            الإجمالي: {invoiceData.amount} {invoiceData.currency}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
