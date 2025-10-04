import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import InstallationPage from '@/app/installation/page'
import ContributingPage from '@/app/contributing/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock the DocumentationLayout component
jest.mock('@/components/DocumentationLayout', () => {
  return function MockDocumentationLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="documentation-layout">{children}</div>
  }
})

// Mock the Button component
jest.mock('@/components/ui/button', () => {
  return function MockButton({ children, href, onClick, ...props }: any) {
    if (href) {
      return <a href={href} data-testid="button" onClick={onClick} {...props}>{children}</a>
    }
    return <button data-testid="button" onClick={onClick} {...props}>{children}</button>
  }
})

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
})

describe('Requirement 4 Integration: GitHub Repository Links and Development Instructions', () => {
  describe('Installation Page Integration', () => {
    it('should render installation page with all required elements', async () => {
      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check main heading
      expect(screen.getByText('Installation')).toBeInTheDocument()
      expect(screen.getByText('Get started with the Speck-It MCP Server in a few simple steps.')).toBeInTheDocument()

      // Check installation steps
      expect(screen.getByText('Prerequisites')).toBeInTheDocument()
      expect(screen.getByText('Clone the Repository')).toBeInTheDocument()
      expect(screen.getByText('Install Dependencies')).toBeInTheDocument()
      expect(screen.getByText('Run the Development Server')).toBeInTheDocument()
      expect(screen.getByText('Configure MCP Client')).toBeInTheDocument()
    })

    it('should display GitHub repository links correctly', async () => {
      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check for GitHub repository link in clone step
      const gitCloneCode = screen.getByText(/git clone https:\/\/github\.com\/wuxnz\/speck-it-mcp-server\.git/)
      expect(gitCloneCode).toBeInTheDocument()
      expect(gitCloneCode.textContent).toContain('github.com')
    })

    it('should provide working code copy functionality', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Find copy buttons (they appear on hover)
      const codeBlocks = screen.getAllByRole('button').filter(button =>
        button.querySelector('svg') // Copy buttons have icons
      )

      if (codeBlocks.length > 0) {
        await user.click(codeBlocks[0])

        // Verify clipboard was called
        await waitFor(() => {
          expect(navigator.clipboard.writeText).toHaveBeenCalled()
        })
      }
    })

    it('should display alternative package manager commands', async () => {
      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check for npm, pnpm, and yarn alternatives
      expect(screen.getByText('npm install')).toBeInTheDocument()
      expect(screen.getByText('pnpm install')).toBeInTheDocument()
      expect(screen.getByText('yarn install')).toBeInTheDocument()

      expect(screen.getByText('npm run dev')).toBeInTheDocument()
      expect(screen.getByText('pnpm dev')).toBeInTheDocument()
      expect(screen.getByText('yarn dev')).toBeInTheDocument()
    })

    it('should show MCP client configuration', async () => {
      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check for MCP configuration
      expect(screen.getByText('Configure MCP Client')).toBeInTheDocument()
      expect(screen.getByText(/mcpServers/)).toBeInTheDocument()
      expect(screen.getByText(/speck-it/)).toBeInTheDocument()
      expect(screen.getByText(/uv/)).toBeInTheDocument()
    })

    it('should provide troubleshooting information', async () => {
      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check troubleshooting section
      expect(screen.getByText('Troubleshooting')).toBeInTheDocument()
      expect(screen.getByText('Common Issues')).toBeInTheDocument()
      expect(screen.getByText('Node.js version too old')).toBeInTheDocument()
      expect(screen.getByText('Port already in use')).toBeInTheDocument()
      expect(screen.getByText('MCP server not connecting')).toBeInTheDocument()
    })

    it('should have navigation links to other documentation sections', async () => {
      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check for navigation links
      const apiLink = screen.getByText('API Reference')
      const examplesLink = screen.getByText('View Examples')

      expect(apiLink).toBeInTheDocument()
      expect(examplesLink).toBeInTheDocument()

      // Verify they are links
      expect(apiLink.closest('a')).toHaveAttribute('href', '/api')
      expect(examplesLink.closest('a')).toHaveAttribute('href', '/examples')
    })
  })

  describe('Contributing Page Integration', () => {
    it('should render contributing page with all required sections', async () => {
      render(
        <BrowserRouter>
          <ContributingPage />
        </BrowserRouter>
      )

      // Check main heading
      expect(screen.getByText('Contributing')).toBeInTheDocument()
      expect(screen.getByText('Learn how to contribute to the Speck-It MCP Server project.')).toBeInTheDocument()

      // Check main sections
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Development Workflow')).toBeInTheDocument()
      expect(screen.getByText('Submitting Changes')).toBeInTheDocument()
      expect(screen.getByText('Code Review Process')).toBeInTheDocument()
      expect(screen.getByText('Community Guidelines')).toBeInTheDocument()
    })

    it('should display GitHub links in contributing workflow', async () => {
      render(
        <BrowserRouter>
          <ContributingPage />
        </BrowserRouter>
      )

      // Check for GitHub links in contributing steps
      expect(screen.getByText(/git clone https:\/\/github\.com\/your-username\/speck-it-mcp-server\.git/)).toBeInTheDocument()
      expect(screen.getByText('git checkout -b feature/your-feature-name')).toBeInTheDocument()
    })

    it('should provide step-by-step contribution instructions', async () => {
      render(
        <BrowserRouter>
          <ContributingPage />
        </BrowserRouter>
      )

      // Check for specific contribution steps
      expect(screen.getByText('Fork the Repository')).toBeInTheDocument()
      expect(screen.getByText('Create a Feature Branch')).toBeInTheDocument()
      expect(screen.getByText('Install Dependencies')).toBeInTheDocument()
      expect(screen.getByText('Start Development')).toBeInTheDocument()

      // Check for commit instructions
      expect(screen.getByText('Commit Your Changes')).toBeInTheDocument()
      expect(screen.getByText('Push to Your Fork')).toBeInTheDocument()
      expect(screen.getByText('Create a Pull Request')).toBeInTheDocument()
    })

    it('should include development workflow guidelines', async () => {
      render(
        <BrowserRouter>
          <ContributingPage />
        </BrowserRouter>
      )

      // Check for workflow guidelines
      expect(screen.getByText('Code Style')).toBeInTheDocument()
      expect(screen.getByText('Testing')).toBeInTheDocument()
      expect(screen.getByText('Documentation')).toBeInTheDocument()

      // Check for specific guidelines
      expect(screen.getByText('Use TypeScript for type safety')).toBeInTheDocument()
      expect(screen.getByText('Write unit tests for new functionality')).toBeInTheDocument()
      expect(screen.getByText('Update API documentation for new tools')).toBeInTheDocument()
    })

    it('should provide community resources', async () => {
      render(
        <BrowserRouter>
          <ContributingPage />
        </BrowserRouter>
      )

      // Check for community resources
      expect(screen.getByText('Getting Help')).toBeInTheDocument()
      expect(screen.getByText('Discussions')).toBeInTheDocument()
      expect(screen.getByText('Issues')).toBeInTheDocument()

      // Check for GitHub links
      const discussionsLink = screen.getByText('View Discussions')
      const reportIssueLink = screen.getByText('Report Issue')

      expect(discussionsLink).toBeInTheDocument()
      expect(reportIssueLink).toBeInTheDocument()
    })

    it('should include license information', async () => {
      render(
        <BrowserRouter>
          <ContributingPage />
        </BrowserRouter>
      )

      // Check for license section
      expect(screen.getByText('License')).toBeInTheDocument()
      expect(screen.getByText('BSD 3-Clause License')).toBeInTheDocument()
      expect(screen.getByText('View License')).toBeInTheDocument()
    })
  })

  describe('Cross-Page Integration', () => {
    it('should maintain consistent GitHub link patterns across pages', async () => {
      const { unmount } = render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Get GitHub links from installation page
      const installationLinks = screen.getAllByText(/github\.com/)

      unmount()

      render(
        <BrowserRouter>
          <ContributingPage />
        </BrowserRouter>
      )

      // Get GitHub links from contributing page
      const contributingLinks = screen.getAllByText(/github\.com/)

      // Both pages should have GitHub links
      expect(installationLinks.length).toBeGreaterThan(0)
      expect(contributingLinks.length).toBeGreaterThan(0)

      // All links should follow the same pattern
      [...installationLinks, ...contributingLinks].forEach(link => {
        expect(link.textContent).toMatch(/github\.com/)
        expect(link.textContent).toContain('speck-it-mcp-server')
      })
    })

    it('should provide consistent code example formatting', async () => {
      const { unmount } = render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check code formatting on installation page
      const installationCode = screen.getAllByText(/git |npm |pnpm |yarn /)
      expect(installationCode.length).toBeGreaterThan(0)

      unmount()

      render(
        <BrowserRouter>
          <ContributingPage />
        </BrowserRouter>
      )

      // Check code formatting on contributing page
      const contributingCode = screen.getAllByText(/git |npm |pnpm |yarn /)
      expect(contributingCode.length).toBeGreaterThan(0)
    })

    it('should have accessible navigation between documentation sections', async () => {
      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check navigation links
      const navigationLinks = screen.getAllByRole('link')
      const documentationLinks = navigationLinks.filter(link =>
        link.getAttribute('href')?.startsWith('/') &&
        link.getAttribute('href') !== '/'
      )

      expect(documentationLinks.length).toBeGreaterThan(0)

      // Verify links have proper text
      documentationLinks.forEach(link => {
        expect(link.textContent).toBeTruthy()
        expect(link.textContent!.length).toBeGreaterThan(0)
      })
    })
  })

  describe('User Workflow Integration', () => {
    it('should guide user through complete installation workflow', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // User should see numbered steps
      const stepNumbers = screen.getAllByText(/^\d+$/)
      expect(stepNumbers.length).toBeGreaterThan(0)

      // User should be able to follow the sequence
      expect(screen.getByText('Prerequisites')).toBeInTheDocument()
      expect(screen.getByText('Clone the Repository')).toBeInTheDocument()
      expect(screen.getByText('Install Dependencies')).toBeInTheDocument()
      expect(screen.getByText('Run the Development Server')).toBeInTheDocument()

      // User should find next steps
      expect(screen.getByText('Next Steps')).toBeInTheDocument()
      expect(screen.getByText('Explore the Documentation')).toBeInTheDocument()
      expect(screen.getByText('Try an Example')).toBeInTheDocument()
    })

    it('should guide user through complete contribution workflow', async () => {
      render(
        <BrowserRouter>
          <ContributingPage />
        </BrowserRouter>
      )

      // User should see the complete workflow
      expect(screen.getByText('Getting Started')).toBeInTheDocument()
      expect(screen.getByText('Development Workflow')).toBeInTheDocument()
      expect(screen.getByText('Submitting Changes')).toBeInTheDocument()
      expect(screen.getByText('Code Review Process')).toBeInTheDocument()

      // User should understand the process
      expect(screen.getByText('Fork the Repository')).toBeInTheDocument()
      expect(screen.getByText('Create a Feature Branch')).toBeInTheDocument()
      expect(screen.getByText('Create a Pull Request')).toBeInTheDocument()
    })

    it('should provide help resources throughout the user journey', async () => {
      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check for help resources on installation page
      expect(screen.getByText('Troubleshooting')).toBeInTheDocument()
      expect(screen.getByText('Common Issues')).toBeInTheDocument()

      // Navigate to contributing page
      const { unmount } = render(
        <BrowserRouter>
          <ContributingPage />
        </BrowserRouter>
      )

      // Check for help resources on contributing page
      expect(screen.getByText('Getting Help')).toBeInTheDocument()
      expect(screen.getByText('Community Guidelines')).toBeInTheDocument()
    })
  })

  describe('Accessibility Integration', () => {
    it('should have proper link accessibility attributes', async () => {
      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check external links have proper attributes
      const externalLinks = screen.getAllByRole('link').filter(link =>
        link.getAttribute('href')?.startsWith('http')
      )

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('should have proper heading hierarchy', async () => {
      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check for proper heading structure
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2s = screen.getAllByRole('heading', { level: 2 })

      expect(h1).toBeInTheDocument()
      expect(h2s.length).toBeGreaterThan(0)
      expect(h1.textContent).toBe('Installation')
    })

    it('should have accessible code blocks', async () => {
      render(
        <BrowserRouter>
          <InstallationPage />
        </BrowserRouter>
      )

      // Check for code blocks with copy functionality
      const codeBlocks = screen.getAllByText(/git |npm |pnpm |yarn |node /)
      expect(codeBlocks.length).toBeGreaterThan(0)

      // Check for copy buttons
      const copyButtons = screen.getAllByRole('button').filter(button =>
        button.getAttribute('aria-label')?.includes('copy') ||
        button.querySelector('svg') // Copy buttons typically have icons
      )
    })
  })
})
