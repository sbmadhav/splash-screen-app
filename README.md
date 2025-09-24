# Splash Screen App

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Jest-29.7.0-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

A customizable splash-screen experience built with Next.js, designed for focus sessions, relaxation, meetings, or events. Features dynamic backgrounds, ambient music with audio visualization, countdown timers, and comprehensive offline support. **Optimized for lightning-fast performance** with intelligent lazy caching that delivers sub-second load times.

## Performance Highlights

- **⚡ Sub-Second Load Times**: Core app loads in under 1 second
- **📦 Lazy Asset Loading**: Images and music cached only when needed
- **🧠 Intelligent Caching**: Service worker avoids Next.js chunk conflicts
- **💨 GitHub Pages Ready**: Optimized for static hosting with client-side APIs
- **🎯 Progressive Enhancement**: Content visible immediately, enhancements load in background

## Features

### 🎨 Dynamic Backgrounds
- **Seasonal & Contextual**: Automatically fetches images from Unsplash based on season and time of day
- **GitHub Pages Compatible**: Client-side API integration for static deployments
- **Offline Library**: 20+ bundled high-quality background images for offline use
- **Custom Uploads**: Support for custom background images (JPG, PNG, WebP, max 10MB)
- **Lazy Caching**: Images are cached only when used, ensuring lightning-fast initial load times
- **Smart Fallbacks**: Graceful degradation to local images when external APIs are unavailable
- **Performance Optimized**: Service worker implements intelligent caching strategies

### 🎵 Audio Experience
- **Ambient Music**: 10+ curated ambient tracks including lofi, chillhop, and nature sounds
- **Lazy Loading**: Music files are preloaded on-demand when selected, not during initial load
- **Audio Visualizer**: Real-time circular waveforms with beat-responsive particle effects
- **Music Attribution**: Proper licensing information displayed for tracks requiring attribution
- **Timer Integration**: Music automatically starts/stops with countdown timer
- **Offline Playback**: Full music library cached for offline use after first access

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
- **Smart Splash Screen**: Fast-loading PWA splash screen with real-time progress
- **Kiosk Mode**: Perfect for conference rooms, lobbies, or presentation displays
- **Cross-Platform**: Works on desktop, tablet, and mobile devices
- **App-Like Experience**: Native app feel with web accessibility

### ⚡ Performance Optimizations
- **Lightning-Fast Load**: Core app loads in ~1 second, assets loaded on-demand
- **Lazy Caching Strategy**: Background images and music files cached only when accessed
- **Service Worker Intelligence**: Smart caching avoids Next.js chunk conflicts
- **Memory Efficient**: Optimal cache management prevents memory bloat
- **Progressive Loading**: Users see content immediately while additional resources load in background
- **Bandwidth Friendly**: No unnecessary downloads of unused assets
- **GitHub Pages Optimized**: Designed for optimal performance on static hosting platforms

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI + shadcn/ui
- **Audio**: Web Audio API with custom visualizations
- **Performance**: Service Worker with intelligent lazy caching
- **APIs**: Client-side Unsplash integration for GitHub Pages compatibility
- **State Management**: localStorage with custom event broadcasting
- **Build Tools**: PNPM package manager with optimized build pipeline
- **Testing**: Jest with React Testing Library - **[View Test Coverage](./TEST_SUMMARY.md)** (85 tests, 100% pass rate)

## Getting Started

### Prerequisites
- Node.js 18+ 
- PNPM (recommended) or npm

## 🔐 Security

For secure API key management and deployment practices, see our detailed [Security Guide](docs/SECURITY.md).

**Quick Setup for GitHub Pages:**
1. Add `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` as a GitHub repository secret
2. The GitHub Actions workflow will automatically use it during deployment
3. Never commit API keys to version control

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd splash-screen-app
   pnpm install
   ```

2. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env.local
   ```
   Add your Unsplash API key for enhanced background variety:
   ```
   # For development (server-side)
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   
   # For GitHub Pages deployment (client-side)
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
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

## Testing

The project includes a comprehensive unit test suite covering all components, API routes, custom hooks, and integration scenarios.

### Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests for CI/CD pipelines
pnpm test:ci
```

