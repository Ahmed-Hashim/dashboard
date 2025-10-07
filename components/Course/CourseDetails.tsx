"use client";

import { Tables } from "@/types/database";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Eye,
  DollarSign,
  Youtube,
  CheckCircle,
  XCircle,
} from "lucide-react";

type Course = Tables<"courses"> & {
  views: number;
  instructor_name?: string;
};

type Props = {
  course: Course;
};

// Helper component for consistent icon-label-value formatting.
const DetailItem = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-row items-start gap-3">
    {/* Icon: Sized consistently with a slight top margin for perfect visual alignment. */}
    <div className="mt-0.5 flex-shrink-0 text-muted-foreground">{icon}</div>

    {/* Text Content: Clear hierarchy between the label and the value. */}
    <div className="flex flex-col">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-base font-semibold text-foreground">{children}</div>
    </div>
  </div>
);

export const CourseDetails = ({ course }: Props) => {
  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      {/* Course Image */}
      {course.image_url && (
        <div className="w-full h-64 relative">
          <Image
            src={course.image_url}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Title and Description */}
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
        {course.description && (
          <CardDescription className="pt-2 text-base">
            {course.description}
          </CardDescription>
        )}
      </CardHeader>

      {/* Course Information */}
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
          <DetailItem icon={<User className="h-4 w-4" />} label="المدرب">
            {course.instructor || "غير محدد"}
          </DetailItem>

          <DetailItem icon={<Eye className="h-4 w-4" />} label="عدد المشاهدات">
            {course.views}
          </DetailItem>

          <DetailItem icon={<DollarSign className="h-4 w-4" />} label="السعر">
            {course.price ? `${course.price} جنيه` : "مجاني"}
          </DetailItem>

          <DetailItem
            icon={
              course.published ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )
            }
            label="الحالة"
          >
            <Badge variant={course.published ? "default" : "destructive"}>
              {course.published ? "منشور" : "مسودة"}
            </Badge>
          </DetailItem>
        </div>

        {course.yt_video_id && (
          <div className="mt-6">
            <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
              <Link
                href={`https://www.youtube.com/watch?v=${course.yt_video_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="h-4 w-4" />
                شاهد الفيديو على يوتيوب
              </Link>
            </Button>
          </div>
        )}
      </CardContent>

      {/* SEO Metadata (Collapsible) */}
      {course.seo_meta && (
        <>
          <Separator className="my-4" />
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="seo-meta">
                <AccordionTrigger className="font-semibold">
                  بيانات تحسين محركات البحث (SEO)
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="text-sm overflow-x-auto bg-muted p-4 rounded-md">
                    {JSON.stringify(course.seo_meta, null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </>
      )}
    </Card>
  );
};