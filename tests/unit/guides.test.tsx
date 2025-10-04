import GuidesPage from '@/app/guide/page';
import { render, screen } from '@testing-library/react';

// Mock the DocumentationLayout component
jest.mock('@/components/DocumentationLayout', () => {
  return function MockDocumentationLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="documentation-layout">{children}</div>;
  };
});

// Mock the Button component
jest.mock('@/components/ui/button', () => {
  return function MockButton({ children, ...props }: any) {
    return (
      <button data-testid="button" {...props}>
        {children}
      </button>
    );
  };
});

describe('GuidesPage', () => {
  it('renders the main heading', () => {
    render(<GuidesPage />);
    expect(screen.getByText('Guides')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Comprehensive guides to help you master Speck-It and build amazing projects.'
      )
    ).toBeInTheDocument();
  });

  it('renders all guide sections', () => {
    render(<GuidesPage />);

    // Check for main section titles
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Advanced Usage')).toBeInTheDocument();
    expect(screen.getByText('Best Practices')).toBeInTheDocument();
    expect(screen.getByText('Integration Examples')).toBeInTheDocument();
  });

  it('renders guide cards with correct content', () => {
    render(<GuidesPage />);

    // Check for specific guide titles
    expect(screen.getByText('Your First Feature')).toBeInTheDocument();
    expect(screen.getByText('Understanding the Workflow')).toBeInTheDocument();
    expect(screen.getByText('Custom Constitution Templates')).toBeInTheDocument();
    expect(screen.getByText('Multi-Feature Projects')).toBeInTheDocument();
  });

  it('displays difficulty badges', () => {
    render(<GuidesPage />);

    // Check for difficulty badges
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('shows duration information', () => {
    render(<GuidesPage />);

    // Check for duration indicators
    expect(screen.getByText('15 min')).toBeInTheDocument();
    expect(screen.getByText('10 min')).toBeInTheDocument();
    expect(screen.getByText('20 min')).toBeInTheDocument();
  });

  it('renders additional resources section', () => {
    render(<GuidesPage />);

    expect(screen.getByText('Additional Resources')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Examples')).toBeInTheDocument();
  });

  it('renders video tutorials section', () => {
    render(<GuidesPage />);

    expect(screen.getByText('Video Tutorials')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Speck-It')).toBeInTheDocument();
    expect(screen.getByText('Advanced Features')).toBeInTheDocument();
  });

  it('renders start guide buttons', () => {
    render(<GuidesPage />);

    const startGuideButtons = screen.getAllByText('Start Guide');
    expect(startGuideButtons.length).toBeGreaterThan(0);

    startGuideButtons.forEach((button) => {
      expect(button).toBeInTheDocument();
      expect(button.closest('button')).toHaveAttribute('data-testid', 'button');
    });
  });

  it('has correct section descriptions', () => {
    render(<GuidesPage />);

    expect(
      screen.getByText('Learn the basics of using Speck-It for your projects.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Master advanced Speck-It features and techniques.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Learn proven patterns and practices for Speck-It projects.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Learn how to integrate Speck-It with other tools and workflows.')
    ).toBeInTheDocument();
  });

  it('displays guide content items', () => {
    render(<GuidesPage />);

    // Check for specific guide content items
    expect(screen.getByText('Set up your project constitution')).toBeInTheDocument();
    expect(screen.getByText('Register your feature root')).toBeInTheDocument();
    expect(screen.getByText('Generate a specification')).toBeInTheDocument();
    expect(screen.getByText('Create an implementation plan')).toBeInTheDocument();
  });
});
