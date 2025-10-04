/**
 * Integration test for Requirement 3:
 * "the site should be comprehensive documentation based that takes inspiration from the speck-it mcp server's 'ref/speck-it/README.md'"
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe('Requirement 3 Integration: Comprehensive Documentation', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    )
  }

  it('should provide access to installation documentation', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have installation link in navigation
      const installationLink = screen.getByRole('link', { name: /installation/i })
      expect(installationLink).toBeInTheDocument()
      
      // Should have installation content
      expect(screen.getByText(/get started/i)).toBeInTheDocument()
    })
  })

  it('should include contribution guidelines access', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have contributing link
      const contributingLink = screen.getByRole('link', { name: /contributing/i })
      expect(contributingLink).toBeInTheDocument()
      
      // Should have community section
      expect(screen.getByText(/community/i)).toBeInTheDocument()
    })
  })

  it('should provide API reference documentation', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have API link in navigation
      const apiLink = screen.getByRole('link', { name: /api/i })
      expect(apiLink).toBeInTheDocument()
      
      // Should have feature descriptions that relate to API
      expect(screen.getByText(/specification generation/i)).toBeInTheDocument()
      expect(screen.getByText(/task management/i)).toBeInTheDocument()
    })
  })

  it('should include user guides and examples', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have guides link
      const guidesLink = screen.getByRole('link', { name: /guides/i })
      expect(guidesLink).toBeInTheDocument()
      
      // Should have examples section
      expect(screen.getByText(/examples/i)).toBeInTheDocument()
    })
  })

  it('should provide GitHub repository access', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have GitHub link
      const githubLinks = screen.getAllByRole('link', { name: /github/i })
      expect(githubLinks.length).toBeGreaterThan(0)
      
      // Should link to external GitHub repository
      githubLinks.forEach(link => {
        expect(link).toHaveAttribute('href')
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })
  })

  it('should include quick start information', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have get started call-to-action
      const getStartedButton = screen.getByRole('link', { name: /get started/i })
      expect(getStartedButton).toBeInTheDocument()
    })
  })

  it('should display feature overview inspired by README', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have features section
      expect(screen.getByText(/features/i)).toBeInTheDocument()
      
      // Should include key features from README
      expect(screen.getByText(/specification generation/i)).toBeInTheDocument()
      expect(screen.getByText(/task management/i)).toBeInTheDocument()
      expect(screen.getByText(/team collaboration/i)).toBeInTheDocument()
    })
  })

  it('should provide comprehensive documentation structure', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have main navigation
      const navigation = screen.getByRole('navigation')
      expect(navigation).toBeInTheDocument()
      
      // Should have multiple documentation sections
      const navLinks = navigation.querySelectorAll('a')
      expect(navLinks.length).toBeGreaterThan(4)
      
      // Should have semantic structure
      expect(screen.getByRole('banner')).toBeInTheDocument() // header
      expect(screen.getByRole('main')).toBeInTheDocument() // main content
      expect(screen.getByRole('contentinfo')).toBeInTheDocument() // footer
    })
  })

  it('should support navigation between documentation sections', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have working navigation links
      const navLinks = screen.getAllByRole('link')
      expect(navLinks.length).toBeGreaterThan(0)
      
      // Should have internal navigation
      const internalLinks = navLinks.filter(link => 
        link.getAttribute('href')?.startsWith('/')
      )
      expect(internalLinks.length).toBeGreaterThan(0)
    })
  })

  it('should include development-related content', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have development-related links
      const links = screen.getAllByRole('link')
      const devLinks = links.filter(link => 
        link.textContent?.match(/development|code|github/i)
      )
      expect(devLinks.length).toBeGreaterThan(0)
    })
  })

  it('should provide accessible documentation structure', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have proper heading structure
      const headings = screen.getAllByRole('heading')
      expect(headings.length).toBeGreaterThan(0)
      
      // Should have skip navigation or similar accessibility features
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      
      // Should have proper ARIA labels
      const navigation = screen.getByRole('navigation')
      expect(navigation).toHaveAttribute('aria-label')
    })
  })

  it('should maintain consistent documentation experience', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have consistent styling
      const themedElements = document.querySelectorAll('[class*="bg-"], [class*="text-"]')
      expect(themedElements.length).toBeGreaterThan(0)
      
      // Should have consistent navigation
      const navigation = screen.getByRole('navigation')
      const navItems = navigation.querySelectorAll('a')
      expect(navItems.length).toBeGreaterThan(0)
      
      // Should have consistent footer
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
    })
  })
})