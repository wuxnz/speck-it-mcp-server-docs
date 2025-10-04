import ExamplesPage from '@/app/examples/page'
import { render, screen } from '@testing-library/react'

// Mock the DocumentationLayout component
jest.mock('@/components/DocumentationLayout', () => {
  return function MockDocumentationLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="documentation-layout">{children}</div>
  }
})

// Mock the Button component
jest.mock('@/components/ui/button', () => {
  return function MockButton({ children, ...props }: any) {
    return <button data-testid="button" {...props}>{children}</button>
  }
})

describe('ExamplesPage', () => {
  it('renders the main heading', () => {
    render(<ExamplesPage />)
    expect(screen.getByText('Examples')).toBeInTheDocument()
    expect(screen.getByText('Real-world examples showcasing Speck-It in action across different project types.')).toBeInTheDocument()
  })

  it('renders all example cards', () => {
    render(<ExamplesPage />)

    // Check for specific example titles
    expect(screen.getByText('Web Development Project')).toBeInTheDocument()
    expect(screen.getByText('CLI Tool Development')).toBeInTheDocument()
    expect(screen.getByText('API Service')).toBeInTheDocument()
    expect(screen.getByText('Mobile App Development')).toBeInTheDocument()
  })

  it('displays example descriptions', () => {
    render(<ExamplesPage />)

    expect(screen.getByText('Complete example of building a React application with Speck-It.')).toBeInTheDocument()
    expect(screen.getByText('Build a command-line tool using Speck-It for project management.')).toBeInTheDocument()
    expect(screen.getByText('Develop a REST API service with comprehensive Speck-It integration.')).toBeInTheDocument()
    expect(screen.getByText('Create a mobile application using React Native with Speck-It.')).toBeInTheDocument()
  })

  it('shows difficulty badges', () => {
    render(<ExamplesPage />)

    const beginnerBadges = screen.getAllByText('Beginner')
    const intermediateBadges = screen.getAllByText('Intermediate')
    const advancedBadges = screen.getAllByText('Advanced')

    expect(beginnerBadges.length).toBeGreaterThan(0)
    expect(intermediateBadges.length).toBeGreaterThan(0)
    expect(advancedBadges.length).toBeGreaterThan(0)
  })

  it('displays technology tags', () => {
    render(<ExamplesPage />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Web')).toBeInTheDocument()
    expect(screen.getByText('CLI')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
    expect(screen.getByText('API')).toBeInTheDocument()
    expect(screen.getByText('Database')).toBeInTheDocument()
    expect(screen.getByText('Mobile')).toBeInTheDocument()
    expect(screen.getByText('React Native')).toBeInTheDocument()
  })

  it('renders setup steps for examples', () => {
    render(<ExamplesPage />)

    expect(screen.getByText('Setup Steps:')).toBeInTheDocument()
    expect(screen.getByText('Initialize project with constitution')).toBeInTheDocument()
    expect(screen.getByText('Create feature for user authentication')).toBeInTheDocument()
    expect(screen.getByText('Generate API integration tasks')).toBeInTheDocument()
    expect(screen.getByText('Implement responsive design')).toBeInTheDocument()
  })

  it('displays code examples', () => {
    render(<ExamplesPage />)

    expect(screen.getByText('Example Constitution:')).toBeInTheDocument()
    expect(screen.getByText('"constitution"')).toBeInTheDocument()
    expect(screen.getByText('"features"')).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(<ExamplesPage />)

    const viewCodeButtons = screen.getAllByText('View Code')
    const liveDemoButtons = screen.getAllByText('Live Demo')

    expect(viewCodeButtons.length).toBe(4) // All examples should have View Code
    expect(liveDemoButtons.length).toBe(2) // Only some examples have Live Demo
  })

  it('renders quick start examples section', () => {
    render(<ExamplesPage />)

    expect(screen.getByText('Quick Start Examples')).toBeInTheDocument()
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByText('Template Generator')).toBeInTheDocument()
    expect(screen.getByText('The simplest example to get you started with Speck-It.')).toBeInTheDocument()
    expect(screen.getByText('Generate project templates for different frameworks and use cases.')).toBeInTheDocument()
  })

  it('renders community examples section', () => {
    render(<ExamplesPage />)

    expect(screen.getByText('Community Examples')).toBeInTheDocument()
    expect(screen.getByText('E-commerce Platform')).toBeInTheDocument()
    expect(screen.getByText('IoT Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Data Pipeline')).toBeInTheDocument()
    expect(screen.getByText('Full-stack e-commerce solution with Speck-It.')).toBeInTheDocument()
    expect(screen.getByText('Real-time IoT monitoring dashboard.')).toBeInTheDocument()
    expect(screen.getByText('ETL pipeline with Speck-It orchestration.')).toBeInTheDocument()
  })

  it('displays community example metadata', () => {
    render(<ExamplesPage />)

    expect(screen.getByText('by @community-user')).toBeInTheDocument()
    expect(screen.getByText('by @dev-explorer')).toBeInTheDocument()
    expect(screen.getByText('by @data-engineer')).toBeInTheDocument()
    expect(screen.getByText('2 days ago')).toBeInTheDocument()
    expect(screen.getByText('1 week ago')).toBeInTheDocument()
    expect(screen.getByText('2 weeks ago')).toBeInTheDocument()
  })

  it('renders submit example section', () => {
    render(<ExamplesPage />)

    expect(screen.getByText('Submit Your Example')).toBeInTheDocument()
    expect(screen.getByText('Have you built something amazing with Speck-It? Share your example with the community!')).toBeInTheDocument()
    expect(screen.getByText('What to Include:')).toBeInTheDocument()
    expect(screen.getByText('Benefits:')).toBeInTheDocument()
    expect(screen.getByText('Submit Your Example')).toBeInTheDocument()
  })

  it('displays submission guidelines', () => {
    render(<ExamplesPage />)

    expect(screen.getByText('Clear project description')).toBeInTheDocument()
    expect(screen.getByText('Step-by-step setup instructions')).toBeInTheDocument()
    expect(screen.getByText('Code examples and configurations')).toBeInTheDocument()
    expect(screen.getByText('Live demo or screenshots')).toBeInTheDocument()

    expect(screen.getByText('Showcase your work to the community')).toBeInTheDocument()
    expect(screen.getByText('Help others learn Speck-It')).toBeInTheDocument()
    expect(screen.getByText('Get feedback and improvement suggestions')).toBeInTheDocument()
    expect(screen.getByText('Contribute to the ecosystem')).toBeInTheDocument()
  })

  it('has proper section structure', () => {
    render(<ExamplesPage />)

    // Check for section headers
    expect(screen.getByText('Featured Examples')).toBeInTheDocument()
    expect(screen.getByText('Additional Resources')).toBeInTheDocument()
    expect(screen.getByText('Community Examples')).toBeInTheDocument()

    // Check for section descriptions
    expect(screen.getByText('Explore these comprehensive examples to learn how Speck-It can be applied to various projects.')).toBeInTheDocument()
    expect(screen.getByText('Discover examples created by the Speck-It community. These projects showcase innovative ways to use Speck-IT in real-world scenarios.')).toBeInTheDocument()
  })
})
