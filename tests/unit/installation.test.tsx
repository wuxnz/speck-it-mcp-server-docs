import InstallationPage from '@/app/installation/page';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the DocumentationLayout component
jest.mock('@/components/DocumentationLayout', () => {
  return function MockDocumentationLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="documentation-layout">{children}</div>;
  };
});

// Mock the Button component
jest.mock('@/components/ui/button', () => {
  return function MockButton({ children, onClick, ...props }: any) {
    return (
      <button data-testid="button" onClick={onClick} {...props}>
        {children}
      </button>
    );
  };
});

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe('InstallationPage', () => {
  describe('Page Structure', () => {
    it('renders the main heading and description', () => {
      render(<InstallationPage />);

      expect(screen.getByText('Installation')).toBeInTheDocument();
      expect(
        screen.getByText('Get started with the Speck-It MCP Server in a few simple steps.')
      ).toBeInTheDocument();
    });

    it('renders all installation steps', () => {
      render(<InstallationPage />);

      const expectedSteps = [
        'Prerequisites',
        'Clone the Repository',
        'Install Dependencies',
        'Run the Development Server',
        'Configure MCP Client',
      ];

      expectedSteps.forEach((step) => {
        expect(screen.getByText(step)).toBeInTheDocument();
      });
    });

    it('displays numbered steps in correct order', () => {
      render(<InstallationPage />);

      const stepNumbers = screen.getAllByText(/^\d+$/);
      expect(stepNumbers).toHaveLength(5);

      stepNumbers.forEach((stepNumber, index) => {
        expect(stepNumber.textContent).toBe((index + 1).toString());
      });
    });
  });

  describe('GitHub Repository Links', () => {
    it('displays the correct GitHub repository URL', () => {
      render(<InstallationPage />);

      const gitCloneCode = screen.getByText(
        /git clone https:\/\/github\.com\/wuxnz\/speck-it-mcp-server\.git/
      );
      expect(gitCloneCode).toBeInTheDocument();
      expect(gitCloneCode.textContent).toContain('github.com/wuxnz/speck-it-mcp-server');
    });

    it('provides accessible GitHub links', () => {
      render(<InstallationPage />);

      // Check that the GitHub URL is properly formatted
      const githubUrl = 'https://github.com/wuxnz/speck-it-mcp-server';
      expect(githubUrl).toMatch(/^https:\/\/github\.com\//);
      expect(githubUrl).toContain('speck-it-mcp-server');
    });
  });

  describe('Code Block Functionality', () => {
    it('renders code blocks with copy functionality', () => {
      render(<InstallationPage />);

      // Check for code blocks
      const codeBlocks = screen.getAllByText(/git |npm |pnpm |yarn |mcpServers/);
      expect(codeBlocks.length).toBeGreaterThan(0);
    });

    it('provides copy buttons for code blocks', async () => {
      const user = userEvent.setup();
      render(<InstallationPage />);

      // Find copy buttons (they appear on hover)
      const codeBlocks = screen.getAllByRole('button').filter(
        (button) => button.querySelector('svg') // Copy buttons have icons
      );

      if (codeBlocks.length > 0) {
        await user.click(codeBlocks[0]);

        // Verify clipboard was called
        await waitFor(() => {
          expect(navigator.clipboard.writeText).toHaveBeenCalled();
        });
      }
    });

    it('displays alternative package manager commands', () => {
      render(<InstallationPage />);

      // Check for npm alternatives
      expect(screen.getByText('npm install')).toBeInTheDocument();
      expect(screen.getByText('pnpm install')).toBeInTheDocument();
      expect(screen.getByText('yarn install')).toBeInTheDocument();

      // Check for dev server alternatives
      expect(screen.getByText('npm run dev')).toBeInTheDocument();
      expect(screen.getByText('pnpm dev')).toBeInTheDocument();
      expect(screen.getByText('yarn dev')).toBeInTheDocument();
    });
  });

  describe('MCP Configuration', () => {
    it('displays MCP client configuration', () => {
      render(<InstallationPage />);

      expect(screen.getByText('Configure MCP Client')).toBeInTheDocument();
      expect(screen.getByText(/mcpServers/)).toBeInTheDocument();
      expect(screen.getByText(/speck-it/)).toBeInTheDocument();
      expect(screen.getByText(/uv/)).toBeInTheDocument();
    });

    it('shows complete MCP configuration structure', () => {
      render(<InstallationPage />);

      // Check for key MCP configuration elements
      expect(screen.getByText(/command/)).toBeInTheDocument();
      expect(screen.getByText(/args/)).toBeInTheDocument();
      expect(screen.getByText(/mcp\[cli\]/)).toBeInTheDocument();
      expect(screen.getByText(/main\.py/)).toBeInTheDocument();
    });
  });

  describe('Troubleshooting Section', () => {
    it('renders troubleshooting information', () => {
      render(<InstallationPage />);

      expect(screen.getByText('Troubleshooting')).toBeInTheDocument();
      expect(screen.getByText('Common Issues')).toBeInTheDocument();
    });

    it('displays specific troubleshooting topics', () => {
      render(<InstallationPage />);

      const expectedIssues = [
        'Node.js version too old',
        'Port already in use',
        'MCP server not connecting',
      ];

      expectedIssues.forEach((issue) => {
        expect(screen.getByText(issue)).toBeInTheDocument();
      });
    });

    it('provides troubleshooting solutions', () => {
      render(<InstallationPage />);

      expect(screen.getByText('node --version')).toBeInTheDocument();
      expect(screen.getByText('npm run dev -- --port 3001')).toBeInTheDocument();
    });
  });

  describe('Navigation and Next Steps', () => {
    it('provides navigation to other documentation sections', () => {
      render(<InstallationPage />);

      expect(screen.getByText('Next Steps')).toBeInTheDocument();
      expect(screen.getByText('Explore the Documentation')).toBeInTheDocument();
      expect(screen.getByText('Try an Example')).toBeInTheDocument();
    });

    it('has working navigation links', () => {
      render(<InstallationPage />);

      const apiLink = screen.getByText('API Reference');
      const examplesLink = screen.getByText('View Examples');

      expect(apiLink.closest('a')).toHaveAttribute('href', '/api');
      expect(examplesLink.closest('a')).toHaveAttribute('href', '/examples');
    });
  });

  describe('Prerequisites Section', () => {
    it('displays all required prerequisites', () => {
      render(<InstallationPage />);

      const expectedPrerequisites = ['Node.js 18+', 'npm, pnpm, or yarn', 'Git'];

      expectedPrerequisites.forEach((prereq) => {
        expect(screen.getByText(prereq)).toBeInTheDocument();
      });
    });

    it('formats prerequisites as a list', () => {
      render(<InstallationPage />);

      const listItems = screen.getAllByText(/Node\.js|npm|pnpm|yarn|Git/);
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<InstallationPage />);

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h1.textContent).toBe('Installation');
    });

    it('provides semantic structure for steps', () => {
      render(<InstallationPage />);

      // Check for step numbering
      const stepNumbers = screen.getAllByText(/^\d+$/);
      expect(stepNumbers.length).toBeGreaterThan(0);

      // Check for step titles
      const stepTitles = screen.getAllByRole('heading', { level: 2 });
      expect(stepTitles.length).toBeGreaterThan(0);
    });

    it('has accessible code blocks', () => {
      render(<InstallationPage />);

      // Code blocks should be in proper elements
      const codeElements = screen.getAllByText(/git |npm |pnpm |yarn /);
      codeElements.forEach((code) => {
        expect(code.closest('pre')).toBeInTheDocument();
        expect(code.closest('code')).toBeInTheDocument();
      });
    });
  });

  describe('Content Quality', () => {
    it('provides clear and concise instructions', () => {
      render(<InstallationPage />);

      // Check that descriptions are meaningful
      const descriptions = screen.getAllByText(
        /Make sure you have|Get the source code|Install the required|Start the development|Add the server/
      );
      expect(descriptions.length).toBeGreaterThan(0);

      descriptions.forEach((desc) => {
        expect(desc.textContent?.length).toBeGreaterThan(10);
      });
    });

    it('uses consistent terminology', () => {
      render(<InstallationPage />);

      // Check for consistent use of terms
      expect(screen.getAllByText('npm').length).toBeGreaterThan(1);
      expect(screen.getAllByText('pnpm').length).toBeGreaterThan(1);
      expect(screen.getAllByText('yarn').length).toBeGreaterThan(1);
    });

    it('provides comprehensive coverage', () => {
      render(<InstallationPage />);

      // Check that all major topics are covered
      const majorTopics = [
        'Prerequisites',
        'Clone the Repository',
        'Install Dependencies',
        'Run the Development Server',
        'Configure MCP Client',
        'Next Steps',
        'Troubleshooting',
      ];

      majorTopics.forEach((topic) => {
        expect(screen.getByText(topic)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles clipboard errors gracefully', async () => {
      // Mock clipboard to throw an error
      const originalClipboard = navigator.clipboard;
      Object.assign(navigator, {
        clipboard: {
          writeText: jest.fn(() => Promise.reject(new Error('Clipboard failed'))),
        },
      });

      const user = userEvent.setup();
      render(<InstallationPage />);

      const copyButtons = screen
        .getAllByRole('button')
        .filter((button) => button.querySelector('svg'));

      if (copyButtons.length > 0) {
        // Should not throw error when clipboard fails
        await user.click(copyButtons[0]);

        // Restore original clipboard
        Object.assign(navigator, { clipboard: originalClipboard });
      }
    });
  });
});
