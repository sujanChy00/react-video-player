import { CAN_USE_DOM, cn } from "@/lib/utils";
import {
  Info,
  Maximize,
  Minimize,
  Pause,
  PictureInPicture,
  PictureInPicture2,
  Play,
} from "lucide-react";
import { Slider } from "./ui//slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip } from "./ui/tooltip";
import { useVideoPlayer } from "./use-video-player";
import VideoProgress from "./video-player-progress";

const VideoControls = () => {
  const btnClassName =
    "flex h-10 w-10 items-center justify-center rounded-lg bg-transparent text-white transition-all duration-200 hover:bg-white/10";
  const iconClassName = "stroke-white transition-all duration-200";
  const {
    toggleMute,
    muted,
    volume,
    isPlaying,
    togglePlay,
    duration,
    currentTime,
    toggleFullscreen,
    isFullscreen,
    showControls,
    playbackSpeed,
    setPlaybackSpeed,
    VolumeIcon,
    handleVolumeChange,
    formatTime,
    containerRef,
    isPlaybackOpen,
    setIsPlayBackOpen,
    togglePictureInPicture,
    isPictureInPicture,
    src,
  } = useVideoPlayer();

  const isFullscreenAvailable = CAN_USE_DOM && document.fullscreenEnabled;
  const isPiPAvailable = CAN_USE_DOM && "pictureInPictureEnabled" in document;

  return (
    <div
      className={cn(
        "absolute -bottom-40 left-1/2 -translate-x-1/2 right-0 pb-4 pt-6 px-6 rounded-2xl duration-150 ease-in-out transition-all space-y-3 animate-slide-up  pointer-events-none bg-[#11111198] backdrop-blur-md w-[80%]",
        showControls && "bottom-4 pointer-events-auto"
      )}
    >
      <div className="flex items-center justify-between w-full gap-x-3">
        <p className="text-white">{formatTime(currentTime)} </p>
        <VideoProgress />
        <p className="text-white">{formatTime(duration)}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            className={cn(
              "transition-all duration-150 active:scale-75",
              btnClassName
            )}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} className={iconClassName} />
            ) : (
              <Play size={20} className={iconClassName} />
            )}
          </button>

          <div className="flex items-center space-x-2 group">
            <button
              className={cn(
                "active:scale-75 duration-150 transition-all",
                btnClassName
              )}
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              <VolumeIcon />
            </button>
            <div className="overflow-hidden group-hover:overflow-visible w-0 transition-all duration-150 ease-in-out group-hover:w-20 ">
              <Slider
                value={[muted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="h-1.5 cursor-pointer"
                trackClassName="bg-white/40 h-1"
                rangeClassName="bg-secondary"
                thumbClassName="h-4 w-4 border-none shadow-lg bg-secondary cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu open={isPlaybackOpen} onOpenChange={setIsPlayBackOpen}>
            <DropdownMenuTrigger asChild>
              <button className={btnClassName} aria-label="Playback Speed">
                <span className="font-medium text-white">{playbackSpeed}x</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-9 bg-black border-dark p-0 overflow-hidden"
              containerRef={isFullscreen ? containerRef : undefined}
            >
              {[0.5, 1, 1.5, 2].map((speed) => (
                <DropdownMenuItem
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={cn(
                    "text-xs p-2 text-white hover:!bg-zinc-800 hover:!text-white rounded-none border-b border-gray-700 last:border-transparent",
                    playbackSpeed === speed && "bg-zinc-800"
                  )}
                >
                  {speed}x
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip
            disableHoverableContent={true}
            disabled={isPiPAvailable}
            label={
              !isPiPAvailable ? (
                <div className="flex gap-2 items-center">
                  <Info />
                  <div className="text-sm">
                    <p>
                      Your browser does not support Picture in Picture mode.
                    </p>
                    <p>
                      Please use a different browser or right-click the video{" "}
                      <br /> to enable Picture in Picture.
                    </p>
                  </div>
                </div>
              ) : (
                ""
              )
            }
          >
            <button
              disabled={!isPiPAvailable}
              className={cn(
                btnClassName,
                !isPiPAvailable && "opacity-50 cursor-not-allowed",
                isPictureInPicture ? "bg-white/10" : "bg-transparent"
              )}
              onClick={togglePictureInPicture}
              aria-label={
                isPictureInPicture
                  ? "Exit Picture in Picture"
                  : "Enter Picture in Picture"
              }
            >
              {isPictureInPicture ? (
                <PictureInPicture size={20} className={cn(iconClassName)} />
              ) : (
                <PictureInPicture2 size={20} className={iconClassName} />
              )}
            </button>
          </Tooltip>

          <button
            disabled={!isFullscreenAvailable}
            className={cn(
              btnClassName,
              !isFullscreenAvailable && "opacity-50 cursor-not-allowed",
              isFullscreen ? "bg-white/10" : "bg-transparent"
            )}
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize size={20} className={iconClassName} />
            ) : (
              <Maximize size={20} className={iconClassName} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
