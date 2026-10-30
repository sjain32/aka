
# Editor Section Setup Guide

## Adding Your Photo

Your portfolio now has a premium editor/about section! Here's how to customize it:

### Step 1: Add Your Photo

1. Create an `images` folder in the `public` directory:
   ```
   public/
   └── images/
       └── editor-photo.jpg
   ```

2. Add your professional photo as `editor-photo.jpg`

**Photo Requirements:**
- **Orientation:** Portrait (vertical)
- **Recommended size:** 800x1000px or similar ratio
- **Format:** JPG or PNG
- **Style:** Professional headshot or profile photo
- **Background:** Clean, preferably solid color or minimal

### Step 2: Customize Your Information

Edit `src/app/page.tsx` and update the EditorSection props:

```tsx
<EditorSection
  name="YOUR NAME"              // Your name in all caps
  title="VIDEO EDITOR"          // Your title/role
  location="BASED IN YOUR CITY" // Your location
  description="Your bio here..."  // Your description
  imageUrl="/images/editor-photo.jpg"  // Path to your photo
  socialLinks={{
    instagram: "https://instagram.com/yourusername",
    facebook: "https://facebook.com/yourusername",
    youtube: "https://youtube.com/@yourusername",
    behance: "https://behance.net/yourusername"
  }}
/>
```

## Design Features

✅ **Orange Gradient Background** - Matches your brand color (#ff6b35)
✅ **Large Name Typography** - Bold background text
✅ **Geometric Frame** - Animated corner brackets around photo
✅ **Social Links Sidebar** - IG, FB, YT, BE links on the left
✅ **Professional Layout** - Grid-based responsive design
✅ **Hover Effects** - Image zoom, frame animations
✅ **Mobile Responsive** - Adapts to all screen sizes

## Layout Structure

```
┌─────────────────────────────────────────┐
│  IG                                     │
│  FB        [LARGE NAME BACKGROUND]      │
│  YT                                     │
│  BE                                     │
│                                         │
│     [PHOTO]              SAY HELLO!     │
│   with frame             Description    │
│                          text here...   │
│                                         │
│  VIDEO EDITOR                           │
│  BASED IN CITY                          │
└─────────────────────────────────────────┘
```

## Color Scheme

- **Background:** Orange gradient (matches primary color)
- **Text:** White with various opacities
- **Accents:** White borders and lines
- **Hover:** Brighter white, scale effects

## Tips for Best Results

1. **Photo Quality:** Use high-resolution, well-lit photo
2. **Background:** Solid or minimal background works best
3. **Framing:** Face should be clearly visible
4. **Professional:** Dress appropriately for your brand
5. **Expression:** Confident, approachable look

## Optional Customizations

You can modify colors in `src/app/globals.css`:

```css
.editor-section {
  background: linear-gradient(135deg, 
    rgba(255, 107, 53, 0.95) 0%,  /* Change these colors */
    rgba(255, 140, 80, 0.9) 50%,
    rgba(255, 180, 120, 0.95) 100%
  );
}
```

Enjoy your premium editor section! 🎨✨
