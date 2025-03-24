import { Loader } from "lucide-react";
import React from "react";

export const VideoLoadingIndicator: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 animate-in fade-in duration-300">
      <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
        <Loader
          size={40}
          className="text-white animate-spin"
        />
        <span className="text-white text-sm mt-2 animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
};
