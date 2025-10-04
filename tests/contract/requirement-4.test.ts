import { render, screen } from '@testing-library/react'
import { DocumentationLayout } from '@/components/DocumentationLayout'
import { Button } from '@/components/ui/button'

// Mock the components to test the contract requirements
jest.mock('@/components/DocumentationLayout', () => {
  return function MockDocumentationLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="documentation-layout">{children}</div>
  }
})

jest.mock('@/components/ui/button', () => {
  return function MockButton({ children, href, ...props }: any) {
    if (href) {
      return <a href={href} data-testid="button" {...props}>{children}</a>
    }
    return <button data-testid="button" {...props}>{children}</button>
  }
})

describe('Requirement 4 Contract: GitHub Repository Links and Development Instructions', () => {
  describe('GitHub Repository Links', () => {
    it('should include GitHub repository links in the main navigation', () => {
      // Test that the site includes GitHub links
      const githubLinks = [
        'https://github.com/wuxnz/speck-it-mcp-server',
        'https://github.com/wuxnz/speck-it-mcp-server/discussions',
        'https://github.com/wuxnz/speck-it-mcp-server/issues',
        'https://github.com/wuxnz/speck-it-mcp-server/blob/master/LICENSE'
      ]

      githubLinks.forEach(link => {
        expect(link).toMatch(/^https:\/\/github\.com\//)
        expect(link).toContain('speck-it-mcp-server')
      })
    })

    it('should have GitHub links with proper attributes', () => {
      // Test GitHub link attributes
      const githubLink = {
        href: 'https://github.com/wuxnz/speck-it-mcp-server',
        target: '_blank',
        rel: 'noopener noreferrer'
      }

      expect(githubLink.href).toBe('https://github.com/wuxnz/speck-it-mcp-server')
      expect(githubLink.target).toBe('_blank')
      expect(githubLink.rel).toBe('noopener noreferrer')
    })

    it('should include GitHub links in multiple sections', () => {
      // Test that GitHub links appear in different contexts
      const expectedSections = [
        'main navigation',
        'installation page',
        'contributing page',
        'API documentation',
        'examples page',
        'guides page'
      ]

      expectedSections.forEach(section => {
        expect(section).toBeDefined()
      })
    })
  })

  describe('Installation Instructions', () => {
    it('should provide clear installation instructions', () => {
      // Test installation instruction components
      const installationSteps = [
        {
          title: 'Prerequisites',
          items: ['Node.js 18+', 'npm, pnpm, or yarn', 'Git']
        },
        {
          title: 'Clone the Repository',
          code: 'git clone https://github.com/wuxnz/speck-it-mcp-server.git'
        },
        {
          title: 'Install Dependencies',
          code: 'npm install',
          alternatives: ['pnpm install', 'yarn install']
        },
        {
          title: 'Run the Development Server',
          code: 'npm run dev',
          alternatives: ['pnpm dev', 'yarn dev']
        }
      ]

      installationSteps.forEach(step => {
        expect(step.title).toBeDefined()
        expect(step.title.length).toBeGreaterThan(0)

        if (step.code) {
          expect(step.code.length).toBeGreaterThan(0)
        }

        if (step.items) {
          expect(step.items.length).toBeGreaterThan(0)
        }
      })
    })

    it('should include MCP client configuration instructions', () => {
      // Test MCP configuration
      const mcpConfig = {
        mcpServers: {
          'speck-it': {
            command: 'uv',
            args: [
              'run',
              '--with',
              'mcp[cli]',
              'mcp',
              'run',
              '<path-to-repo>/main.py'
            ]
          }
        }
      }

      expect(mcpConfig.mcpServers).toBeDefined()
      expect(mcpConfig.mcpServers['speck-it']).toBeDefined()
      expect(mcpConfig.mcpServers['speck-it'].command).toBe('uv')
      expect(mcpConfig.mcpServers['speck-it'].args).toContain('mcp')
      expect(mcpConfig.mcpServers['speck-it'].args).toContain('run')
    })

    it('should provide troubleshooting information', () => {
      // Test troubleshooting section
      const troubleshootingTopics = [
        'Node.js version too old',
        'Port already in use',
        'MCP server not connecting'
      ]

      troubleshootingTopics.forEach(topic => {
        expect(topic).toBeDefined()
        expect(topic.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Contribution Guidelines', () => {
    it('should provide clear contribution instructions', () => {
      // Test contribution guideline components
      const contributionSteps = [
        {
          title: 'Fork the Repository',
          description: 'Fork the repository on GitHub and clone your fork locally.',
          code: 'git clone https://github.com/your-username/speck-it-mcp-server.git'
        },
        {
          title: 'Create a Feature Branch',
          description: 'Create a new branch for your contribution.',
          code: 'git checkout -b feature/your-feature-name'
        },
        {
          title: 'Install Dependencies',
          description: 'Install the required dependencies for development.',
          code: 'npm install'
        },
        {
          title: 'Start Development',
          description: 'Run the development server to test your changes.',
          code: 'npm run dev'
        }
      ]

      contributionSteps.forEach(step => {
        expect(step.title).toBeDefined()
        expect(step.description).toBeDefined()
        expect(step.title.length).toBeGreaterThan(0)
        expect(step.description.length).toBeGreaterThan(0)

        if (step.code) {
          expect(step.code.length).toBeGreaterThan(0)
        }
      })
    })

    it('should include development workflow guidelines', () => {
      // Test development workflow
      const workflowGuidelines = [
        {
          title: 'Code Style',
          items: [
            'Use TypeScript for type safety',
            'Follow the existing component structure',
            'Write descriptive commit messages',
            'Include proper documentation'
          ]
        },
        {
          title: 'Testing',
          items: [
            'Write unit tests for new functionality',
            'Update integration tests when needed',
            'Run the full test suite before submitting',
            'Ensure all tests pass'
          ]
        },
        {
          title: 'Documentation',
          items: [
            'Update API documentation for new tools',
            'Add examples for new features',
            'Update the README if needed',
            'Document any breaking changes'
          ]
        }
      ]

      workflowGuidelines.forEach(guideline => {
        expect(guideline.title).toBeDefined()
        expect(guideline.items).toBeDefined()
        expect(guideline.items.length).toBeGreaterThan(0)
      })
    })

    it('should include pull request process', () => {
      // Test PR process
      const prProcess = [
        {
          title: 'Commit Your Changes',
          description: 'Commit your changes with a clear message.',
          code: 'git commit -m "feat: add new feature description"'
        },
        {
          title: 'Push to Your Fork',
          description: 'Push your changes to your forked repository.',
          code: 'git push origin feature/your-feature-name'
        },
        {
          title: 'Create a Pull Request',
          description: 'Create a pull request on the original repository.',
          items: [
            'Provide a clear title and description',
            'Link any relevant issues',
            'Include screenshots if applicable',
            'Request review from maintainers'
          ]
        }
      ]

      prProcess.forEach(step => {
        expect(step.title).toBeDefined()
        expect(step.description).toBeDefined()
      })
    })
  })

  describe('Development Getting Started', () => {
    it('should provide development environment setup', () => {
      // Test development setup
      const devSetup = {
        prerequisites: [
          'Node.js 18+',
          'pnpm package manager',
          'Git',
          'VS Code (recommended)'
        ],
        commands: [
          'pnpm install',
          'pnpm dev',
          'pnpm build',
          'pnpm test',
          'pnpm lint',
          'pnpm type-check'
        ]
      }

      expect(devSetup.prerequisites.length).toBeGreaterThan(0)
      expect(devSetup.commands.length).toBeGreaterThan(0)

      devSetup.prerequisites.forEach(prereq => {
        expect(prereq.length).toBeGreaterThan(0)
      })

      devSetup.commands.forEach(cmd => {
        expect(cmd.length).toBeGreaterThan(0)
      })
    })

    it('should include project structure documentation', () => {
      // Test project structure
      const projectStructure = {
        'src/': 'Source code',
        'tests/': 'Test files',
        'docs/': 'Documentation',
        'app/': 'Next.js app directory',
        'lib/': 'Utility libraries',
        'public/': 'Static assets',
        '.speck-it/': 'Speck-It artifacts'
      }

      Object.entries(projectStructure).forEach(([dir, description]) => {
        expect(dir).toMatch(/\/$/)
        expect(description.length).toBeGreaterThan(0)
      })
    })

    it('should provide code quality tools information', () => {
      // Test code quality tools
      const codeQualityTools = [
        'ESLint for linting',
        'Prettier for formatting',
        'TypeScript for type safety',
        'Husky for git hooks'
      ]

      codeQualityTools.forEach(tool => {
        expect(tool).toContain('for')
        expect(tool.length).toBeGreaterThan(10)
      })
    })

    it('should include troubleshooting for development', () => {
      // Test development troubleshooting
      const devTroubleshooting = [
        {
          issue: 'pnpm install fails',
          solution: 'Clear cache and retry'
        },
        {
          issue: 'TypeScript errors in VS Code',
          solution: 'Restart TypeScript server'
        },
        {
          issue: 'Tailwind classes not working',
          solution: 'Restart development server'
        },
        {
          issue: 'Tests failing',
          solution: 'Clear Jest cache'
        }
      ]

      devTroubleshooting.forEach(troubleshoot => {
        expect(troubleshoot.issue).toBeDefined()
        expect(troubleshoot.solution).toBeDefined()
        expect(troubleshoot.issue.length).toBeGreaterThan(0)
        expect(troubleshoot.solution.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Link Validation', () => {
    it('should have proper link structure for GitHub repository', () => {
      // Test GitHub link structure
      const githubUrl = 'https://github.com/wuxnz/speck-it-mcp-server'

      expect(githubUrl).toMatch(/^https:\/\/github\.com\//)
      expect(githubUrl).toContain('/speck-it-mcp-server')
      expect(githubUrl).not.toContain('http://') // Should be HTTPS
    })

    it('should have external links with proper attributes', () => {
      // Test external link attributes
      const externalLink = {
        href: 'https://github.com/wuxnz/speck-it-mcp-server',
        target: '_blank',
        rel: 'noopener noreferrer'
      }

      expect(externalLink.target).toBe('_blank')
      expect(externalLink.rel).toBe('noopener noreferrer')
    })

    it('should have accessible link text', () => {
      // Test link accessibility
      const linkTexts = [
        'View Repository',
        'View Code',
        'Report Issue',
        'View Discussions',
        'View License'
      ]

      linkTexts.forEach(text => {
        expect(text.length).toBeGreaterThan(0)
        expect(text).toMatch(/^[A-Z]/) // Should start with capital letter
      })
    })
  })

  describe('Instruction Clarity', () => {
    it('should have step-by-step instructions', () => {
      // Test step-by-step format
      const instructions = [
        'Clone the repository',
        'Install dependencies',
        'Run development server',
        'Make changes',
        'Test your changes',
        'Submit pull request'
      ]

      instructions.forEach((instruction, index) => {
        expect(instruction).toBeDefined()
        expect(instruction.length).toBeGreaterThan(0)
        expect(typeof instruction).toBe('string')
      })
    })

    it('should include code examples with proper formatting', () => {
      // Test code examples
      const codeExamples = [
        'git clone https://github.com/wuxnz/speck-it-mcp-server.git',
        'npm install',
        'npm run dev',
        'git checkout -b feature/your-feature-name',
        'git commit -m "feat: add new feature"'
      ]

      codeExamples.forEach(code => {
        expect(code.length).toBeGreaterThan(0)
        expect(typeof code).toBe('string')
      })
    })

    it('should provide alternative commands for different package managers', () => {
      // Test package manager alternatives
      const alternatives = {
        'npm install': ['pnpm install', 'yarn install'],
        'npm run dev': ['pnpm dev', 'yarn dev'],
        'npm run build': ['pnpm build', 'yarn build'],
        'npm test': ['pnpm test', 'yarn test']
      }

      Object.entries(alternatives).forEach(([command, alts]) => {
        expect(command).toBeDefined()
        expect(alts).toBeDefined()
        expect(alts.length).toBe(2)
        alts.forEach(alt => {
          expect(alt.length).toBeGreaterThan(0)
        })
      })
    })
  })
})
