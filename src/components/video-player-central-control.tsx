import { cn } from "@/lib/utils";
import { History, Pause, Play } from "lucide-react";
import { useVideoPlayer } from "./use-video-player";

export const VideoPlayerCentralControls = () => {
  const {
    isPlaying,
    togglePlay,
    isLoading,
    showControls,
    onSeek,
    currentTime,
    duration,
    isFullscreen,
  } = useVideoPlayer();

  const canForward = currentTime < duration - 5;
  const canRewind = currentTime > 5;

  const forward = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canForward) return;
    const newTime = Math.min(duration, currentTime + 5);
    onSeek(newTime);
  };

  const rewind = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canRewind) return;
    const newTime = Math.max(0, currentTime - 5);
    onSeek(newTime);
  };

  if (showControls && !isLoading)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-6 z-50">
        <button
          onClick={rewind}
          disabled={!canRewind}
          className={cn(
            "rounded-full bg-black/30 transition-all animate-in fade-in",
            canRewind ? "hover:bg-black/40" : "opacity-50 cursor-not-allowed",
            isFullscreen ? "p-4" : "p-3"
          )}
          aria-label="Rewind 5 seconds"
        >
          <History
            className={cn("text-white", isFullscreen ? "size-8" : "size-6")}
          />
        </button>

        <button
          onClick={togglePlay}
          className={cn(
            "rounded-full bg-black/30 hover:bg-black/40 transition-all animate-in fade-in duration-200 hover:scale-110 active:scale-75",
            isFullscreen ? "p-8" : "p-6"
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause
              className={cn("text-white", isFullscreen ? "size-14" : "size-8")}
            />
          ) : (
            <Play
              className={cn("text-white", isFullscreen ? "size-14" : "size-8")}
            />
          )}
        </button>

        <button
          onClick={forward}
          disabled={!canForward}
          className={cn(
            "rounded-full bg-black/30 transition-all animate-in fade-in",
            canForward ? "hover:bg-black/40" : "opacity-50 cursor-not-allowed",
            isFullscreen ? "p-4" : "p-3"
          )}
          aria-label="Forward 5 seconds"
        >
          <History
            className={cn(
              "text-white scale-x-[-1]",
              isFullscreen ? "size-8" : "size-6"
            )}
          />
        </button>
      </div>
    );
};
