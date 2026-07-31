'use client';

import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface EditorSectionProps {
  name?: string;
  title?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    behance?: string;
  };
}

export default function EditorSection({
  name = "YOUR NAME",
  title = "VIDEO EDITOR",
  location = "BASED IN YOUR CITY",
  description = "I'm a passionate and dedicated freelance video editor with a keen eye for detail and a creative flair. With years of experience in the industry, I specialize in",
  imageUrl = "/images/editor-photo.jpg",
  socialLinks = {
    instagram: "#",
    facebook: "#",
    youtube: "#",
    behance: "#"
  }
}: EditorSectionProps) {
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { ref: descRef, isVisible: descVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="editor-section">
      <div className="editor-container">
        {/* Left Side - Social Links */}
        <div
          className="editor-social-sidebar"
          style={{
            opacity: imageVisible ? 1 : 0,
            transform: imageVisible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
          }}
        >
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
              IG
            </a>
          )}
          {socialLinks.facebook && (
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
              FB
            </a>
          )}
          {socialLinks.youtube && (
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="social-link">
              YT
            </a>
          )}
          {socialLinks.behance && (
            <a href={socialLinks.behance} target="_blank" rel="noopener noreferrer" className="social-link">
              BE
            </a>
          )}
        </div>

        {/* Center - Large Name Watermark */}
        <div
          className="editor-name-large"
          style={{
            opacity: imageVisible ? 1 : 0,
            transform: imageVisible
              ? 'translate(-50%, -50%) scale(1)'
              : 'translate(-50%, -50%) scale(0.8)',
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
          }}
        >
          {name}
        </div>

        {/* Main Content */}
        <div className="editor-content-wrapper">
          {/* Image with Geometric Frame */}
          <div
            ref={imageRef}
            className="editor-image-container"
            style={{
              opacity: imageVisible ? 1 : 0,
              transform: imageVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="geometric-frame">
              <div className="frame-corner frame-tl"></div>
              <div className="frame-corner frame-tr"></div>
              <div className="frame-corner frame-bl"></div>
              <div className="frame-corner frame-br"></div>
              <div className="frame-lines">
                <div className="frame-line frame-line-1"></div>
                <div className="frame-line frame-line-2"></div>
                <div className="frame-line frame-line-3"></div>
              </div>
            </div>
            <div className="editor-image-wrapper">
              <img
                src={imageUrl}
                alt={name}
                className="editor-image"
              />
            </div>

            {/* Skills/Tools Icons Below Image - Infinite Scroll */}
            <div className="editor-tools">
              <div className="tools-scroll-wrapper">
                {['cap-cut', 'Da-vinci', 'final-cut', 'premiere-pro', 'After Effecct'].map((icon, idx) => (
                  <div className="tool-icon" key={`a-${idx}`}>
                    <img src={`/Tools icons/${icon}.${icon.includes('premiere') ? 'png' : icon.includes('final') || icon.includes('cap') ? 'webp' : 'jpg'}`} alt={icon} className="tool-logo" />
                    <span className="tool-name">{icon === 'After Effecct' ? 'After Effects' : icon === 'cap-cut' ? 'CapCut' : icon === 'Da-vinci' ? 'DaVinci' : icon === 'final-cut' ? 'Final Cut' : 'Premiere'}</span>
                  </div>
                ))}
                {/* Duplicate for seamless loop */}
                {['cap-cut', 'Da-vinci', 'final-cut', 'premiere-pro', 'After Effecct'].map((icon, idx) => (
                  <div className="tool-icon" key={`b-${idx}`}>
                    <img src={`/Tools icons/${icon}.${icon.includes('premiere') ? 'png' : icon.includes('final') || icon.includes('cap') ? 'webp' : 'jpg'}`} alt={icon} className="tool-logo" />
                    <span className="tool-name">{icon === 'After Effecct' ? 'After Effects' : icon === 'cap-cut' ? 'CapCut' : icon === 'Da-vinci' ? 'DaVinci' : icon === 'final-cut' ? 'Final Cut' : 'Premiere'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Left - Title */}
          <div
            ref={titleRef}
            className="editor-title-block"
            style={{
              opacity: titleVisible ? 1 : 0,
              transform: titleVisible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
            }}
          >
            <h2 className="editor-title">{title}</h2>
            <p className="editor-location">{location}</p>
          </div>

          {/* Bottom Right - Description */}
          <div
            ref={descRef}
            className="editor-description-block"
            style={{
              opacity: descVisible ? 1 : 0,
              transform: descVisible ? 'translateX(0)' : 'translateX(40px)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s',
            }}
          >
            <h3 className="editor-greeting">SAY HELLO !</h3>
            <p className="editor-description">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
