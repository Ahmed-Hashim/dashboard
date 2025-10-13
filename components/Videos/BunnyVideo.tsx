"use client";

import React, { useEffect, useState, useCallback } from "react"; // ✅ Import useCallback
import { Loader2, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  // ✅ Wrap the function in useCallback to stabilize it
  const fetchIframeUrl = useCallback(async () => {
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
        // ✅ Set the base URL first. Autoplay will be added based on user interaction or props.
        const baseUrl = data.iframeUrl;
        // If autoplay prop is true, immediately construct the autoplay URL
        setIframeUrl(autoplay ? `${baseUrl}&autoplay=true` : baseUrl);
      } else {
        setError(data.error || "فشل تحميل الفيديو");
      }
    } catch (err) {
      console.error("Error fetching Bunny token:", err);
      setError("حدث خطأ أثناء تحميل الفيديو");
    } finally {
      setLoading(false);
    }
  }, [videoId, autoplay]); // ✅ Add the function's own dependencies here

  // ✅ Now it's safe to add the stable fetchIframeUrl to the dependency array
  useEffect(() => {
    fetchIframeUrl();
  }, [fetchIframeUrl]);

  // ✅ This function now correctly starts playback by updating the iframe's src
  const handlePlayClick = () => {
    if (iframeUrl && !iframeUrl.includes("autoplay=true")) {
      setIframeUrl(`${iframeUrl}&autoplay=true`);
    }
    setShowOverlay(false);
  };
  
  // --- The rest of the component remains the same ---

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center rounded-xl overflow-hidden bg-gray-900 relative aspect-video", className)}>
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
      <div className={cn("flex flex-col items-center justify-center bg-red-950/50 rounded-xl border-2 border-red-900/50 p-4 aspect-video", className)}>
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
    <div className={cn("relative rounded-xl shadow-lg overflow-hidden aspect-video", className)}>
      {showOverlay && (
        <div 
          className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 cursor-pointer transition-opacity duration-300 hover:bg-black/40" 
          onClick={handlePlayClick} // ✅ Use the new handler
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 bg-white/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play className="w-12 h-12 text-white fill-white" style={{ transform: 'translateX(2px)' }} />
            </div>
          </div>
        </div>
      )}
      <iframe
        src={iframeUrl} // ✅ The URL in state is now the single source of truth
        width={width}
        height={height}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        style={{ border: 0 }}
        loading="lazy"
        className="w-full h-full"
        title="Bunny Video Player"
      />
    </div>
  );
};