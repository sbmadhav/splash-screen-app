# Splash Screen App

A customizable splash-screen experience built with Next.js, designed for focus sessions, relaxation, meetings, or events. Features dynamic backgrounds, ambient music with audio visualization, countdown timers, and comprehensive offline support.

## Features

### 🎨 Dynamic Backgrounds
- **Seasonal & Contextual**: Automatically fetches images from Unsplash based on season and time of day
- **Offline Library**: 20+ bundled high-quality background images for offline use
- **Custom Uploads**: Support for custom background images (JPG, PNG, WebP, max 10MB)
- **Smart Caching**: Enhanced background rotation with intelligent caching and fallback systems

### 🎵 Audio Experience
- **Ambient Music**: 10+ curated ambient tracks including lofi, chillhop, and nature sounds
- **Audio Visualizer**: Real-time circular waveforms with beat-responsive particle effects
- **Music Attribution**: Proper licensing information displayed for tracks requiring attribution
- **Timer Integration**: Music automatically starts/stops with countdown timer

### ⏱️ Timer & Productivity
- **Customizable Countdown**: Set timer duration and custom titles
- **Visual Feedback**: Clean, prominent timer display with completion notifications
- **Header Management**: Option to hide main title when timer finishes
- **Event Broadcasting**: Timer state changes trigger custom events for component coordination

### 🛠️ Customization
- **Text Display**: Custom heading text with optional typewriter animation effects
- **Logo Support**: Upload and display custom logos (square format recommended)
- **Theme System**: Light/dark theme support with system preference detection
- **Mobile Responsive**: Dedicated mobile info panel for smaller screens
- **Settings Persistence**: All preferences saved to localStorage with real-time sync

### 📱 Progressive Web App
- **PWA Ready**: Installable as standalone app on desktop and mobile
- **Offline First**: Full functionality without internet connection
- **Kiosk Mode**: Perfect for conference rooms, lobbies, or presentation displays
- **Cross-Platform**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Audio**: Web Audio API with custom visualizations
- **State Management**: localStorage with custom event broadcasting
- **Build Tools**: PNPM package manager

## Getting Started

### Prerequisites
- Node.js 18+ 
- PNPM (recommended) or npm

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd splash-screen-app
   pnpm install
   ```

2. **Set up environment variables** (optional)
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Unsplash API key for enhanced background variety:
   ```
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

## Project Structure

```
├── app/
│   ├── page.tsx                 # Main splash screen interface
│   ├── settings/page.tsx        # Comprehensive settings dashboard
│   ├── layout.tsx              # Root layout with PWA setup
│   └── api/
│       ├── random-image/        # Contextual Unsplash image fetching
│       └── env-vars/           # Environment variable inspection
├── components/
│   ├── audio-visualizer.tsx    # Real-time audio visualization
│   ├── background-image.tsx    # Smart background management
│   ├── timer-display.tsx       # Countdown timer component
│   ├── text-display.tsx        # Animated text overlay
│   ├── music-player.tsx        # Audio playback controller
│   ├── mobile-info-button.tsx  # Mobile-specific UI
│   └── ui/                     # Reusable UI components
├── hooks/
│   └── use-background-image-enhanced.ts # Background rotation logic
├── public/
│   ├── background/             # Offline background image library
│   ├── music/                  # Ambient audio tracks
│   └── manifest.json          # PWA configuration
└── types/
    └── image.ts               # TypeScript interfaces
```

## Configuration

### Settings Panel (`/settings`)
Access comprehensive customization options:

- **Display Settings**: Toggle logo, text, timer visibility
- **Background Options**: Choose between API, offline library, or custom images
- **Audio Configuration**: Select music tracks and visualizer preferences
- **Timer Settings**: Customize duration, title, and completion behavior
- **Theme Preferences**: Light/dark mode selection
- **Animation Controls**: Enable/disable text animations

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `UNSPLASH_ACCESS_KEY` | Enables high-quality seasonal backgrounds | No |
| `NEXT_PUBLIC_VERCEL_URL` | Deployment URL for production builds | No |

Without the Unsplash key, the app gracefully falls back to Picsum photos and the offline image library.

## Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### Docker
```bash
docker build -t splash-screen-app .
docker run -p 3000:3000 splash-screen-app
```

### Other Platforms
The app is compatible with any Node.js hosting platform (Netlify, Railway, DigitalOcean, etc.)

## Usage Scenarios

- **Meeting Rooms**: Display countdown timers with company branding
- **Livestreams**: Professional waiting screen with ambient audio
- **Focus Sessions**: Pomodoro-style timer with calming backgrounds
- **Events**: Custom messaging with seasonal imagery
- **Kiosks**: Standalone display mode for public spaces

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with Web Audio API support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Background images from [Unsplash](https://unsplash.com) photographers
- Ambient music tracks with proper attribution in the app
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Audio visualization inspired by Web Audio API examples

