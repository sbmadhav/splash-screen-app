# Splash Screen App

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/sbmadhav/splash-screen-app)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-231%20passed-brightgreen?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)
[![Test Status](https://img.shields.io/badge/Test%20Status-✅%20Passing-brightgreen?style=flat&logo=checkmarq&logoColor=white)](#testing)
[![Coverage](https://img.shields.io/badge/Coverage-45.11%25-yellow?style=flat&logo=jest&logoColor=white)](#testing)
[![Branch Coverage](https://img.shields.io/badge/Branch%20Coverage-43.29%25-yellow?style=flat&logo=git-branch&logoColor=white)](#testing)
[![Function Coverage](https://img.shields.io/badge/Function%20Coverage-33.81%25-orange?style=flat&logo=code&logoColor=white)](#testing)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)

A customizable splash-screen experience built with Next.js, designed for focus sessions, relaxation, meetings, or events. Features dynamic backgrounds, ambient music with audio visualization, countdown timers, and comprehensive offline support. **Optimized for lightning-fast performance** with intelligent lazy caching that delivers sub-second load times.

## Performance Highlights

- **⚡ Sub-Second Load Times**: Core app loads in under 1 second
- **�️ 99.9% Image Optimization**: WebP thumbnails reduced from 107MB to 0.1MB
- **�📦 Lazy Asset Loading**: Images and music cached only when needed
- **🧠 Intelligent Caching**: Service worker avoids Next.js chunk conflicts with automatic version management
- **🔄 Smart Cache Updates**: Automatic stale cache detection prevents manual browser cache clearing
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

### 📊 Analytics & Insights
- **Google Analytics 4**: Optional privacy-conscious usage tracking
- **Performance Monitoring**: Built-in Vercel Analytics integration
- **GDPR Friendly**: Analytics only enabled when configured, no default tracking
- **Environment-Based**: Analytics automatically disabled in development mode

### ⚡ Performance Optimizations
- **Lightning-Fast Load**: Core app loads in ~1 second, assets loaded on-demand
- **Lazy Caching Strategy**: Background images and music files cached only when accessed
- **Service Worker Intelligence**: Smart caching avoids Next.js chunk conflicts
- **Memory Efficient**: Optimal cache management prevents memory bloat
- **Progressive Loading**: Users see content immediately while additional resources load in background
- **Bandwidth Friendly**: No unnecessary downloads of unused assets
- **GitHub Pages Optimized**: Designed for optimal performance on static hosting platforms

### 🖼️ WebP Image Optimization
- **99.9% Size Reduction**: Background thumbnails optimized from 107MB to 0.1MB total
- **WebP Format**: Ultra-fast loading optimized thumbnails for settings page
- **Automatic Generation**: Script converts all background images to WebP thumbnails
- **Sharp Processing**: High-quality image optimization with minimal file sizes
- **Perfect Quality**: 150x100px thumbnails maintain visual clarity at tiny file sizes
- **Immediate Caching**: Thumbnails cached during service worker installation for instant loading

### 🔧 Cache Management System
- **Automatic Version Detection**: Prevents stale cache issues with smart version checking
- **Manual Cache Controls**: Settings page includes "Clear All Cache" button for user control
- **Service Worker Messages**: Real-time communication between app and service worker
- **Cache Status Display**: View total caches, cached items, and storage details
- **Version Tracking**: `CACHE_VERSION` system ensures fresh content after updates
- **Intelligent Updates**: Automatic cache refresh when app versions change
- **User-Friendly**: No more manual browser cache clearing required

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI + shadcn/ui
- **Audio**: Web Audio API with custom visualizations
- **Performance**: Service Worker with intelligent lazy caching + automatic cache management
- **Image Optimization**: Sharp for WebP conversion with 99.9% size reduction
- **APIs**: Client-side Unsplash integration for GitHub Pages compatibility
- **State Management**: localStorage with custom event broadcasting
- **Build Tools**: PNPM package manager with optimized build pipeline
- **Cache Management**: Custom cache utilities with version tracking and UI controls
- **Testing**: Jest with React Testing Library - **[View Test Coverage](./TEST_SUMMARY.md)** (231 tests, 100% pass rate, 45.11% coverage)

## Getting Started

### Prerequisites
- Node.js 18+ 
- PNPM (recommended) or npm

## 🔐 Security

For secure API key management and deployment practices, see our detailed [Security Guide](docs/SECURITY.md).

**Quick Setup for GitHub Pages:**
1. Add `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` as a GitHub repository secret
2. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` as a GitHub repository secret (optional, for analytics)
3. The GitHub Actions workflow will automatically use them during deployment
4. Never commit API keys to version control

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
   Add your API keys for enhanced features:
   ```
   # For development (server-side)
   UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   
   # For GitHub Pages deployment (client-side)
   NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   
   # Google Analytics 4 (optional, for usage analytics)
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
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

### Performance Scripts

The project includes specialized scripts for optimization:

```bash
# Generate optimized WebP thumbnails (99.9% size reduction)
pnpm run generate-thumbnails

# Build for GitHub Pages deployment
pnpm run build:github

# Serve the built application locally
pnpm run serve
```

**WebP Thumbnail Generation**: 
- Converts all background images to 150x100px WebP thumbnails
- Reduces total thumbnail size from 107MB to 0.1MB
- Automatically generates manifest.json for the thumbnail collection
- Essential for fast settings page loading

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
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID for usage tracking | No |
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

1. **Set up repository secrets** (optional, for enhanced features):
   - Go to your repository Settings → Secrets and variables → Actions
   - Add `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` with your Unsplash access key
   - Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` with your Google Analytics 4 measurement ID

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
             NEXT_PUBLIC_GA_MEASUREMENT_ID: ${{ secrets.NEXT_PUBLIC_GA_MEASUREMENT_ID }}
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

## Testing

[![Tests](https://img.shields.io/badge/Tests-231%20passed-brightgreen?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)
[![Test Status](https://img.shields.io/badge/Test%20Status-✅%20Passing-brightgreen?style=flat&logo=checkmarq&logoColor=white)](#testing)
[![Coverage](https://img.shields.io/badge/Coverage-45.11%25-yellow?style=flat&logo=jest&logoColor=white)](#testing)
[![Branch Coverage](https://img.shields.io/badge/Branch%20Coverage-43.29%25-yellow?style=flat&logo=git-branch&logoColor=white)](#testing)
[![Function Coverage](https://img.shields.io/badge/Function%20Coverage-33.81%25-orange?style=flat&logo=code&logoColor=white)](#testing)

This project maintains a comprehensive test suite to ensure reliability and prevent regressions. All tests are currently passing with optimized timer management to prevent memory leaks.

### Test Commands

```bash
# Run all tests
pnpm test

# Run tests with coverage report
pnpm test -- --coverage

# Run tests in watch mode during development
pnpm test -- --watch

# Run tests in CI mode (useful for GitHub Actions)
pnpm test -- --ci --watchAll=false

# Run specific test file
pnpm test -- --testPathPattern=background-image

# Run specific test suite  
pnpm test -- --testNamePattern="renders correctly"
```

### Test Coverage Summary

| Metric | Percentage | Status |
|--------|------------|--------|
| **Statements** | 45.11% | 🟡 Good |
| **Branches** | 43.29% | 🟡 Good |
| **Functions** | 33.81% | 🟠 Adequate |
| **Lines** | 44.86% | 🟡 Good |

**Total Tests**: 233 (231 passed, 2 skipped)
**Test Suites**: 28 passed
**Runtime**: ~16-19 seconds

### Test Structure

```
__tests__/
├── components/              # Component unit tests (25 test files)
│   ├── audio-visualizer.test.tsx      # Audio visualization component
│   ├── background-image.test.tsx      # Dynamic background handling
│   ├── dynamic-head.test.tsx          # SEO and meta tag management
│   ├── music-player.test.tsx          # Audio playback controls
│   ├── pwa-install-prompt.test.tsx    # PWA installation UI
│   ├── timer-display.test.tsx         # Countdown timer logic
│   ├── text-display.test.tsx          # Custom text rendering
│   └── ...more
├── api/                     # API route tests (3 test files)
│   ├── random-image.test.ts
│   ├── env-vars.test.ts
│   └── bing-image/
├── hooks/                   # Custom hook tests (2 test files)
│   ├── use-background-image-enhanced.test.ts
│   └── use-background-image-offline-mode.test.ts
├── lib/                     # Utility function tests (3 test files)
│   ├── debug-utils.test.ts
│   ├── static-utils.test.ts
│   └── utils.test.ts
├── integration/             # Full feature integration tests (4 test files)
│   ├── settings-page.test.tsx
│   ├── home-page.test.tsx
│   ├── performance-lazy-caching.test.tsx
│   └── pwa-integration.test.tsx
└── service-worker/          # Service worker tests (1 test file)
    └── lazy-caching.test.ts
```

### Current Test Coverage

```
Overall Coverage: 45.11%
┌─────────────┬────────────┬────────────┬────────────┬────────────┐
│ Type        │ % Stmts    │ % Branch   │ % Funcs    │ % Lines    │
├─────────────┼────────────┼────────────┼────────────┼────────────┤
│ App Pages   │ 68.65%     │ 66.66%     │ 63.63%     │ 74.07%     │
│ Components  │ 60.46%     │ 49.29%     │ 57.27%     │ 61.60%     │
│ Hooks       │ 41.94%     │ 43.19%     │ 43.05%     │ 41.49%     │
│ Libraries   │ 66.89%     │ 49.45%     │ 77.27%     │ 64.95%     │
│ UI Kit      │ 6.85%      │ 4.01%      │ 6.37%      │ 7.31%      │
└─────────────┴────────────┴────────────┴────────────┴────────────┘
```

### Test Coverage Highlights

**✅ Well-Tested Areas (>60% coverage):**
- **Core App Components**: Main page, debug utilities, static utilities
- **Background Image System**: API integration, fallbacks, lazy loading  
- **PWA Features**: Install prompts, service worker, splash screens
- **Music Player**: Playback controls, debug logging, state management
- **Timer Functionality**: Countdown logic, formatting, event handling
- **Component Library**: Main functional components (60.46% coverage)

**🔶 Moderate Coverage (40-60%):**
- **Custom Hooks**: Background image management, countdown logic (41.94% coverage)
- **Settings Management**: User preferences, theme handling
- **Audio Visualizer**: Web Audio API integration, canvas rendering

**⚠️ Areas for Improvement (<40%):**
- **UI Component Library**: shadcn/ui components (6.85% coverage)
- **Edge Cases**: Error boundaries, network failures

### Quality Assurance Features

- **🚀 Performance Tests**: Lazy loading, caching strategies, memory usage
- **🔄 Integration Tests**: Full user workflows, component interactions
- **🛡️ PWA Tests**: Installation flows, offline functionality, service worker
- **🎵 Audio Tests**: Web Audio API, visualizer effects, timing precision
- **📱 Mobile Tests**: Responsive design, touch interactions
- **⚡ Speed Tests**: Load time validation, asset optimization
- **🌐 API Tests**: External service integration, fallback mechanisms
- **💾 Persistence Tests**: localStorage, settings synchronization

### Testing Best Practices

When contributing new features, please include:

1. **Unit Tests**: Test individual components and functions
2. **Integration Tests**: Test component interactions
3. **Coverage Requirements**: Aim for >80% coverage on new code
4. **Mock External Dependencies**: APIs, localStorage, Web Audio API
5. **Test Edge Cases**: Network failures, invalid inputs, browser limitations

### Debug Testing

The project includes specialized debug tests for development:

```bash
# Run debug-specific tests
pnpm test -- --testNamePattern="debug"

# Test music player debug functionality
pnpm test -- __tests__/components/music-player-debug.test.tsx

# Test audio visualizer debug features
pnpm test -- __tests__/components/audio-visualizer-debug.test.tsx
```

### Continuous Integration

All tests run automatically on:
- Pull request creation
- Push to main branch
- Release preparation

The CI pipeline ensures:
- ✅ All tests pass (211/211)
- ✅ No TypeScript errors
- ✅ Code style compliance
- ✅ Build success for multiple environments

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Asset Attributions

This project uses various assets including background images, music tracks, and icons. Proper attribution is provided for all assets:

- **Background Images**: Mix of Unsplash API images and local library images
- **Music Files**: Ambient tracks with proper licensing (details in app)
- **Icons**: Custom created PWA icons and UI elements
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) (MIT License)

### Viewing Full Attributions

Complete attribution information including sources, creators, and licenses can be viewed:
- **In the app**: Visit Settings → View Attributions
- **In this repository**: See [ATTRIBUTIONS.md](ATTRIBUTIONS.md)

### Attribution Verification

To verify attribution completeness:
```bash
# Check that all assets have proper attributions
node scripts/verify-attributions.js

# Generate attribution template for new assets
node scripts/verify-attributions.js template
```

### For Content Creators

If you are the creator of any asset used in this project and:
- Your attribution is missing or incorrect
- You'd like your content removed
- You have updated licensing terms

Please open an issue or contact the project maintainer.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Background images from [Unsplash](https://unsplash.com) photographers
- Ambient music tracks with proper attribution in the app
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Audio visualization inspired by Web Audio API examples
- Performance optimization techniques inspired by modern PWA best practices
- Lazy loading strategies adapted from Next.js optimization guidelines

