import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock Web Audio API
global.AudioContext = jest.fn().mockImplementation(() => ({
  createAnalyser: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    fftSize: 256,
    frequencyBinCount: 128,
    getByteFrequencyData: jest.fn(),
    getByteTimeDomainData: jest.fn(),
  })),
  createMediaElementSource: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
  })),
  destination: {},
  resume: jest.fn().mockResolvedValue(undefined),
  suspend: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
  state: 'running',
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock HTMLAudioElement
global.HTMLAudioElement.prototype.play = jest.fn().mockResolvedValue(undefined)
global.HTMLAudioElement.prototype.pause = jest.fn()
global.HTMLAudioElement.prototype.load = jest.fn()

// Mock fetch
global.fetch = jest.fn()

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock anime.js
global.window.anime = {
  timeline: jest.fn(() => ({
    add: jest.fn().mockReturnThis(),
  })),
  remove: jest.fn(),
}

// Mock Canvas API
HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation((contextType) => {
  if (contextType === '2d') {
    return {
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Array(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => ({ data: new Array(4) })),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      fillText: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      measureText: jest.fn(() => ({ width: 0 })),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
    }
  }
  return null
})

// Mock Image constructor
global.Image = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  src: '',
  onload: null,
  onerror: null,
}))

// Mock FileReader
global.FileReader = jest.fn().mockImplementation(() => ({
  readAsDataURL: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  result: null,
  onload: null,
  onerror: null,
}))

// Mock Next.js server APIs for API route testing
global.Request = jest.fn().mockImplementation((url, options) => ({
  url: url || 'http://localhost:3000',
  method: options?.method || 'GET',
  headers: new Map(),
  body: options?.body || null,
  json: jest.fn().mockResolvedValue({}),
  text: jest.fn().mockResolvedValue(''),
}))

global.Response = jest.fn().mockImplementation((body, options) => ({
  ok: true,
  status: options?.status || 200,
  statusText: options?.statusText || 'OK',
  headers: new Map(),
  body: body || null,
  json: jest.fn().mockResolvedValue(body ? JSON.parse(body) : {}),
  text: jest.fn().mockResolvedValue(body || ''),
}))

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      ok: true,
      status: options?.status || 200,
      statusText: options?.statusText || 'OK',
      headers: new Map(),
      body: JSON.stringify(data),
      json: jest.fn().mockResolvedValue(data),
      text: jest.fn().mockResolvedValue(JSON.stringify(data)),
    })),
  },
  NextRequest: jest.fn().mockImplementation((url, options) => ({
    url: url || 'http://localhost:3000',
    method: options?.method || 'GET',
    headers: new Map(),
    body: options?.body || null,
    json: jest.fn().mockResolvedValue({}),
    text: jest.fn().mockResolvedValue(''),
    nextUrl: new URL(url || 'http://localhost:3000'),
    searchParams: new URLSearchParams(new URL(url || 'http://localhost:3000').search),
  })),
}))

// Mock process.env for API tests
process.env.UNSPLASH_ACCESS_KEY = 'test_access_key_1234'
process.env.NEXT_PUBLIC_VERCEL_URL = 'https://test.vercel.app'
