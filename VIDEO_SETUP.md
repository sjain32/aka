# Video Hero Setup Guide

## Adding Your Showreel Video

Your portfolio now has a premium video hero component! Here's how to add your video:

### Step 1: Prepare Your Video

1. **Export your video** in MP4 format (H.264 codec recommended)
2. **Recommended specs:**
   - Resolution: 1920x1080 (Full HD) or higher
   - Bitrate: 5-10 Mbps for good quality
   - Duration: 30-90 seconds (showreel length)
   - File size: Keep under 50MB for fast loading

### Step 2: Add Video to Project

1. Create a `videos` folder in the `public` directory:
   ```
   public/
   └── videos/
       └── showreel.mp4
   ```

2. Place your video file as `showreel.mp4` in the `public/videos/` folder

### Step 3: Customize (Optional)

You can customize the hero component in `src/app/page.tsx`:

```tsx
<VideoHero
  videoUrl="/videos/showreel.mp4"  // Change video path here
  title="Watch My Latest Work"      // Change title
  subtitle="Professional video editing that brings your vision to life"  // Change subtitle
  ctaText="Explore More Projects"   // Change button text
  onCtaClick={scrollToProjects}     // Button action
/>
```

## Features

✅ **Auto-play** - Video starts automatically (muted by default)
✅ **Loop** - Video loops continuously
✅ **Controls** - Play/Pause and Mute/Unmute buttons (appear on hover)
✅ **Responsive** - Works on all screen sizes
✅ **Premium animations** - Fade-in effects, particles, corner brackets
✅ **Smooth scroll** - CTA button scrolls to projects section
✅ **Glassmorphism** - Modern glass effects on controls

## Video Optimization Tips

1. **Compress your video** using tools like:
   - HandBrake (free)
   - Adobe Media Encoder
   - FFmpeg

2. **Use web-optimized settings:**
   ```
   ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k showreel.mp4
   ```

3. **Consider multiple formats** for better browser support:
   - MP4 (H.264) - Primary format
   - WebM - Optional for better compression

## Troubleshooting

**Video not showing?**
- Check file path is correct: `/videos/showreel.mp4`
- Ensure video file is in `public/videos/` folder
- Check browser console for errors

**Video not auto-playing?**
- This is normal browser behavior for unmuted videos
- Video will auto-play muted, users can unmute with the button

**Slow loading?**
- Compress your video to reduce file size
- Consider using a CDN for hosting large videos
- Add a poster image for faster initial load

## Next Steps

1. Add your showreel video to `public/videos/showreel.mp4`
2. Test on different devices and browsers
3. Customize text and colors to match your brand
4. Add more portfolio projects below the hero section

Enjoy your premium video portfolio! 🎬✨