### Test Structure

```
__tests__/
├── components/              # Component unit tests
│   ├── text-display.test.tsx
│   ├── timer-display.test.tsx
│   ├── background-image.test.tsx
│   ├── music-player.test.tsx
│   └── audio-visualizer.test.tsx
├── api/                     # API route tests
│   ├── random-image.test.ts
│   └── env-vars.test.ts
├── hooks/                   # Custom hook tests
│   └── use-background-image-enhanced.test.ts
├── lib/                     # Utility function tests
│   └── utils.test.ts
└── integration/             # Full page integration tests
    ├── settings-page.test.tsx
    └── home-page.test.tsx
```

### Test Coverage

The test suite covers:
- ✅ **Component Rendering** - All UI components render correctly
- ✅ **User Interactions** - Button clicks, form inputs, file uploads
- ✅ **State Management** - localStorage persistence and synchronization
- ✅ **Timer Functionality** - Countdown logic, pause/resume, completion events
- ✅ **Audio Features** - Music playback, visualizer, Web Audio API integration
- ✅ **Background Images** - API calls, caching, fallback mechanisms
- ✅ **Theme Switching** - Light/dark mode transitions
- ✅ **Settings Persistence** - Configuration saving and loading
- ✅ **API Endpoints** - External service integration and error handling
- ✅ **Mobile Responsiveness** - Screen size adaptations
- ✅ **Error Handling** - Graceful degradation and fallbacks

### Testing Framework

- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **jsdom** - Browser environment simulation
- **Custom Mocks** - Web Audio API, localStorage, fetch, Next.js navigation

### Writing Tests

When contributing new features, please include tests:

1. **Component Tests** - Test rendering, props, and user interactions
2. **Hook Tests** - Test custom hook logic and side effects
3. **API Tests** - Test endpoints with various scenarios and error conditions
4. **Integration Tests** - Test complete user workflows

Example test structure:
```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup mocks and localStorage
  })

  it('renders correctly with default props', () => {
    // Test basic rendering
  })

  it('handles user interactions', () => {
    // Test clicks, inputs, etc.
  })

  it('manages state correctly', () => {
    // Test state changes and persistence
  })
})
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
| `UNSPLASH_ACCESS_KEY` | Enables high-quality seasonal backgrounds (development) | No |
| `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` | Enables Unsplash API for GitHub Pages (client-side) | No |
| `NEXT_PUBLIC_VERCEL_URL` | Deployment URL for production builds | No |

Without the Unsplash key, the app gracefully falls back to Picsum photos and the offline image library.

## Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

### GitHub Pages
For GitHub Pages deployment with full API support:

**🚀 Performance Note**: The app is specifically optimized for GitHub Pages with client-side API calls and lazy caching strategies that ensure fast loading times.

1. **Set up repository secrets** (optional, for Unsplash API):
   - Go to your repository Settings → Secrets and variables → Actions
   - Add `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` with your Unsplash access key

2. **Build and deploy**:
   ```bash
   ./build-github.sh
   ```
   This script:
   - Temporarily moves API routes (not supported on static hosting)
   - Builds optimized static export
   - Creates GitHub Pages directory structure
   - Fixes asset paths for subdirectory deployment
   - Restores API routes for development

3. **GitHub Actions** (automated deployment):
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '18'
             cache: 'npm'
         - run: npm ci
         - run: ./build-github.sh
           env:
             NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: ${{ secrets.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY }}
         - uses: actions/deploy-pages@v3
           with:
             path: out/splash-screen-app
   ```

**Key Features for Static Deployment**:
- ✅ **Client-Side API Calls**: Unsplash integration works directly from browser
- ✅ **Lazy Caching**: Only loads assets when needed, not during initial page load
- ✅ **Smart Fallbacks**: Gracefully degrades to local assets when APIs are unavailable
- ✅ **Service Worker**: Caches assets intelligently without conflicting with static hosting

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
- **Conferences**: Fast-loading presentation standby screen
- **Digital Signage**: Lightweight solution for digital displays

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
- Performance optimization techniques inspired by modern PWA best practices
- Lazy loading strategies adapted from Next.js optimization guidelines

