'use client';

import { useRef, useState, useEffect } from 'react';

interface VideoHeroProps {
  videoUrl?: string;
  youtubeId?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export default function VideoHero({
  videoUrl,
  youtubeId,
  title = "Watch My Latest Work",
  subtitle = "Professional video editing that brings your vision to life",
  ctaText = "Explore More Projects",
  onCtaClick
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const isYouTube = !!youtubeId;

  useEffect(() => {
    if (videoRef.current && !isYouTube) {
      videoRef.current.play().catch(() => {
        console.log('Auto-play was prevented');
      });
      setIsPlaying(true);
    }
  }, [isYouTube]);

  const togglePlay = () => {
    if (videoRef.current && !isYouTube) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current && !isYouTube) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="video-hero-section">
      <div className="video-hero-container">
        {/* Video Background */}
        <div
          className="video-hero-wrapper"
          onMouseEnter={() => !isYouTube && setShowControls(true)}
          onMouseLeave={() => !isYouTube && setShowControls(false)}
        >
          {isYouTube ? (
            <iframe
              className="video-hero-player youtube-player"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              ref={videoRef}
              className="video-hero-player"
              loop
              muted={isMuted}
              playsInline
              onClick={togglePlay}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Video Overlay Gradient */}
          <div className="video-hero-overlay" />

          {/* Video Controls - Only for direct video */}
          {!isYouTube && (
            <div className={`video-hero-controls ${showControls ? 'visible' : ''}`}>
              <button
                className="video-control-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>

              <button
                className="video-control-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Decorative Corner Brackets */}
          <div className="video-hero-brackets">
            <div className="bracket bracket-tl" />
            <div className="bracket bracket-tr" />
            <div className="bracket bracket-bl" />
            <div className="bracket bracket-br" />
          </div>
        </div>

        {/* Content Overlay */}
        <div className="video-hero-content">
          {/* Badge at top */}
          <div className="video-hero-badge-top">
            <div className="video-hero-badge">
              <span className="badge-dot-hero" />
              <span className="badge-text-hero">Featured Showreel</span>
            </div>
          </div>

          {/* Centered Title */}
          <h1 className="video-hero-title">{title}</h1>

          {/* Bottom section */}
          <div className="video-hero-bottom">
            <p className="video-hero-subtitle">{subtitle}</p>

            <div className="video-hero-actions">
              <button
                className="btn btn-primary btn-lg video-hero-cta"
                onClick={onCtaClick}
              >
                {ctaText}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator">
              <div className="scroll-mouse">
                <div className="scroll-wheel" />
              </div>
              <span className="scroll-text">Scroll to explore</span>
            </div>
          </div>
        </div>

        {/* Animated Particles */}
        <div className="video-hero-particles">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
