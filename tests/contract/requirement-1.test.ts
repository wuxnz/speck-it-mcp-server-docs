/**
 * Contract test for Requirement 1:
 * "a fully featured documentation and release site for the 'ref/speck-it' mcp server"
 */

import { render, screen } from '@testing-library/react'
import { Home } from '@/app/page'

describe('Requirement 1 Contract: Documentation Site', () => {
  it('should render the main documentation site structure', () => {
    render(<Home />)
    
    // Should have main heading for the documentation site
    expect(screen.getByRole('heading', { name: /speck-it/i })).toBeInTheDocument()
  })

  it('should display documentation content sections', () => {
    render(<Home />)
    
    // Should have navigation to different sections
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    
    // Should have main content area
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should include links to documentation resources', () => {
    render(<Home />)
    
    // Should have link to GitHub repository
    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href')
  })

  it('should provide access to installation instructions', () => {
    render(<Home />)
    
    // Should have installation section
    expect(screen.getByText(/installation/i)).toBeInTheDocument()
  })

  it('should include contribution guidelines', () => {
    render(<Home />)
    
    // Should have contributing section
    expect(screen.getByText(/contributing/i)).toBeInTheDocument()
  })

  it('should display API reference information', () => {
    render(<Home />)
    
    // Should have API reference section
    expect(screen.getByText(/api/i)).toBeInTheDocument()
  })

  it('should provide guides for users', () => {
    render(<Home />)
    
    // Should have guides section
    expect(screen.getByText(/guides?/i)).toBeInTheDocument()
  })
})