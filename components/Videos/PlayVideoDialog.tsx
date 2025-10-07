"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BunnyVideo } from "@/components/Videos/BunnyVideo";
import { Play } from "lucide-react";

type PlayVideoDialogProps = {
  videoId?: string;
  title: string;
};

export const PlayVideoDialog = ({ videoId, title }: PlayVideoDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Play className="w-4 h-4 ml-1" /> تشغيل
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl w-full max-w-full">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="w-full relative pt-[56.25%]">
          <BunnyVideo videoId={videoId ?? ""} autoplay className="absolute top-0 left-0 w-full h-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
