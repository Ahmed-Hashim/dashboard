// components/MediaManagerDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, ImagePlus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface BunnyCDNFile {
  Guid: string;
  ObjectName: string;
  Length: number;
  LastChanged: string;
  IsDirectory: boolean;
  Path: string;
}

interface MediaManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (url: string) => void;
  currentImageUrl?: string;
}

export function MediaManagerDialog({
  open,
  onOpenChange,
  onSelectImage,
  currentImageUrl,
}: MediaManagerDialogProps) {
  const [files, setFiles] = useState<BunnyCDNFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open]);

  const fetchImages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/media/list");
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      const imageFiles = data.filter(
        (file: BunnyCDNFile) =>
          !file.IsDirectory &&
          /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.ObjectName)
      );
      setFiles(imageFiles);
    } catch (err) {
      setError("فشل تحميل الصور");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("يرجى اختيار ملف صورة فقط");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      await fetchImages();
      setSelectedFile(null);
      setPreviewUrl("");
    } catch (err) {
      setError("فشل رفع الصورة");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (fileName: string) => {
    setFileToDelete(fileName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    try {
      const response = await fetch("/api/media/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: fileToDelete }),
      });

      if (!response.ok) throw new Error("Delete failed");

      await fetchImages();
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    } catch (err) {
      setError("فشل حذف الصورة");
      console.error(err);
      setDeleteDialogOpen(false);
    }
  };

  const getImageUrl = (fileName: string) => {
    return `https://${process.env.NEXT_PUBLIC_BUNNY_CDN_URL}/${fileName}`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>مكتبة الوسائط</DialogTitle>
            <DialogDescription>
              اختر صورة من المكتبة أو قم برفع صورة جديدة
            </DialogDescription>
          </DialogHeader>

          {/* Upload Section */}
          <div className="px-6 py-4 border-y bg-muted/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex-1 cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Upload className="w-5 h-5" />
                    <span className="text-sm">
                      {selectedFile ? selectedFile.name : "اختر صورة للرفع"}
                    </span>
                  </div>
                </div>
              </label>
              {selectedFile && (
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="sm:w-auto"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      رفع الصورة
                    </>
                  )}
                </Button>
              )}
            </div>
            {previewUrl && (
              <div className="mt-4">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  className="object-contain rounded-lg"
                  width={100}
                  height={100}
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Images Grid */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <ImagePlus className="w-16 h-16 mb-4 opacity-50" />
                <p>لا توجد صور في المكتبة</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {files.map((file) => {
                  const imageUrl = getImageUrl(file.ObjectName);
                  const isSelected = currentImageUrl === imageUrl;

                  return (
                    <div
                      key={file.Guid}
                      className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary ring-2 ring-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => {
                        onSelectImage(imageUrl);
                        onOpenChange(false);
                      }}
                    >
                      <div className="aspect-square bg-muted">
                        <Image
                          src={imageUrl}
                          alt={file.ObjectName}
                          className="w-full h-full object-cover"
                          width={300}
                          height={300}
                        />
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(file.ObjectName);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* File Name */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-xs text-white truncate">
                          {file.ObjectName}
                        </p>
                      </div>

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                          محدد
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الصورة نهائياً من الخادم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}