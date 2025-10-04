import { render } from '@testing-library/react'
import { GoogleAnalytics } from '@/components/google-analytics'

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockScript({ 
    children, 
    id, 
    src, 
    strategy, 
    ...props 
  }: any) {
    if (children) {
      return <script id={id} data-strategy={strategy} {...props} dangerouslySetInnerHTML={{__html: children}} />
    }
    return <script id={id} src={src} data-strategy={strategy} {...props} />
  }
})

describe('GoogleAnalytics', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('renders GA scripts when measurement ID is provided', () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123456'
    
    const { container } = render(<GoogleAnalytics />)
    
    // Check if gtag.js script is rendered
    const gtagScript = container.querySelector('script[src*="googletagmanager.com/gtag/js"]')
    expect(gtagScript).toBeInTheDocument()
    expect(gtagScript).toHaveAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-TEST123456')
    expect(gtagScript).toHaveAttribute('data-strategy', 'afterInteractive')
    
    // Check if configuration script is rendered
    const configScript = container.querySelector('script#google-analytics')
    expect(configScript).toBeInTheDocument()
    expect(configScript).toHaveAttribute('data-strategy', 'afterInteractive')
    
    // Check if the configuration includes the measurement ID
    const scriptContent = configScript?.innerHTML
    expect(scriptContent).toContain('G-TEST123456')
    expect(scriptContent).toContain('gtag(\'config\', \'G-TEST123456\')')
  })

  it('does not render GA scripts when measurement ID is not provided', () => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    
    const { container } = render(<GoogleAnalytics />)
    
    // Should not render any scripts
    const scripts = container.querySelectorAll('script')
    expect(scripts).toHaveLength(0)
  })

  it('does not render GA scripts when measurement ID is empty', () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = ''
    
    const { container } = render(<GoogleAnalytics />)
    
    // Should not render any scripts
    const scripts = container.querySelectorAll('script')
    expect(scripts).toHaveLength(0)
  })

  it('includes proper gtag configuration', () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-ANALYTICS123'
    
    const { container } = render(<GoogleAnalytics />)
    
    const configScript = container.querySelector('script#google-analytics')
    const scriptContent = configScript?.innerHTML
    
    // Check for proper gtag setup
    expect(scriptContent).toContain('window.dataLayer = window.dataLayer || []')
    expect(scriptContent).toContain('function gtag(){dataLayer.push(arguments);}')
    expect(scriptContent).toContain('gtag(\'js\', new Date())')
    expect(scriptContent).toContain('gtag(\'config\', \'G-ANALYTICS123\')')
  })
})
