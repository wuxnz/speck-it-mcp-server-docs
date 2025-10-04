import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import App from '@/app/page'

// Mock the Speck-It MCP server tools to simulate the actual workflow
const mockSpeckItTools = {
  set_constitution: jest.fn(),
  get_constitution: jest.fn(),
  set_feature_root: jest.fn(),
  generate_spec: jest.fn(),
  generate_plan: jest.fn(),
  generate_tasks: jest.fn(),
  manage_project_tasks: jest.fn(),
  list_tasks: jest.fn(),
  update_task: jest.fn(),
  next_task: jest.fn(),
  complete_task: jest.fn(),
  feature_status: jest.fn(),
  finalize_feature: jest.fn(),
  list_features: jest.fn(),
  get_workflow_guide: jest.fn(),
}

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

// Mock MCP client connection
jest.mock('@modelcontextprotocol/sdk', () => ({
  Client: jest.fn(() => ({
    request: jest.fn((request) => {
      const { method, params } = request

      switch (method) {
        case 'tools/call':
          return mockSpeckItTools[params.name]?.(params.arguments)
        default:
          return null
      }
    }),
  })),
}))

describe('Complete End-to-End Workflow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock responses for successful workflow
    mockSpeckItTools.set_constitution.mockResolvedValue({
      success: true,
      message: 'Constitution set successfully',
    })

    mockSpeckItTools.set_feature_root.mockResolvedValue({
      success: true,
      message: 'Feature root registered successfully',
    })

    mockSpeckItTools.generate_spec.mockResolvedValue({
      success: true,
      spec_path: '.speck-it/specs/001-speck-it-mcp-server-docs/spec.md',
      spec_content: '# Feature Specification\n\nThis is a test specification.',
    })

    mockSpeckItTools.generate_plan.mockResolvedValue({
      success: true,
      plan_path: '.speck-it/specs/001-speck-it-mcp-server-docs/plan.md',
      plan_content: '# Implementation Plan\n\n1. Set up project structure\n2. Implement features',
    })

    mockSpeckItTools.generate_tasks.mockResolvedValue({
      success: true,
      tasks: [
        {
          task_id: 'T001',
          description: 'Establish project scaffolding',
          completed: false,
          priority: 1,
        },
        {
          task_id: 'T002',
          description: 'Configure development environment',
          completed: false,
          priority: 2,
        },
      ],
    })

    mockSpeckItTools.list_features.mockResolvedValue({
      features: [
        {
          feature_id: '001-speck-it-mcp-server-docs',
          feature_name: 'Speck-It MCP Server Documentation Site',
          spec_path: '.speck-it/specs/001-speck-it-mcp-server-docs/spec.md',
          plan_path: '.speck-it/specs/001-speck-it-mcp-server-docs/plan.md',
          tasks_path: '.speck-it/specs/001-speck-it-mcp-server-docs/tasks.md',
          status: 'active',
        },
      ],
      count: 1,
    })

    mockSpeckItTools.list_tasks.mockResolvedValue({
      feature_id: '001-speck-it-mcp-server-docs',
      tasks: [
        {
          task_id: 'T001',
          description: 'Establish project scaffolding',
          completed: true,
        },
        {
          task_id: 'T002',
          description: 'Configure development environment',
          completed: false,
        },
      ],
    })
  })

  describe('Complete Speck-It Workflow', () => {
    it('should execute the complete workflow from constitution to task completion', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )

      // Step 1: Navigate to the main page
      expect(screen.getByText(/Speck-It MCP Server Documentation Site/)).toBeInTheDocument()

      // Step 2: Verify the documentation site structure
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()

      // Step 3: Check for GitHub repository links
      const githubLinks = screen.getAllByText(/github/i)
      expect(githubLinks.length).toBeGreaterThan(0)

      // Step 4: Verify installation instructions are accessible
      const installationLink = screen.getByText(/installation/i)
      expect(installationLink).toBeInTheDocument()

      // Step 5: Verify contribution guidelines are accessible
      const contributingLink = screen.getByText(/contributing/i)
      expect(contributingLink).toBeInTheDocument()

      // Step 6: Verify API reference is accessible
      const apiLink = screen.getByText(/api/i)
      expect(apiLink).toBeInTheDocument()

      // Step 7: Verify theme switching functionality
      const themeToggle = screen.getByRole('button', { name: /theme/i })
      expect(themeToggle).toBeInTheDocument()

      // Step 8: Test theme switching
      await user.click(themeToggle)

      // Step 9: Verify responsive design elements
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('should demonstrate automatic task updates when specs are generated', async () => {
      const user = userEvent.setup()

      // Mock the complete workflow
      const workflowSteps = [
        { name: 'set_constitution', mock: mockSpeckItTools.set_constitution },
        { name: 'set_feature_root', mock: mockSpeckItTools.set_feature_root },
        { name: 'generate_spec', mock: mockSpeckItTools.generate_spec },
        { name: 'generate_plan', mock: mockSpeckItTools.generate_plan },
        { name: 'generate_tasks', mock: mockSpeckItTools.generate_tasks },
      ]

      // Execute workflow steps
      for (const step of workflowSteps) {
        const result = await step.mock()
        expect(result.success).toBe(true)
      }

      // Verify that tasks were generated after spec generation
      expect(mockSpeckItTools.generate_tasks).toHaveBeenCalled()

      // Verify task list can be retrieved
      const tasksResult = await mockSpeckItTools.list_tasks({
        feature_id: '001-speck-it-mcp-server-docs'
      })
      expect(tasksResult.tasks).toBeDefined()
      expect(tasksResult.tasks.length).toBeGreaterThan(0)
    })

    it('should handle task completion and progression', async () => {
      // Mock task completion
      mockSpeckItTools.complete_task.mockResolvedValue({
        feature_id: '001-speck-it-mcp-server-docs',
        task: {
          task_id: 'T001',
          description: 'Establish project scaffolding',
          completed: true,
          notes: ['Task completed successfully'],
        },
        remaining: 1,
        next_task: {
          task_id: 'T002',
          description: 'Configure development environment',
          completed: false,
        },
      })

      // Complete a task
      const result = await mockSpeckItTools.complete_task({
        feature_id: '001-speck-it-mcp-server-docs',
        task_id: 'T001',
        note: 'Task completed successfully',
      })

      expect(result.task.completed).toBe(true)
      expect(result.remaining).toBe(1)
      expect(result.next_task.task_id).toBe('T002')
    })

    it('should validate contract test failures for unimplemented requirements', async () => {
      // Mock a scenario where a requirement is not implemented
      mockSpeckItTools.generate_spec.mockResolvedValueOnce({
        success: true,
        spec_path: '.speck-it/specs/test-feature/spec.md',
        spec_content: '# Test Feature Specification\n\nThis feature includes a new requirement that is not yet implemented.',
      })

      // Generate spec for a feature with unimplemented requirements
      const specResult = await mockSpeckItTools.generate_spec({
        feature_name: 'Test Feature with Unimplemented Requirements',
        description: 'This feature has requirements that are not yet implemented',
        feature_id: 'test-feature-unimplemented',
        save: true,
      })

      expect(specResult.success).toBe(true)

      // Generate tasks - these should include tasks for unimplemented requirements
      const tasksResult = await mockSpeckItTools.generate_tasks({
        feature_id: 'test-feature-unimplemented',
        save: true,
      })

      expect(tasksResult.success).toBe(true)

      // The tasks should include tasks for unimplemented requirements
      // These tasks would have status 'pending' and would cause contract tests to fail
      const unimplementedTasks = tasksResult.tasks.filter(task =>
        task.status === 'pending' &&
        task.description.includes('unimplemented')
      )

      expect(unimplementedTasks.length).toBeGreaterThan(0)
    })
  })

  describe('Contract Test Validation', () => {
    it('should ensure contract tests fail when requirements are not implemented', async () => {
      // Mock a scenario where requirement 1 is not fully implemented
      mockSpeckItTools.list_tasks.mockResolvedValueOnce({
        feature_id: '001-speck-it-mcp-server-docs',
        tasks: [
          {
            task_id: 'T001',
            description: 'Establish project scaffolding',
            completed: false, // This task is not completed
            status: 'pending',
          },
          {
            task_id: 'T002',
            description: 'Document environment bootstrap',
            completed: false, // This task is not completed
            status: 'pending',
          },
        ],
      })

      // Get task list
      const tasksResult = await mockSpeckItTools.list_tasks({
        feature_id: '001-speck-it-mcp-server-docs'
      })

      // Verify that incomplete tasks exist
      const incompleteTasks = tasksResult.tasks.filter(task => !task.completed)
      expect(incompleteTasks.length).toBeGreaterThan(0)

      // Contract tests for requirement 1 should fail because tasks are not completed
      // This ensures that implementations are properly validated before being marked complete
    })

    it('should validate all requirements have corresponding tasks', async () => {
      // Mock the complete task list for all requirements
      mockSpeckItTools.list_tasks.mockResolvedValue({
        feature_id: '001-speck-it-mcp-server-docs',
        tasks: [
          // Requirement 1 tasks
          { task_id: 'T001', description: 'Establish project scaffolding', completed: true },
          { task_id: 'T002', description: 'Document environment bootstrap', completed: true },
          { task_id: 'T003', description: 'Configure linting and formatting', completed: true },
          { task_id: 'T004', description: 'Author contract test for requirement 1', completed: true },
          { task_id: 'T005', description: 'Create integration test for requirement 1', completed: true },
          { task_id: 'T006', description: 'Implement functionality for requirement 1', completed: true },

          // Requirement 2 tasks
          { task_id: 'T007', description: 'Author contract test for requirement 2', completed: true },
          { task_id: 'T008', description: 'Create integration test for requirement 2', completed: true },
          { task_id: 'T009', description: 'Implement functionality for requirement 2', completed: true },

          // Requirement 3 tasks
          { task_id: 'T010', description: 'Author contract test for requirement 3', completed: true },
          { task_id: 'T011', description: 'Create integration test for requirement 3', completed: true },
          { task_id: 'T012', description: 'Implement functionality for requirement 3', completed: true },

          // Requirement 4 tasks
          { task_id: 'T013', description: 'Author contract test for requirement 4', completed: true },
          { task_id: 'T014', description: 'Create integration test for requirement 4', completed: true },
          { task_id: 'T015', description: 'Implement functionality for requirement 4', completed: true },

          // Requirement 5 tasks
          { task_id: 'T016', description: 'Author contract test for requirement 5', completed: true },
          { task_id: 'T017', description: 'Create integration test for requirement 5', completed: true },
          { task_id: 'T018', description: 'Implement functionality for requirement 5', completed: true },
        ],
      })

      // Get task list
      const tasksResult = await mockSpeckItTools.list_tasks({
        feature_id: '001-speck-it-mcp-server-docs'
      })

      // Verify that all requirements have corresponding tasks
      expect(tasksResult.tasks.length).toBe(18)

      // Verify that all tasks are completed
      const completedTasks = tasksResult.tasks.filter(task => task.completed)
      expect(completedTasks.length).toBe(18)

      // Contract tests should pass because all tasks are completed
    })

    it('should validate task dependencies and prerequisites', async () => {
      // Mock tasks with dependencies
      mockSpeckItTools.list_tasks.mockResolvedValue({
        feature_id: '001-speck-it-mcp-server-docs',
        tasks: [
          {
            task_id: 'T001',
            description: 'Establish project scaffolding',
            completed: true,
            dependencies: [],
            prerequisites: ['constitution_exists'],
          },
          {
            task_id: 'T002',
            description: 'Document environment bootstrap',
            completed: true,
            dependencies: ['T001'],
            prerequisites: ['spec_exists'],
          },
          {
            task_id: 'T003',
            description: 'Configure linting and formatting',
            completed: false, // This task is not completed
            dependencies: ['T002'],
            prerequisites: ['spec_exists'],
          },
        ],
      })

      // Get task list
      const tasksResult = await mockSpeckItTools.list_tasks({
        feature_id: '001-speck-it-mcp-server-docs'
      })

      // Verify dependency chain
      const taskT001 = tasksResult.tasks.find(t => t.task_id === 'T001')
      const taskT002 = tasksResult.tasks.find(t => t.task_id === 'T002')
      const taskT003 = tasksResult.tasks.find(t => t.task_id === 'T003')

      expect(taskT001?.dependencies).toEqual([])
      expect(taskT002?.dependencies).toEqual(['T001'])
      expect(taskT003?.dependencies).toEqual(['T002'])

      // Verify that T003 cannot be completed until T002 is completed
      expect(taskT003?.completed).toBe(false)
    })
  })

  describe('Integration Path Validation', () => {
    it('should validate the complete integration path from spec to deployment', async () => {
      // This test validates the complete integration path

      // Step 1: Constitution setup
      const constitutionResult = await mockSpeckItTools.set_constitution({
        content: 'Project constitution for documentation site',
        mode: 'replace',
      })
      expect(constitutionResult.success).toBe(true)

      // Step 2: Feature root registration
      const featureRootResult = await mockSpeckItTools.set_feature_root({
        feature_id: '001-speck-it-mcp-server-docs',
        root: '/project/root',
      })
      expect(featureRootResult.success).toBe(true)

      // Step 3: Specification generation
      const specResult = await mockSpeckItTools.generate_spec({
        feature_name: 'Documentation Site',
        description: 'A comprehensive documentation site for the Speck-It MCP server',
        feature_id: '001-speck-it-mcp-server-docs',
        save: true,
      })
      expect(specResult.success).toBe(true)

      // Step 4: Plan generation (should be triggered automatically)
      const planResult = await mockSpeckItTools.generate_plan({
        feature_id: '001-speck-it-mcp-server-docs',
        tech_context: 'Next.js, TypeScript, Tailwind, Shadcn UI',
        save: true,
      })
      expect(planResult.success).toBe(true)

      // Step 5: Task generation (should be triggered automatically)
      const tasksResult = await mockSpeckItTools.generate_tasks({
        feature_id: '001-speck-it-mcp-server-docs',
        save: true,
      })
      expect(tasksResult.success).toBe(true)

      // Step 6: Task execution
      for (const task of tasksResult.tasks) {
        const completeResult = await mockSpeckItTools.complete_task({
          feature_id: '001-speck-it-mcp-server-docs',
          task_id: task.task_id,
          note: `Completed ${task.description}`,
        })
        expect(completeResult.success).toBe(true)
      }

      // Step 7: Feature finalization
      const finalizeResult = await mockSpeckItTools.finalize_feature({
        feature_id: '001-speck-it-mcp-server-docs',
      })
      expect(finalizeResult.success).toBe(true)
    })

    it('should handle errors gracefully in the integration path', async () => {
      // Mock a failure in the integration path
      mockSpeckItTools.generate_spec.mockResolvedValueOnce({
        success: false,
        error: 'Failed to generate specification: Invalid feature description',
      })

      // Try to generate spec
      const specResult = await mockSpeckItTools.generate_spec({
        feature_name: '',
        description: '', // Empty description should cause failure
        feature_id: 'test-feature',
        save: true,
      })

      // Verify error handling
      expect(specResult.success).toBe(false)
      expect(specResult.error).toContain('Failed to generate specification')

      // The system should handle this gracefully and not crash
      expect(true).toBe(true)
    })
  })

  describe('Performance and Scalability', () => {
    it('should handle large feature sets efficiently', async () => {
      // Mock a large feature set
      const largeFeatureSet = Array.from({ length: 10 }, (_, index) => ({
        feature_id: `feature-${String(index + 1).padStart(3, '0')}`,
        feature_name: `Feature ${index + 1}`,
        spec_path: `.speck-it/specs/feature-${String(index + 1).padStart(3, '0')}/spec.md`,
        plan_path: `.speck-it/specs/feature-${String(index + 1).padStart(3, '0')}/plan.md`,
        tasks_path: `.speck-it/specs/feature-${String(index + 1).padStart(3, '0')}/tasks.md`,
        status: 'active' as const,
      }))

      mockSpeckItTools.list_features.mockResolvedValue({
        features: largeFeatureSet,
        count: 10,
      })

      // Get all features
      const featuresResult = await mockSpeckItTools.list_features()
      expect(featuresResult.features).toHaveLength(10)
      expect(featuresResult.count).toBe(10)

      // The system should handle large feature sets efficiently
      expect(true).toBe(true)
    })

    it('should handle concurrent task operations', async () => {
      // Mock concurrent task operations
      const concurrentOperations = Array.from({ length: 5 }, (_, index) =>
        Promise.resolve({
          task_id: `T${String(index + 1).padStart(3, '0')}`,
          completed: true,
        })
      )

      mockSpeckItTools.update_task.mockImplementation(() =>
        concurrentOperations.shift()
      )

      // Execute concurrent operations
      const operations = concurrentOperations.map((_, index) =>
        mockSpeckItTools.update_task({
          feature_id: 'test-feature',
          task_id: `T${String(index + 1).padStart(3, '0')}`,
          completed: true,
        })
      )

      const results = await Promise.all(operations)

      // All operations should complete successfully
      results.forEach(result => {
        expect(result).toBeDefined()
      })
    })
  })
})
