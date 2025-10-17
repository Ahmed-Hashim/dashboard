// components/Invoices/InvoicePDF.tsx
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// --- 1. إصلاح وتسجيل الخطوط (الأهم) ---
// يجب أن يتطابق اسم 'family' مع ما ستستخدمه في الستايلات.
// من الأفضل تسجيل الأوزان المختلفة لنفس عائلة الخط.
Font.register({
  family: 'Somar Rounded', // سنستخدم هذا الاسم في الستايلات
  fonts: [
    { src: '/font/SomarRounded-Regular.ttf' }, // الوزن العادي
    { src: '/font/SomarRounded-Bold.ttf', fontWeight: 'bold' }, // الوزن العريض
  ],
});

// تعريف الستايلات
const styles = StyleSheet.create({
  page: {
    direction: 'rtl',
    fontFamily: 'Somar Rounded', // <-- 2. استخدام اسم الخط الصحيح
    fontSize: 11,
    padding: 30,
  
    color: '#000', // <-- 3. تطبيق اللون الأسود على كل الصفحة (الطلب الأساسي)
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold', // سيعمل الآن لأننا سجلنا الوزن العريض
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eee',
    padding: '5px 0',
  },
  label: {
    fontWeight: 'bold', // سيستخدم الوزن العريض المسجل
  },
  table: {
    width: '100%',
    border: '1px solid #eee',
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    borderBottom: '1px solid #eee',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #eee',
  },
  col: {
    width: '50%',
    padding: 8,
    textAlign: 'right',
  },
  boldCol: { // ستايل مخصص للخط العريض داخل الجدول
    width: '50%',
    padding: 8,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  total: {
    marginTop: 20,
    textAlign: 'left',
    fontSize: 14,
  }
});

// تعريف نوع البيانات لتمريرها للمكون
type InvoiceData = {
  purchase_id: string;
  purchased_at: string;
  amount: number;
  currency: string;
  course_title: string;
  user_name: string;
  user_email: string;
};

// مكون الـ PDF
export const InvoicePDF = ({ data }: { data: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>فاتورة ضريبية</Text>
      </View>

      {/* Invoice Details */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text>{data.purchase_id}</Text>
          <Text style={styles.label}>رقم الفاتورة:</Text>
        </View>
        <View style={styles.row}>
          <Text>{new Date(data.purchased_at).toLocaleDateString('ar-EG')}</Text>
          <Text style={styles.label}>تاريخ الإصدار:</Text>
        </View>
      </View>

      {/* Billed To */}
      <View style={styles.section}>
        <Text style={styles.label}>فاتورة إلى:</Text>
        <Text>{data.user_name}</Text>
        <Text>{data.user_email}</Text>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.boldCol}>السعر</Text>
          <Text style={styles.boldCol}>البيان</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.col}>{data.amount} {data.currency}</Text>
          <Text style={styles.col}>شراء دورة: {data.course_title}</Text>
        </View>
      </View>

      {/* Total */}
      <View style={styles.total}>
        <Text style={styles.label}>الإجمالي: {data.amount} {data.currency}</Text>
      </View>

    </Page>
  </Document>
);