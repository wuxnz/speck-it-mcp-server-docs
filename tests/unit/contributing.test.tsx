import ContributingPage from '@/app/contributing/page';
import { render, screen } from '@testing-library/react';

// Mock the DocumentationLayout component
jest.mock('@/components/DocumentationLayout', () => {
  return function MockDocumentationLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="documentation-layout">{children}</div>;
  };
});

// Mock the Button component
jest.mock('@/components/ui/button', () => {
  return function MockButton({ children, href, ...props }: any) {
    if (href) {
      return (
        <a href={href} data-testid="button" {...props}>
          {children}
        </a>
      );
    }
    return (
      <button data-testid="button" {...props}>
        {children}
      </button>
    );
  };
});

describe('ContributingPage', () => {
  describe('Page Structure', () => {
    it('renders the main heading and description', () => {
      render(<ContributingPage />);

      expect(screen.getByText('Contributing')).toBeInTheDocument();
      expect(
        screen.getByText('Learn how to contribute to the Speck-It MCP Server project.')
      ).toBeInTheDocument();
    });

    it('renders all main sections', () => {
      render(<ContributingPage />);

      const expectedSections = [
        'Getting Started',
        'Development Workflow',
        'Submitting Changes',
        'Code Review Process',
        'Community Guidelines',
      ];

      expectedSections.forEach((section) => {
        expect(screen.getByText(section)).toBeInTheDocument();
      });
    });
  });

  describe('Getting Started Section', () => {
    it('displays all getting started steps', () => {
      render(<ContributingPage />);

      const expectedSteps = [
        'Fork the Repository',
        'Create a Feature Branch',
        'Install Dependencies',
        'Start Development',
      ];

      expectedSteps.forEach((step) => {
        expect(screen.getByText(step)).toBeInTheDocument();
      });
    });

    it('shows GitHub repository links', () => {
      render(<ContributingPage />);

      const gitCloneCode = screen.getByText(
        /git clone https:\/\/github\.com\/your-username\/speck-it-mcp-server\.git/
      );
      expect(gitCloneCode).toBeInTheDocument();
      expect(gitCloneCode.textContent).toContain('github.com');
    });

    it('displays git commands for contribution workflow', () => {
      render(<ContributingPage />);

      expect(screen.getByText('git checkout -b feature/your-feature-name')).toBeInTheDocument();
      expect(screen.getByText('npm install')).toBeInTheDocument();
      expect(screen.getByText('npm run dev')).toBeInTheDocument();
    });

    it('provides clear descriptions for each step', () => {
      render(<ContributingPage />);

      expect(
        screen.getByText('Fork the repository on GitHub and clone your fork locally.')
      ).toBeInTheDocument();
      expect(screen.getByText('Create a new branch for your contribution.')).toBeInTheDocument();
      expect(
        screen.getByText('Install the required dependencies for development.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Run the development server to test your changes.')
      ).toBeInTheDocument();
    });
  });

  describe('Development Workflow Section', () => {
    it('displays workflow guidelines', () => {
      render(<ContributingPage />);

      const expectedGuidelines = ['Code Style', 'Testing', 'Documentation'];

      expectedGuidelines.forEach((guideline) => {
        expect(screen.getByText(guideline)).toBeInTheDocument();
      });
    });

    it('shows code style guidelines', () => {
      render(<ContributingPage />);

      expect(screen.getByText('Use TypeScript for type safety')).toBeInTheDocument();
      expect(screen.getByText('Follow the existing component structure')).toBeInTheDocument();
      expect(screen.getByText('Write descriptive commit messages')).toBeInTheDocument();
      expect(screen.getByText('Include proper documentation')).toBeInTheDocument();
    });

    it('shows testing guidelines', () => {
      render(<ContributingPage />);

      expect(screen.getByText('Write unit tests for new functionality')).toBeInTheDocument();
      expect(screen.getByText('Update integration tests when needed')).toBeInTheDocument();
      expect(screen.getByText('Run the full test suite before submitting')).toBeInTheDocument();
      expect(screen.getByText('Ensure all tests pass')).toBeInTheDocument();
    });

    it('shows documentation guidelines', () => {
      render(<ContributingPage />);

      expect(screen.getByText('Update API documentation for new tools')).toBeInTheDocument();
      expect(screen.getByText('Add examples for new features')).toBeInTheDocument();
      expect(screen.getByText('Update the README if needed')).toBeInTheDocument();
      expect(screen.getByText('Document any breaking changes')).toBeInTheDocument();
    });
  });

  describe('Submitting Changes Section', () => {
    it('displays submission process steps', () => {
      render(<ContributingPage />);

      const expectedSteps = ['Commit Your Changes', 'Push to Your Fork', 'Create a Pull Request'];

      expectedSteps.forEach((step) => {
        expect(screen.getByText(step)).toBeInTheDocument();
      });
    });

    it('shows git commands for submission', () => {
      render(<ContributingPage />);

      expect(
        screen.getByText('git commit -m "feat: add new feature description"')
      ).toBeInTheDocument();
      expect(screen.getByText('git push origin feature/your-feature-name')).toBeInTheDocument();
    });

    it('provides pull request guidelines', () => {
      render(<ContributingPage />);

      expect(screen.getByText('Provide a clear title and description')).toBeInTheDocument();
      expect(screen.getByText('Link any relevant issues')).toBeInTheDocument();
      expect(screen.getByText('Include screenshots if applicable')).toBeInTheDocument();
      expect(screen.getByText('Request review from maintainers')).toBeInTheDocument();
    });
  });

  describe('Code Review Process Section', () => {
    it('displays review process steps', () => {
      render(<ContributingPage />);

      expect(
        screen.getByText('Automated checks run (linting, formatting, tests)')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Maintainers review your code for quality and correctness')
      ).toBeInTheDocument();
      expect(screen.getByText('Feedback is provided for any required changes')).toBeInTheDocument();
      expect(
        screen.getByText('Once approved, your PR is merged into the main branch')
      ).toBeInTheDocument();
    });

    it('shows numbered review steps', () => {
      render(<ContributingPage />);

      const stepNumbers = screen.getAllByText(/^\d+$/);
      const reviewStepNumbers = stepNumbers.filter(
        (num) =>
          num.closest('div')?.textContent?.includes('Automated checks') ||
          num.closest('div')?.textContent?.includes('Maintainers review')
      );

      expect(reviewStepNumbers.length).toBe(4);
    });
  });

  describe('Community Guidelines Section', () => {
    it('displays community guidelines', () => {
      render(<ContributingPage />);

      const expectedGuidelines = [
        'Be respectful and inclusive in all interactions',
        'Provide constructive feedback and suggestions',
        'Help others who are learning or struggling',
        'Follow the code of conduct',
        'Focus on what is best for the community',
      ];

      expectedGuidelines.forEach((guideline) => {
        expect(screen.getByText(guideline)).toBeInTheDocument();
      });
    });

    it('shows numbered guideline steps', () => {
      render(<ContributingPage />);

      const stepNumbers = screen.getAllByText(/^\d+$/);
      const communityStepNumbers = stepNumbers.filter((num) =>
        num.closest('div')?.textContent?.includes('Be respectful')
      );

      expect(communityStepNumbers.length).toBe(5);
    });
  });

  describe('Getting Help Section', () => {
    it('displays help resources', () => {
      render(<ContributingPage />);

      expect(screen.getByText('Getting Help')).toBeInTheDocument();
      expect(screen.getByText('Discussions')).toBeInTheDocument();
      expect(screen.getByText('Issues')).toBeInTheDocument();
    });

    it('provides GitHub links for help', () => {
      render(<ContributingPage />);

      const discussionsLink = screen.getByText('View Discussions');
      const reportIssueLink = screen.getByText('Report Issue');

      expect(discussionsLink).toBeInTheDocument();
      expect(reportIssueLink).toBeInTheDocument();

      expect(discussionsLink.closest('a')).toHaveAttribute(
        'href',
        'https://github.com/wuxnz/speck-it-mcp-server/discussions'
      );
      expect(reportIssueLink.closest('a')).toHaveAttribute(
        'href',
        'https://github.com/wuxnz/speck-it-mcp-server/issues'
      );
    });

    it('shows help descriptions', () => {
      render(<ContributingPage />);

      expect(
        screen.getByText('Join our GitHub Discussions to ask questions and share ideas.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Report bugs or request features through GitHub Issues.')
      ).toBeInTheDocument();
    });
  });

  describe('License Section', () => {
    it('displays license information', () => {
      render(<ContributingPage />);

      expect(screen.getByText('License')).toBeInTheDocument();
      expect(screen.getByText('BSD 3-Clause License')).toBeInTheDocument();
      expect(screen.getByText('View License')).toBeInTheDocument();
    });

    it('provides license link', () => {
      render(<ContributingPage />);

      const licenseLink = screen.getByText('View License');
      expect(licenseLink.closest('a')).toHaveAttribute(
        'href',
        'https://github.com/wuxnz/speck-it-mcp-server/blob/master/LICENSE'
      );
    });

    it('explains licensing terms', () => {
      render(<ContributingPage />);

      expect(
        screen.getByText(
          'This project is licensed under the BSD 3-Clause License. By contributing, you agree that your contributions will be licensed under the same license.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<ContributingPage />);

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h1.textContent).toBe('Contributing');
    });

    it('provides semantic structure for steps', () => {
      render(<ContributingPage />);

      // Check for step numbering
      const stepNumbers = screen.getAllByText(/^\d+$/);
      expect(stepNumbers.length).toBeGreaterThan(0);

      // Check for step titles
      const stepTitles = screen.getAllByRole('heading', { level: 2 });
      expect(stepTitles.length).toBeGreaterThan(0);
    });

    it('has accessible links', () => {
      render(<ContributingPage />);

      const externalLinks = screen
        .getAllByRole('link')
        .filter((link) => link.getAttribute('href')?.startsWith('http'));

      externalLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Content Quality', () => {
    it('provides clear and concise instructions', () => {
      render(<ContributingPage />);

      // Check that descriptions are meaningful
      const descriptions = screen.getAllByText(
        /Fork the repository|Create a new branch|Install the required|Run the development/
      );
      expect(descriptions.length).toBeGreaterThan(0);

      descriptions.forEach((desc) => {
        expect(desc.textContent?.length).toBeGreaterThan(10);
      });
    });

    it('uses consistent terminology', () => {
      render(<ContributingPage />);

      // Check for consistent use of terms
      expect(screen.getAllByText('GitHub').length).toBeGreaterThan(1);
      expect(screen.getAllByText('repository').length).toBeGreaterThan(1);
      expect(screen.getAllByText('branch').length).toBeGreaterThan(1);
    });

    it('provides comprehensive coverage', () => {
      render(<ContributingPage />);

      // Check that all major topics are covered
      const majorTopics = [
        'Getting Started',
        'Development Workflow',
        'Submitting Changes',
        'Code Review Process',
        'Community Guidelines',
        'Getting Help',
        'License',
      ];

      majorTopics.forEach((topic) => {
        expect(screen.getByText(topic)).toBeInTheDocument();
      });
    });
  });

  describe('Code Examples', () => {
    it('displays properly formatted code examples', () => {
      render(<ContributingPage />);

      const codeExamples = screen.getAllByText(/git |npm /);
      expect(codeExamples.length).toBeGreaterThan(0);

      codeExamples.forEach((code) => {
        expect(code.closest('code')).toBeInTheDocument();
      });
    });

    it('shows git commands with proper syntax', () => {
      render(<ContributingPage />);

      expect(screen.getByText(/git clone/)).toBeInTheDocument();
      expect(screen.getByText(/git checkout/)).toBeInTheDocument();
      expect(screen.getByText(/git commit/)).toBeInTheDocument();
      expect(screen.getByText(/git push/)).toBeInTheDocument();
    });

    it('includes commit message format', () => {
      render(<ContributingPage />);

      expect(screen.getByText(/"feat: add new feature description"/)).toBeInTheDocument();
    });
  });

  describe('GitHub Integration', () => {
    it('provides multiple GitHub links', () => {
      render(<ContributingPage />);

      const githubLinks = screen.getAllByText(/github\.com/);
      expect(githubLinks.length).toBeGreaterThan(2);
    });

    it('links to GitHub community features', () => {
      render(<ContributingPage />);

      expect(screen.getByText('GitHub Discussions')).toBeInTheDocument();
      expect(screen.getByText('GitHub Issues')).toBeInTheDocument();
    });

    it('shows GitHub repository references', () => {
      render(<ContributingPage />);

      expect(screen.getByText(/your-username\/speck-it-mcp-server/)).toBeInTheDocument();
      expect(screen.getByText(/wuxnz\/speck-it-mcp-server/)).toBeInTheDocument();
    });
  });
});
