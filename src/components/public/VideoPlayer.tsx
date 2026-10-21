'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  RotateCcw, AlertCircle, Loader2, Volume1 
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
}

// Robust helper to extract 11-character YouTube video ID
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Pattern matching youtube.com/watch, youtu.be, embed, live, shorts
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/i;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return match[1];
  }

  // Pure 11-character ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export default function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  className = ''
}: VideoPlayerProps) {
  const youtubeId = getYouTubeId(src);

  // Notice banner state for autoplay muted browser policy
  const [showMuteNotice, setShowMuteNotice] = useState(autoPlay);

  useEffect(() => {
    if (autoPlay && youtubeId) {
      const timer = setTimeout(() => {
        setShowMuteNotice(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, youtubeId]);

  // If a YouTube video is detected, render the responsive YouTube embed
  if (youtubeId) {
    const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${
      autoPlay ? 1 : 0
    }&mute=${
      autoPlay ? 1 : 0
    }&playsinline=1&rel=0&modestbranding=1&controls=1&enablejsapi=1&loop=1&playlist=${youtubeId}`;

    return (
      <div 
        className={`relative w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden border border-[#252D39] shadow-2xl group ${className}`}
      >
        <iframe
          src={embedUrl}
          title={title || "NEWSIGHT Video Broadcast"}
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        {/* Autoplay Audio Notification Overlay */}
        {showMuteNotice && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none transition-opacity duration-500 animate-in fade-in">
            <span className="px-2.5 py-1 bg-black/85 backdrop-blur-md border border-[#252D39] text-[11px] text-[#F5F7FA] font-medium rounded-lg flex items-center gap-1.5 shadow-lg">
              <Volume2 className="w-3.5 h-3.5 text-[#E50914] animate-pulse" />
              <span>Autoplaying • Click video for sound</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  // Fallback: Standard HTML5 Video Player for MP4 / WebM / HLS streams
  return <Html5VideoPlayer src={src} poster={poster} title={title} autoPlay={autoPlay} className={className} />;
}

// Subcomponent for HTML5 video playback
function Html5VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  className = ''
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0);
      setIsLoading(false);
      setHasError(false);
      if (autoPlay) {
        video.muted = true;
        video.play().catch(() => {});
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, [src, autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => setHasError(true));
    } else {
      video.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const seekTime = parseFloat(e.target.value);
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = parseFloat(e.target.value);
    video.volume = newVol;
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden border border-[#252D39] group select-none ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        muted={isMuted}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Loading Spinner */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
          <Loader2 className="w-10 h-10 text-[#E50914] animate-spin" />
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#080B11]/90 p-6 text-center z-20">
          <AlertCircle className="w-12 h-12 text-[#E50914] mb-3" />
          <h4 className="text-base font-bold text-white mb-1">Broadcast Stream Temporarily Unavailable</h4>
          <p className="text-xs text-[#A4ADBB] max-w-sm mb-4">
            The media server could not transmit this broadcast segment. Please verify connectivity or retry.
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              videoRef.current?.load();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#121925] hover:bg-[#1B2432] border border-[#252D39] text-xs font-bold text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Stream</span>
          </button>
        </div>
      )}

      {/* Center Big Play Button (when paused) */}
      {!isPlaying && !isLoading && !hasError && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E50914] hover:bg-red-700 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
            <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div 
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4 transition-opacity duration-300 flex flex-col gap-2 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber Bar */}
        <div className="relative w-full group/seek flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-zinc-700/80 rounded-lg appearance-none cursor-pointer accent-[#E50914] focus:outline-none"
          />
          <div 
            className="absolute left-0 top-0 h-1.5 bg-[#E50914] rounded-lg pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={togglePlay}
              className="p-1 hover:text-[#E50914] transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="p-1 hover:text-[#E50914] transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#E50914] focus:outline-none"
              />
            </div>

            <span className="text-[11px] sm:text-xs font-mono text-[#A4ADBB]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {title && (
              <span className="hidden md:inline-block text-xs font-medium text-[#A4ADBB] truncate max-w-xs">
                {title}
              </span>
            )}

            <button
              onClick={toggleFullscreen}
              className="p-1 hover:text-[#E50914] transition-colors"
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
