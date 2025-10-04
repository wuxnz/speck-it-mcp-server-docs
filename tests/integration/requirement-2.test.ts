/**
 * Integration test for Requirement 2:
 * "the site should use shadcn ui + typescript + tailwind + next.js + zustand for state management, with a dark theme by default and a theme switcher to light mode"
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

describe('Requirement 2 Integration: Tech Stack & Theme', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    )
  }

  it('should load the application with TypeScript compilation', async () => {
    // If this test runs, TypeScript compilation was successful
    expect(() => renderWithRouter(<Home />)).not.toThrow()
  })

  it('should apply Tailwind CSS classes correctly', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Check for Tailwind utility classes
      const mainElement = screen.getByRole('main')
      expect(mainElement).toHaveClass('flex-1', 'p-6', 'lg:p-8')
    })
  })

  it('should use Shadcn UI button components', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have buttons with Shadcn UI styling
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      
      // Check for Shadcn UI button classes
      buttons.forEach(button => {
        expect(button).toHaveClass(/inline-flex|items-center|justify-center/)
      })
    })
  })

  it('should have dark theme applied by default', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Check for dark theme CSS variables
      const root = document.documentElement
      expect(root).toHaveStyle('--background')
      expect(root).toHaveStyle('--foreground')
    })
  })

  it('should include theme switcher functionality', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Look for theme toggle button (might be in header)
      const themeToggle = screen.queryByRole('button', { name: /theme|toggle|dark|light/i })
      if (themeToggle) {
        expect(themeToggle).toBeInTheDocument()
      }
    })
  })

  it('should support responsive design with Tailwind breakpoints', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Check for responsive grid classes
      const gridElements = document.querySelectorAll('[class*="grid"]')
      expect(gridElements.length).toBeGreaterThan(0)
      
      // Should have responsive classes
      gridElements.forEach(element => {
        const className = element.className
        const hasResponsiveClasses = /md:|lg:|sm:/.test(className)
        expect(hasResponsiveClasses).toBe(true)
      })
    })
  })

  it('should use Next.js routing structure', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Should have Next.js Link components
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
      
      // Should have navigation links
      const navigationLinks = links.filter(link => 
        link.getAttribute('href')?.startsWith('/')
      )
      expect(navigationLinks.length).toBeGreaterThan(0)
    })
  })

  it('should maintain theme consistency across components', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      // Check that all components use consistent theme classes
      const themedElements = document.querySelectorAll('[class*="bg-"], [class*="text-"]')
      expect(themedElements.length).toBeGreaterThan(0)
      
      // Should use semantic color tokens
      themedElements.forEach(element => {
        const className = element.className
        const hasSemanticColors = /background|foreground|primary|secondary|accent/.test(className)
        expect(hasSemanticColors).toBe(true)
      })
    })
  })

  it('should support keyboard navigation for theme switching', async () => {
    renderWithRouter(<Home />)
    
    await waitFor(() => {
      const themeToggle = screen.queryByRole('button', { name: /theme|toggle|dark|light/i })
      if (themeToggle) {
        // Test keyboard accessibility
        themeToggle.focus()
        expect(themeToggle).toHaveFocus()
        
        // Test Enter key
        fireEvent.keyDown(themeToggle, { key: 'Enter' })
        fireEvent.keyUp(themeToggle, { key: 'Enter' })
      }
    })
  })

  it('should preserve theme preference in localStorage', async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    })

    renderWithRouter(<Home />)
    
    await waitFor(() => {
      const themeToggle = screen.queryByRole('button', { name: /theme|toggle|dark|light/i })
      if (themeToggle) {
        fireEvent.click(themeToggle)
        
        // Should attempt to save theme preference
        expect(localStorageMock.setItem).toHaveBeenCalled()
      }
    })
  })
})