import { CAN_USE_DOM, cn } from "@/lib/utils";
import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { VideoLoadingIndicator } from "./video-loading-indicator";
import { VideoPlayerCentralControls } from "./video-player-central-control";
import VideoControls from "./video-player-controls";

export interface VideoPlayerContextValue {
  isPlaying: boolean;
  togglePlay: () => void;
  duration: number;
  currentTime: number;
  volume: number;
  setVolume: (volume: number) => void;
  muted: boolean;
  toggleMute: () => void;
  onSeek: (time: number) => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  buffered: TimeRanges | null;
  showControls: boolean;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  isLoading: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  isPictureInPicture: boolean;
  togglePictureInPicture: () => void;
  isPlaybackOpen: boolean;
  setIsPlayBackOpen: React.Dispatch<React.SetStateAction<boolean>>;
  src: string;
}

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  onClick?: (e: any) => void;
  canEnableFullScreen?: boolean;
  style?: React.CSSProperties;
  showControls?: boolean;
}

export const VideoPlayerContext = createContext<VideoPlayerContextValue>({
  isPlaying: false,
  togglePlay: () => {},
  duration: 0,
  currentTime: 0,
  volume: 0,
  setVolume: () => {},
  muted: false,
  toggleMute: () => {},
  onSeek: () => {},
  toggleFullscreen: () => {},
  isFullscreen: false,
  buffered: null,
  showControls: false,
  playbackSpeed: 1,
  setPlaybackSpeed: () => {},
  isLoading: true,
  containerRef: { current: null } as unknown as React.RefObject<HTMLDivElement>,
  isPictureInPicture: false,
  togglePictureInPicture: () => {},
  isPlaybackOpen: false,
  setIsPlayBackOpen: () => {},
  src: "",
});

export const VideoPlayer = ({
  src,
  poster,
  autoPlay = false,
  className,
  onClick,
  canEnableFullScreen = true,
  style,
  showControls: shouldShowConrtols = true,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState<TimeRanges | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const hideControlsTimerRef = useRef<number | null>(null);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [isPlaybackOpen, setIsPlayBackOpen] = useState(false);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setBuffered(videoRef.current.buffered);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          toast.error("Error while playing video");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    togglePlay();
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      const currentPlayingState = !videoRef.current.paused;

      videoRef.current.currentTime = time;
      setCurrentTime(time);

      if (currentPlayingState) {
        videoRef.current.play().catch(() => {
          toast.error("Error playing video after seek");
        });
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);

      if (newVolume === 0) {
        setMuted(true);
      } else if (muted) {
        setMuted(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setMuted(newMutedState);
    }
  };

  const toggleFullscreen = () => {
    if (!CAN_USE_DOM || !containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        toast.error("Error", {
          description: `Error attempting to enable fullscreen: ${err.message}`,
        });
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const startHideControlsTimer = () => {
    if (hideControlsTimerRef.current) {
      window.clearTimeout(hideControlsTimerRef.current);
    }

    if (isPlaying && isFullscreen && !isPlaybackOpen) {
      hideControlsTimerRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    startHideControlsTimer();
  };

  const handleMouseEnter = () => {
    setShowControls(true);
    if (!isFullscreen) {
      if (hideControlsTimerRef.current) {
        window.clearTimeout(hideControlsTimerRef.current);
      }
    } else {
      startHideControlsTimer();
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying && !isFullscreen && !isPlaybackOpen) {
      setShowControls(false);
    }
  };
  const togglePictureInPicture = async () => {
    if (!CAN_USE_DOM || !videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      toast.error("Failed to toggle Picture in Picture");
    }
  };

  useEffect(() => {
    if (!CAN_USE_DOM) return;

    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("waiting", handleWaiting);
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("playing", handleCanPlay);

      video.volume = volume;
      video.muted = muted;
      video.playbackRate = playbackSpeed;

      if (autoPlay) {
        video.play().catch(() => {
          toast.error("Error auto-playing video");
          setIsPlaying(false);
        });
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("waiting", handleWaiting);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("playing", handleCanPlay);
      }

      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [autoPlay, muted, volume, playbackSpeed]);

  useEffect(() => {
    if (!CAN_USE_DOM) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;

      const isVideoInFocus =
        containerRef.current.contains(document.activeElement) ||
        document.activeElement === document.body;

      if (!isVideoInFocus) return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          if (!canEnableFullScreen) return;
          e.preventDefault();
          toggleFullscreen();
          break;
        case "arrowleft":
          e.preventDefault();
          handleSeek(Math.max(0, currentTime - 5));
          break;
        case "arrowright":
          e.preventDefault();
          handleSeek(Math.min(duration, currentTime + 5));
          break;
        case "arrowup":
          e.preventDefault();
          handleVolumeChange(Math.min(1, volume + 0.1));
          break;
        case "arrowdown":
          e.preventDefault();
          handleVolumeChange(Math.max(0, volume - 0.1));
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentTime, duration, isPlaying, muted, volume]);

  useEffect(() => {
    return () => {
      if (hideControlsTimerRef.current) {
        window.clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (hideControlsTimerRef.current) {
        window.clearTimeout(hideControlsTimerRef.current);
      }
    } else if (isFullscreen) {
      startHideControlsTimer();
    }
  }, [isPlaying, isFullscreen]);

  useEffect(() => {
    if (!CAN_USE_DOM || !videoRef.current) return;

    const video = videoRef.current;

    const handlePiPChange = () => {
      setIsPictureInPicture(document.pictureInPictureElement === video);
    };

    video.addEventListener("enterpictureinpicture", handlePiPChange);
    video.addEventListener("leavepictureinpicture", handlePiPChange);

    return () => {
      video.removeEventListener("enterpictureinpicture", handlePiPChange);
      video.removeEventListener("leavepictureinpicture", handlePiPChange);
    };
  }, []);

  return (
    <VideoPlayerContext.Provider
      value={{
        isPlaying,
        togglePlay,
        duration,
        currentTime,
        volume,
        setVolume: handleVolumeChange,
        muted,
        toggleMute,
        onSeek: handleSeek,
        toggleFullscreen,
        isFullscreen,
        buffered,
        showControls,
        playbackSpeed,
        setPlaybackSpeed: handlePlaybackSpeedChange,
        isLoading,
        containerRef: containerRef as unknown as any,
        togglePictureInPicture,
        isPictureInPicture,
        isPlaybackOpen,
        setIsPlayBackOpen,
        src,
      }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "w-full h-full transition-all duration-500 relative overflow-hidden aspect-video shadow-xl bg-black",
          className
        )}
        style={style}
      >
        {shouldShowConrtols && <VideoPlayerCentralControls />}
        <video
          ref={videoRef}
          className={cn("w-full h-full rounded-lg object-contain", className)}
          poster={poster}
          preload="metadata"
          playsInline
          muted
          onClick={(e) => {
            if (onClick) {
              onClick(e);
              return;
            }
            handleVideoClick(e);
          }}
          onDoubleClick={toggleFullscreen}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {isLoading && <VideoLoadingIndicator />}

        {shouldShowConrtols && <VideoControls />}
      </div>
    </VideoPlayerContext.Provider>
  );
};
