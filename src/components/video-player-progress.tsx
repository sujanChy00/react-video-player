import { CAN_USE_DOM } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Slider } from "./ui/slider";
import { useVideoPlayer } from "./use-video-player";

const VideoProgress = () => {
  const { duration, currentTime, onSeek, buffered } = useVideoPlayer();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!CAN_USE_DOM) return;

    if (duration) {
      setProgress((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);

  const handleProgressChange = (value: number[]) => {
    const seekTime = ((value?.[0] || 0) / 100) * duration;
    onSeek(seekTime);
  };

  const renderBuffered = () => {
    if (!CAN_USE_DOM || !buffered || !duration) return null;

    const elements = [];
    for (let i = 0; i < buffered.length; i++) {
      const start = (buffered.start(i) / duration) * 100;
      const end = (buffered.end(i) / duration) * 100;
      const width = end - start;

      elements.push(
        <div
          key={i}
          className="absolute h-1 group-hover:h-1.5 duration-300 ease-in-out transition-all top-1/2 -translate-y-1/2 bg-white/40 rounded-full"
          style={{ left: `${start}%`, width: `${width}%` }}
        />
      );
    }

    return elements;
  };

  return (
    <div className="relative group w-full h-3 flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        {renderBuffered()}
      </div>
      <Slider
        value={[progress]}
        max={100}
        step={0.1}
        onValueChange={handleProgressChange}
        className="h-full cursor-pointer"
        trackClassName="bg-white/20 h-1 group-hover:h-1.5 duration-300 ease-in-out transition-all"
        rangeClassName="bg-white rounded-none"
        thumbClassName="size-0 group-hover:size-5 duration-200 ease-in-out transition-all origin-center border-none shadow-lg"
      />
    </div>
  );
};

export default VideoProgress;
