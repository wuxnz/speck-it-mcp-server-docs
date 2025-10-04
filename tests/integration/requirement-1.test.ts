/**
 * Integration test for Requirement 1:
 * "a fully featured documentation and release site for the 'ref/speck-it' mcp server"
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '@/app/page'

// Mock Next.js router for integration tests
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

describe('Requirement 1 Integration: Documentation Site', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    )
  }

  it('should load the documentation site successfully', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /speck-it/i })).toBeInTheDocument()
    })
  })

  it('should navigate between documentation sections', async () => {
    renderWithRouter(<Home />)
    
    // Wait for navigation to load
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    // Click on installation link
    const installationLink = screen.getByRole('link', { name: /installation/i })
    fireEvent.click(installationLink)

    // Should navigate to installation section
    await waitFor(() => {
      expect(screen.getByText(/install/i)).toBeInTheDocument()
    })
  })

  it('should display GitHub repository link correctly', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      const githubLink = screen.getByRole('link', { name: /github/i })
      expect(githubLink).toBeInTheDocument()
      expect(githubLink).toHaveAttribute('href', expect.stringContaining('github.com'))
    })
  })

  it('should show installation instructions with code examples', async () => {
    renderWithRouter(<Home />)
    
    // Navigate to installation section
    const installationLink = screen.getByRole('link', { name: /installation/i })
    fireEvent.click(installationLink)

    await waitFor(() => {
      // Should have code blocks for installation commands
      expect(screen.getByText(/npm install/i)).toBeInTheDocument()
      expect(screen.getByText(/pnpm install/i)).toBeInTheDocument()
    })
  })

  it('should display contribution guidelines section', async () => {
    renderWithRouter(<Home />)
    
    // Navigate to contributing section
    const contributingLink = screen.getByRole('link', { name: /contributing/i })
    fireEvent.click(contributingLink)

    await waitFor(() => {
      expect(screen.getByText(/how to contribute/i)).toBeInTheDocument()
      expect(screen.getByText(/pull request/i)).toBeInTheDocument()
    })
  })

  it('should show API reference documentation', async () => {
    renderWithRouter(<Home />)
    
    // Navigate to API section
    const apiLink = screen.getByRole('link', { name: /api/i })
    fireEvent.click(apiLink)

    await waitFor(() => {
      expect(screen.getByText(/api reference/i)).toBeInTheDocument()
      expect(screen.getByText(/endpoints/i)).toBeInTheDocument()
    })
  })

  it('should provide user guides and examples', async () => {
    renderWithRouter(<Home />)
    
    // Navigate to guides section
    const guidesLink = screen.getByRole('link', { name: /guides?/i })
    fireEvent.click(guidesLink)

    await waitFor(() => {
      expect(screen.getByText(/getting started/i)).toBeInTheDocument()
      expect(screen.getByText(/examples/i)).toBeInTheDocument()
    })
  })

  it('should be responsive and accessible', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Check for proper semantic HTML structure
      expect(screen.getByRole('banner')).toBeInTheDocument() // header
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('contentinfo')).toBeInTheDocument() // footer
    })

    // Check for accessibility attributes
    const mainNavigation = screen.getByRole('navigation')
    expect(mainNavigation).toHaveAttribute('aria-label')
  })
})