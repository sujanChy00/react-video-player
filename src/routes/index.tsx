import { VideoPlayer } from "@/components/video-player";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <main className="bg-black">
      <div className="min-h-screen container mx-auto flex items-center justify-center rounded-xl">
        <VideoPlayer src="https://videos.pexels.com/video-files/6521834/6521834-uhd_2560_1440_30fps.mp4" />
      </div>
    </main>
  );
}
