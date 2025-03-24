import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useContext } from "react";
import { VideoPlayerContext } from "./video-player";

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);

  if (!context) {
    throw new Error("useVideoPlayer must be used within a <VideoPlayer />");
  }
  const {
    isPlaying,
    togglePlay,
    duration,
    currentTime,
    volume,
    setVolume,
    muted,
    toggleMute,
    onSeek,
    toggleFullscreen,
    isFullscreen,
    buffered,
    showControls,
    playbackSpeed,
    setPlaybackSpeed,
    isLoading,
    containerRef,
    isPlaybackOpen,
    setIsPlayBackOpen,
    isPictureInPicture,
    togglePictureInPicture,
    src,
  } = context;

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] || 0;
    setVolume(newVolume);

    if (newVolume > 0 && muted) {
      toggleMute();
    }
  };

  const VolumeIcon = () => {
    if (muted || volume === 0)
      return (
        <VolumeX
          size={20}
          className="stroke-white transition-all duration-200"
        />
      );
    if (volume < 0.5)
      return (
        <Volume1
          size={20}
          className="stroke-white transition-all duration-200"
        />
      );
    return (
      <Volume2 size={20} className="stroke-white transition-all duration-200" />
    );
  };

  return {
    VolumeIcon,
    formatTime,
    handleVolumeChange,
    isPlaying,
    togglePlay,
    duration,
    currentTime,
    volume,
    setVolume,
    muted,
    toggleMute,
    onSeek,
    toggleFullscreen,
    isFullscreen,
    buffered,
    showControls,
    playbackSpeed,
    setPlaybackSpeed,
    isLoading,
    containerRef,
    isPlaybackOpen,
    setIsPlayBackOpen,
    isPictureInPicture,
    togglePictureInPicture,
    src,
  };
};
