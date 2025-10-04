# Speck-It MCP Server Documentation Site - Quick Start

## Environment Setup

### Prerequisites

- **Node.js 18+** - Required for Next.js development
- **pnpm 8+** - Fast, disk space efficient package manager
- **Git** - Version control system
- **VS Code** (recommended) - With these extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

### Bootstrap Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/speck-it-mcp-server-docs.git
   cd speck-it-mcp-server-docs
   ```

2. **Install Node.js dependencies**

   ```bash
   # Install pnpm if not already installed
   npm install -g pnpm

   # Install project dependencies
   pnpm install
   ```

3. **Configure environment variables**

   ```bash
   # Copy environment template
   cp .env.example .env.local

   # Edit .env.local with your configuration
   # Most development can proceed without additional configuration
   ```

4. **Initialize git hooks**

   ```bash
   # This sets up pre-commit hooks for code quality
   pnpm prepare
   ```

5. **Run development server**

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

6. **Verify the setup**

   ```bash
   # Run all tests to ensure everything is working
   pnpm test

   # Check for linting issues
   pnpm lint

   # Verify TypeScript compilation
   pnpm type-check
   ```

7. **Build for production**

   ```bash
   pnpm build
   ```

### Tech Stack Overview

This project uses a modern web development stack:

- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn UI** - Component library built on Radix UI
- **Zustand 5.0.2** - State management
- **Jest** - Testing framework
- **ESLint + Prettier** - Code quality tools
- **Husky** - Git hooks

### Project Structure

```
├── src/                 # Source code
│   ├── components/      # React components
│   │   ├── ui/         # Shadcn UI components
│   │   └── ...         # Custom components
│   └── lib/            # Utility libraries
├── tests/              # Test files
│   ├── contract/       # Contract tests (requirements validation)
│   ├── integration/    # Integration tests (end-to-end workflows)
│   └── unit/          # Unit tests (component testing)
├── docs/              # Documentation
├── app/               # Next.js app directory
│   ├── api/           # API routes
│   ├── contributing/  # Contribution guidelines page
│   ├── installation/  # Installation instructions page
│   └── ...           # Other pages
├── lib/               # Utility libraries
├── public/            # Static assets
├── .speck-it/         # Speck-It artifacts (specs, plans, tasks)
└── ref/               # Reference materials
```

### Development Commands

#### Core Development

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server

#### Testing

- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

#### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking

### Development Workflow

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**

   ```bash
   # Run tests frequently
   pnpm test:watch

   # Check linting and formatting
   pnpm lint:fix
   pnpm format
   ```

3. **Commit changes**

   ```bash
   # Pre-commit hooks will run automatically
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Quality Tools

This project uses comprehensive code quality tooling:

- **ESLint** - JavaScript/TypeScript linting with Next.js and Prettier configs
- **Prettier** - Code formatting with consistent style
- **TypeScript** - Static type checking
- **Husky** - Git hooks for pre-commit quality checks
- **lint-staged** - Run linters on staged files only

### Troubleshooting

#### Common Issues

**Issue: `pnpm install` fails**

```bash
# Clear cache and retry
pnpm store prune
rm -rf node_modules
pnpm install
```

**Issue: TypeScript errors in VS Code**

```bash
# Restart TypeScript server
# In VS Code: Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

**Issue: Tailwind classes not working**

```bash
# Restart development server
pnpm dev
```

**Issue: Tests failing**

```bash
# Clear Jest cache
pnpm test -- --clearCache
```

#### Environment Variables

Create a `.env.local` file for local development:

```env
# Optional: Add any environment-specific variables here
# NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Getting Help

