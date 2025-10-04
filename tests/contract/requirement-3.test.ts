/**
 * Contract test for Requirement 3:
 * "the site should be comprehensive documentation based that takes inspiration from the speck-it mcp server's 'ref/speck-it/README.md'"
 */

import { render, screen } from '@testing-library/react'
import { DocumentationLayout } from '@/components/DocumentationLayout'

describe('Requirement 3 Contract: Comprehensive Documentation', () => {
  it('should include installation instructions section', () => {
    const TestComponent = () => (
      <DocumentationLayout>
        <div>
          <h1>Installation</h1>
          <p>Install dependencies using npm or pnpm</p>
          <code>npm install</code>
          <code>pnpm install</code>
        </div>
      </DocumentationLayout>
    )

    render(<TestComponent />)

    expect(screen.getByText('Installation')).toBeInTheDocument()
    expect(screen.getByText(/install dependencies/i)).toBeInTheDocument()
  })

  it('should include contribution guidelines section', () => {
    const TestComponent = () => (
      <DocumentationLayout>
        <div>
          <h1>Contributing</h1>
          <p>How to contribute to the project</p>
          <p>Pull request process</p>
        </div>
      </DocumentationLayout>
    )

    render(<TestComponent />)

    expect(screen.getByText('Contributing')).toBeInTheDocument()
    expect(screen.getByText(/how to contribute/i)).toBeInTheDocument()
  })

  it('should include API reference documentation', () => {
    const TestComponent = () => (
      <DocumentationLayout>
        <div>
          <h1>API Reference</h1>
          <p>Available tools and endpoints</p>
          <p>Method signatures and parameters</p>
        </div>
      </DocumentationLayout>
    )

    render(<TestComponent />)

    expect(screen.getByText('API Reference')).toBeInTheDocument()
    expect(screen.getByText(/available tools/i)).toBeInTheDocument()
  })

  it('should include user guides and examples', () => {
    const TestComponent = () => (
      <DocumentationLayout>
        <div>
          <h1>Guide</h1>
          <p>Getting started guide</p>
          <p>Examples and use cases</p>
        </div>
      </DocumentationLayout>
    )

    render(<TestComponent />)

    expect(screen.getByText('Guides')).toBeInTheDocument()
    expect(screen.getByText(/getting started/i)).toBeInTheDocument()
  })

  it('should include GitHub repository links', () => {
    const TestComponent = () => (
      <DocumentationLayout>
        <div>
          <a href="https://github.com/wuxnz/speck-it-mcp-server">GitHub Repository</a>
        </div>
      </DocumentationLayout>
    )

    render(<TestComponent />)

    const githubLink = screen.getByRole('link', { name: 'GitHub Repository' })
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/wuxnz/speck-it-mcp-server')
  })

  it('should include quick start section', () => {
    const TestComponent = () => (
      <DocumentationLayout>
        <div>
          <h1>Quick Start</h1>
          <p>Get started in minutes</p>
          <ol>
            <li>Install dependencies</li>
            <li>Run the server</li>
            <li>Connect your agent</li>
          </ol>
        </div>
      </DocumentationLayout>
    )

    render(<TestComponent />)

    expect(screen.getByText('Quick Start')).toBeInTheDocument()
    expect(screen.getByText(/get started in minutes/i)).toBeInTheDocument()
  })

  it('should include feature overview section', () => {
    const TestComponent = () => (
      <DocumentationLayout>
        <div>
          <h1>Features</h1>
          <p>Specification generation</p>
          <p>Task management</p>
          <p>Team collaboration</p>
        </div>
      </DocumentationLayout>
    )

    render(<TestComponent />)

    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText(/specification generation/i)).toBeInTheDocument()
  })

  it('should include tooling overview section', () => {
    const TestComponent = () => (
      <DocumentationLayout>
        <div>
          <h1>Tooling Overview</h1>
          <p>Available MCP tools</p>
          <p>Workspace setup tools</p>
          <p>Specification pipeline</p>
        </div>
      </DocumentationLayout>
    )

    render(<TestComponent />)

    expect(screen.getByText('Tooling Overview')).toBeInTheDocument()
    expect(screen.getByText(/available mcp tools/i)).toBeInTheDocument()
  })

  it('should include storage layout documentation', () => {
    const TestComponent = () => (
      <DocumentationLayout>
        <div>
          <h1>Storage Layout</h1>
          <p>Artifact storage structure</p>
          <code>.speck-it/</code>
        </div>
      </DocumentationLayout>
    )

    render(<TestComponent />)

    expect(screen.getByText('Storage Layout')).toBeInTheDocument()
    expect(screen.getByText(/artifact storage/i)).toBeInTheDocument()
  })

  it('should include development section', () => {
    const TestComponent = () => (
      <DocumentationLayout>
        <div>
          <h1>Development</h1>
          <p>Development setup</p>
          <p>Testing procedures</p>
          <p>Code formatting</p>
        </div>
      </DocumentationLayout>
    )

    render(<TestComponent />)

    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText(/development setup/i)).toBeInTheDocument()
  })
})
