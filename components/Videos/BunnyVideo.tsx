"use client";

import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button"; // ShadCN button
import { cn } from "@/lib/utils"; // utility for classnames

type BunnyVideoProps = {
  videoId: string;
  width?: string;
  height?: string;
  autoplay?: boolean;
  className?: string;
};

export const BunnyVideo: React.FC<BunnyVideoProps> = ({
  videoId,
  width = "100%",
  height = "100%",
  autoplay = false,
  className = "",
}) => {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(!autoplay);

  const fetchIframeUrl = async () => {
    if (!videoId) {
      setError("معرف الفيديو مفقود");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/generate-token?videoId=${videoId}`);
      const data = await res.json();

      if (res.ok && data.iframeUrl) {
        const url = autoplay 
          ? `${data.iframeUrl}&autoplay=false` 
          : data.iframeUrl;
        setIframeUrl(url);
      } else {
        setError(data.error || "فشل تحميل الفيديو");
      }
    } catch (err) {
      console.error("Error fetching Bunny token:", err);
      setError("حدث خطأ أثناء تحميل الفيديو");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIframeUrl();
  }, [videoId, autoplay]);

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center rounded-xl overflow-hidden bg-gray-900 relative", className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700/30 via-gray-900/40 to-gray-700/30 animate-pulse" />
        <div className="flex flex-col items-center z-10">
          <Loader2 className="w-12 h-12 text-white animate-spin mb-3" />
          <p className="text-white/70 text-sm">جارٍ تحميل الفيديو...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-red-950/50 rounded-xl border-2 border-red-900/50 p-4", className)}>
        <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
        <p className="text-red-400 font-semibold mb-1">فشل تحميل الفيديو</p>
        <p className="text-red-400/70 text-sm mb-2">{error}</p>
        <Button variant="destructive" onClick={fetchIframeUrl} className="text-sm">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  if (!iframeUrl) return null;

  return (
    <div className={cn("relative rounded-xl shadow-lg overflow-hidden", className)}>
      {showOverlay && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 cursor-pointer transition-opacity duration-300 hover:bg-black/40" onClick={() => setShowOverlay(false)}>
          <Play className="w-16 h-16 text-white animate-pulse" />
        </div>
      )}
      <iframe
        src={iframeUrl + (autoplay ? "&autoplay=false" : "")}
        width={width}
        height={height}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{ border: 0 }}
        loading="lazy"
        className={cn("transition-opacity duration-700", showOverlay ? "opacity-50" : "opacity-100")}
        title="Bunny Video Player"
      />
    </div>
  );
};
