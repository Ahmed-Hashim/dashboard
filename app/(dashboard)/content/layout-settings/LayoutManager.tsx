'use client';

import { HeaderWithNavLinks, FooterWithLinks } from '@/types/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FooterSettings } from './FooterSettings';
import { HeaderSettings } from './HeaderSettings';

interface LayoutManagerProps {
  initialHeaderData: HeaderWithNavLinks;
  initialFooterData: FooterWithLinks;
}

export function LayoutManager({ initialHeaderData, initialFooterData }: LayoutManagerProps) {
  return (
    <Tabs defaultValue="header" className="w-full" dir='rtl'>
      <TabsList className="grid w-full grid-cols-2 bg-gray-700">
        <TabsTrigger value="header">إعدادات الهيدر</TabsTrigger>
        <TabsTrigger value="footer">إعدادات الفوتر</TabsTrigger>
      </TabsList>
      <TabsContent value="header">
        <HeaderSettings initialData={initialHeaderData} />
      </TabsContent>
      <TabsContent value="footer">
        <FooterSettings initialData={initialFooterData} />
      </TabsContent>
    </Tabs>
  );
}