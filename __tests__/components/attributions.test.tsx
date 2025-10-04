import { render, screen } from '@testing-library/react'
import { Attributions } from '@/components/attributions'

describe('Attributions', () => {
  beforeEach(() => {
    // Clear any previous test state
    jest.clearAllMocks()
  })

  it('renders the attributions page with title and description', () => {
    render(<Attributions />)
    
    // Check main title
    expect(screen.getByText('Asset Attributions')).toBeInTheDocument()
    
    // Check description
    expect(screen.getByText(/This page lists all the assets used in the Splash Screen App/)).toBeInTheDocument()
  })

  it('displays attribution categories', () => {
    render(<Attributions />)
    
    // Check category titles
    expect(screen.getByText('Background Images')).toBeInTheDocument()
    expect(screen.getByText('Music Files')).toBeInTheDocument()
    expect(screen.getByText('Icons & UI Assets')).toBeInTheDocument()
  })

  it('shows sample asset entries', () => {
    render(<Attributions />)
    
    // Check for sample background images
    expect(screen.getByText('Beach-Summer.jpg')).toBeInTheDocument()
    expect(screen.getByText('Beach-Summer2.jpg')).toBeInTheDocument()
    expect(screen.getByText('City-Spring.jpg')).toBeInTheDocument()
    
    // Check for music entries
    expect(screen.getByText('Ambient Track 1')).toBeInTheDocument()
    expect(screen.getByText('Ambient Track 2')).toBeInTheDocument()
    
    // Check for UI assets
    expect(screen.getByText('PWA Icons')).toBeInTheDocument()
    expect(screen.getByText('UI Components')).toBeInTheDocument()
  })

  it('displays license badges with correct variants', () => {
    render(<Attributions />)
    
    // Check for license badges
    const licenseBadges = screen.getAllByText(/To be determined|MIT License|Project specific/)
    expect(licenseBadges.length).toBeGreaterThan(0)
  })

  it('shows external links for sources with URLs', () => {
    render(<Attributions />)
    
    // Check for external link to shadcn/ui
    const externalLink = screen.getByRole('link', { name: /shadcn\/ui/ })
    expect(externalLink).toBeInTheDocument()
    expect(externalLink).toHaveAttribute('href', 'https://ui.shadcn.com/')
    expect(externalLink).toHaveAttribute('target', '_blank')
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('displays incomplete status warning', () => {
    render(<Attributions />)
    
    // Check for incomplete status warning
    expect(screen.getByText('Attribution Status: Incomplete')).toBeInTheDocument()
    expect(screen.getByText(/This attribution list is currently incomplete/)).toBeInTheDocument()
  })

  it('shows completion instructions', () => {
    render(<Attributions />)
    
    // Check for completion instructions
    expect(screen.getByText('To complete the attributions:')).toBeInTheDocument()
    expect(screen.getByText(/Use reverse image search to find original image sources/)).toBeInTheDocument()
    expect(screen.getByText(/Check music file metadata and common royalty-free sources/)).toBeInTheDocument()
    expect(screen.getByText(/Verify all licenses allow commercial use and distribution/)).toBeInTheDocument()
  })

  it('displays contact information for attribution issues', () => {
    render(<Attributions />)
    
    // Check for contact information
    expect(screen.getByText(/If you believe any asset is used incorrectly/)).toBeInTheDocument()
    expect(screen.getByText(/please contact the project maintainer/)).toBeInTheDocument()
  })

  it('shows creator and source information for each asset', () => {
    render(<Attributions />)
    
    // Check that creator and source labels are present
    const creatorLabels = screen.getAllByText(/Creator:/)
    const sourceLabels = screen.getAllByText(/Source:/)
    
    expect(creatorLabels.length).toBeGreaterThan(0)
    expect(sourceLabels.length).toBeGreaterThan(0)
  })

  it('displays asset descriptions', () => {
    render(<Attributions />)
    
    // Check for sample descriptions
    expect(screen.getByText('Sunny beach scene with clear blue water')).toBeInTheDocument()
    expect(screen.getByText('Tropical beach with palm trees')).toBeInTheDocument()
    expect(screen.getByText('Urban cityscape in spring')).toBeInTheDocument()
    expect(screen.getByText('Relaxing ambient music track')).toBeInTheDocument()
  })

  it('renders with consistent styling structure', () => {
    render(<Attributions />)
    
    // Check that the component has proper structure with main title
    expect(screen.getByText('Asset Attributions')).toBeInTheDocument()
    
    // Check that category sections are properly structured
    expect(screen.getByText('Background Images')).toBeInTheDocument()
    expect(screen.getByText('Music Files')).toBeInTheDocument()
    expect(screen.getByText('Icons & UI Assets')).toBeInTheDocument()
  })

  it('handles missing data gracefully', () => {
    render(<Attributions />)
    
    // The component should render even with placeholder data
    // and show appropriate "Research needed" text
    expect(screen.getAllByText('Research needed').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Unknown').length).toBeGreaterThan(0)
    expect(screen.getAllByText('To be determined').length).toBeGreaterThan(0)
  })
})