- **Documentation** - Check the [documentation](./) for detailed guides
- **API Reference** - Review the [API reference](./api) for technical details
- **GitHub Repository** - Visit the [GitHub repository](https://github.com/wuxnz) for issues and contributions
- **Speck-It MCP Server** - Refer to the [ref/speck-it](../ref/speck-it) directory for the actual MCP server implementation

### Manual Validation Steps

To ensure the Speck-It MCP Server Documentation Site is working correctly, follow these manual validation steps:

#### 1. Basic Functionality Validation

1. **Site Navigation**
   - Navigate to all main sections (Installation, Contributing, API, Guides, Examples)
   - Verify all links work correctly
   - Check that the theme toggle switches between dark and light modes
   - Ensure responsive design works on different screen sizes

2. **Installation Instructions**
   - Follow the installation steps yourself
   - Verify all code examples are correct and executable
   - Test the copy-to-clipboard functionality
   - Ensure MCP client configuration is accurate

3. **GitHub Repository Links**
   - Verify all GitHub links point to the correct repository
   - Check that external links open in new tabs with proper attributes
   - Ensure repository links are accessible throughout the site

#### 2. Technical Validation

1. **Code Quality**

   ```bash
   # Run linting
   pnpm lint

   # Check formatting
   pnpm format:check

   # Run type checking
   pnpm type-check
   ```

   All commands should complete without errors.

2. **Testing**

   ```bash
   # Run all tests
   pnpm test

   # Run tests with coverage
   pnpm test:coverage
   ```

   All tests should pass with at least 80% coverage.

3. **Build Process**
   ```bash
   # Build for production
   pnpm build
   ```
   The build should complete without errors.

#### 3. Requirement Validation

1. **Requirement 1: Documentation Site Structure**
   - Verify the site has a main navigation with all required sections
   - Check that GitHub repository links are present and functional
   - Ensure installation instructions are clear and complete
   - Validate that contribution guidelines are accessible

2. **Requirement 2: Tech Stack and Theme**
   - Verify the site uses TypeScript (check for type safety)
   - Confirm Tailwind CSS classes are applied correctly
   - Test the dark theme is applied by default
   - Verify the theme switcher works correctly

3. **Requirement 3: Comprehensive Documentation**
   - Check that installation instructions are detailed and accurate
   - Verify contribution guidelines are complete and actionable
   - Ensure API reference is comprehensive and accurate
   - Validate that guides provide useful information for users

4. **Requirement 4: GitHub Repository and Development Instructions**
   - Verify GitHub repository links are present in multiple locations
   - Check that installation instructions are clear and actionable
   - Ensure contribution guidelines provide step-by-step instructions
   - Validate that getting started with development is well documented

5. **Requirement 5: Automatic Task Updates**
   - If using the Speck-It MCP server, verify that tasks are automatically updated when specs are generated
   - Check that the task management component shows the correct task status
   - Ensure task dependencies and prerequisites are properly handled

#### 4. Performance Validation

1. **Page Load Performance**
   - Use browser dev tools to check page load times
   - Verify all pages load in under 3 seconds
   - Check that images and assets are optimized

2. **Mobile Responsiveness**
   - Test the site on mobile devices (or use browser dev tools)
   - Verify all content is accessible on small screens
   - Check that navigation works correctly on touch devices

3. **Accessibility**
   - Use a screen reader to verify the site is accessible
   - Check that all interactive elements have proper ARIA labels
   - Ensure color contrast meets WCAG standards

#### 5. Cross-Browser Validation

Test the site in multiple browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Verify that all functionality works correctly across browsers.

#### 6. Error Handling Validation

1. **Error Boundaries**
   - Test error handling by introducing errors in the browser console
   - Verify that error boundaries display appropriate fallback UI
   - Check that errors are logged correctly

2. **Network Errors**
   - Test behavior when network requests fail
   - Verify that appropriate error messages are displayed
   - Check that the site recovers gracefully from errors

#### 7. Security Validation

1. **Content Security Policy**
   - Verify that the site has appropriate CSP headers
   - Check that inline scripts are handled correctly
   - Ensure external resources are loaded securely

2. **Dependencies**
   - Run `pnpm audit` to check for vulnerable dependencies
   - Update any packages with known vulnerabilities
   - Verify that all dependencies are necessary

#### 8. Documentation Validation

1. **README Files**
   - Verify that all README files are up to date
   - Check that installation instructions match the actual process
   - Ensure that contribution guidelines are accurate

2. **Code Comments**
   - Verify that complex code has appropriate comments
   - Check that TODO items are tracked and addressed
   - Ensure that API documentation matches the implementation

### Troubleshooting Validation Issues

If you encounter issues during validation:

1. **Build Issues**

   ```bash
   # Clear build cache
   rm -rf .next

   # Clear node modules
   rm -rf node_modules

   # Reinstall dependencies
   pnpm install

   # Rebuild
   pnpm build
   ```

2. **Test Failures**

   ```bash
   # Clear Jest cache
   pnpm test -- --clearCache

   # Update snapshots if needed
   pnpm test -- -u
   ```

3. **Linting Issues**

   ```bash
   # Auto-fix linting issues
   pnpm lint:fix

   # Format code
   pnpm format
   ```

### Validation Checklist

Before considering the site complete, verify the following:

- [ ] All pages load correctly
- [ ] All links work properly
- [ ] Theme switching works correctly
- [ ] Installation instructions are accurate
- [ ] Contribution guidelines are complete
- [ ] API reference is comprehensive
- [ ] Guides provide useful information
- [ ] GitHub repository links are functional
- [ ] All tests pass with adequate coverage
- [ ] Build completes without errors
- [ ] Site works across multiple browsers
- [ ] Mobile responsiveness is maintained
- [ ] Accessibility standards are met
- [ ] Error handling works correctly
- [ ] Security best practices are followed

### Next Steps

1. Explore the [installation guide](./installation) for detailed setup instructions
2. Read the [contribution guidelines](./contributing) to understand how to contribute
3. Check the [API documentation](./api) for technical implementation details
4. Review the test structure in `tests/` to understand the testing approach
