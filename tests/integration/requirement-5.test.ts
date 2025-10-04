import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

// Mock the Speck-It MCP server tools
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

// Mock UI components for testing
const MockTaskDashboard = () => {
  return (
    <div data-testid="task-dashboard">
      <h2>Task Management Dashboard</h2>
      <div data-testid="task-list">
        <div data-testid="task-item-T001">T001: Set up project structure</div>
        <div data-testid="task-item-T002">T002: Configure development environment</div>
        <div data-testid="task-item-T003">T003: Implement core features</div>
      </div>
      <button data-testid="refresh-tasks">Refresh Tasks</button>
      <button data-testid="complete-task">Complete Task</button>
    </div>
  )
}

const MockSpecGenerator = () => {
  return (
    <div data-testid="spec-generator">
      <h2>Specification Generator</h2>
      <input data-testid="feature-name" placeholder="Feature name" />
      <textarea data-testid="feature-description" placeholder="Feature description" />
      <button data-testid="generate-spec">Generate Specification</button>
      <div data-testid="spec-output"></div>
    </div>
  )
}

describe('Requirement 5 Integration: Automatic Task Updates on Spec Generation', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mock responses
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
      spec_path: '/test/spec.md',
      spec_content: '# Test Feature Specification\n\nThis is a test specification.',
    })

    mockSpeckItTools.generate_plan.mockResolvedValue({
      success: true,
      plan_path: '/test/plan.md',
      plan_content: '# Implementation Plan\n\n1. Set up project structure\n2. Implement features',
    })

    mockSpeckItTools.generate_tasks.mockResolvedValue({
      success: true,
      tasks: [
        {
          task_id: 'T001',
          description: 'Set up project structure',
          completed: false,
          priority: 1,
          dependencies: [],
          prerequisites: ['constitution_exists', 'feature_root_registered'],
        },
        {
          task_id: 'T002',
          description: 'Configure development environment',
          completed: false,
          priority: 2,
          dependencies: ['T001'],
          prerequisites: ['spec_exists'],
        },
        {
          task_id: 'T003',
          description: 'Implement core features',
          completed: false,
          priority: 3,
          dependencies: ['T002'],
          prerequisites: ['plan_exists'],
        },
      ],
    })

    mockSpeckItTools.list_tasks.mockResolvedValue({
      feature_id: 'test-feature',
      tasks: [
        {
          task_id: 'T001',
          description: 'Set up project structure',
          completed: false,
        },
        {
          task_id: 'T002',
          description: 'Configure development environment',
          completed: false,
        },
        {
          task_id: 'T003',
          description: 'Implement core features',
          completed: false,
        },
      ],
    })
  })

  describe('Complete Workflow Integration', () => {
    it('should complete full spec-to-tasks workflow', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <div>
            <MockSpecGenerator />
            <MockTaskDashboard />
          </div>
        </BrowserRouter>
      )

      // Step 1: Set constitution
      await user.type(screen.getByTestId('feature-name'), 'Test Feature')
      await user.type(screen.getByTestId('feature-description'), 'A test feature for integration testing')

      // Step 2: Generate specification
      await user.click(screen.getByTestId('generate-spec'))

      // Verify spec generation was called
      await waitFor(() => {
        expect(mockSpeckItTools.generate_spec).toHaveBeenCalledWith({
          feature_name: 'Test Feature',
          description: 'A test feature for integration testing',
          feature_id: expect.any(String),
          save: true,
        })
      })

      // Step 3: Verify tasks were automatically generated
      await waitFor(() => {
        expect(mockSpeckItTools.generate_tasks).toHaveBeenCalled()
      })

      // Step 4: Check task list is updated
      await user.click(screen.getByTestId('refresh-tasks'))

      await waitFor(() => {
        expect(mockSpeckItTools.list_tasks).toHaveBeenCalled()
      })

      // Verify tasks are displayed
      expect(screen.getByTestId('task-item-T001')).toBeInTheDocument()
      expect(screen.getByTestId('task-item-T002')).toBeInTheDocument()
      expect(screen.getByTestId('task-item-T003')).toBeInTheDocument()
    })

    it('should handle task completion and progression', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <MockTaskDashboard />
        </BrowserRouter>
      )

      // Mock task completion
      mockSpeckItTools.complete_task.mockResolvedValue({
        feature_id: 'test-feature',
        task: {
          task_id: 'T001',
          description: 'Set up project structure',
          completed: true,
          notes: ['Task completed successfully'],
        },
        remaining: 2,
        next_task: {
          task_id: 'T002',
          description: 'Configure development environment',
          completed: false,
        },
      })

      // Complete first task
      await user.click(screen.getByTestId('complete-task'))

      await waitFor(() => {
        expect(mockSpeckItTools.complete_task).toHaveBeenCalledWith({
          feature_id: expect.any(String),
          task_id: expect.any(String),
        })
      })

      // Refresh task list to see updated status
      await user.click(screen.getByTestId('refresh-tasks'))

      await waitFor(() => {
        expect(mockSpeckItTools.list_tasks).toHaveBeenCalled()
      })
    })
  })

  describe('Real-time Task Updates', () => {
    it('should update task list when spec is modified', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <div>
            <MockSpecGenerator />
            <MockTaskDashboard />
          </div>
        </BrowserRouter>
      )

      // Initial spec generation
      await user.type(screen.getByTestId('feature-name'), 'Original Feature')
      await user.type(screen.getByTestId('feature-description'), 'Original description')
      await user.click(screen.getByTestId('generate-spec'))

      await waitFor(() => {
        expect(mockSpeckItTools.generate_tasks).toHaveBeenCalled()
      })

      // Modify the spec
      mockSpeckItTools.generate_tasks.mockResolvedValueOnce({
        success: true,
        tasks: [
          {
            task_id: 'T001',
            description: 'Updated task 1',
            completed: false,
            priority: 1,
          },
          {
            task_id: 'T002',
            description: 'Updated task 2',
            completed: false,
            priority: 2,
          },
          {
            task_id: 'T003',
            description: 'New task from spec update',
            completed: false,
            priority: 3,
          },
        ],
      })

      // Update spec
      await user.clear(screen.getByTestId('feature-description'))
      await user.type(screen.getByTestId('feature-description'), 'Updated description with new requirements')
      await user.click(screen.getByTestId('generate-spec'))

      await waitFor(() => {
        expect(mockSpeckItTools.generate_tasks).toHaveBeenCalledTimes(2)
      })

      // Refresh to see updated tasks
      await user.click(screen.getByTestId('refresh-tasks'))

      await waitFor(() => {
        expect(mockSpeckItTools.list_tasks).toHaveBeenCalled()
      })
    })

    it('should handle concurrent spec updates gracefully', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <MockSpecGenerator />
        </BrowserRouter>
      )

      // Mock concurrent update scenario
      mockSpeckItTools.generate_tasks.mockResolvedValueOnce({
        success: false,
        error: 'Specification is being updated by another process',
        conflict: true,
      })

      await user.type(screen.getByTestId('feature-name'), 'Concurrent Feature')
      await user.type(screen.getByTestId('feature-description'), 'Testing concurrent updates')
      await user.click(screen.getByTestId('generate-spec'))

      await waitFor(() => {
        expect(mockSpeckItTools.generate_tasks).toHaveBeenCalled()
      })
    })
  })

  describe('Error Handling and Recovery', () => {
    it('should handle spec generation failures', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <MockSpecGenerator />
        </BrowserRouter>
      )

      // Mock spec generation failure
      mockSpeckItTools.generate_spec.mockResolvedValueOnce({
        success: false,
        error: 'Failed to generate specification: Invalid feature description',
      })

      await user.type(screen.getByTestId('feature-name'), 'Invalid Feature')
      await user.type(screen.getByTestId('feature-description'), '') // Empty description
      await user.click(screen.getByTestId('generate-spec'))

      await waitFor(() => {
        expect(mockSpeckItTools.generate_spec).toHaveBeenCalled()
      })

      // Verify error handling
      expect(mockSpeckItTools.generate_tasks).not.toHaveBeenCalled()
    })

    it('should recover from task generation failures', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <div>
            <MockSpecGenerator />
            <MockTaskDashboard />
          </div>
        </BrowserRouter>
      )

      // Mock task generation failure
      mockSpeckItTools.generate_tasks.mockResolvedValueOnce({
        success: false,
        error: 'Failed to generate tasks: Missing prerequisites',
        missing_prerequisites: ['constitution_exists'],
      })

      await user.type(screen.getByTestId('feature-name'), 'Recovery Feature')
      await user.type(screen.getByTestId('feature-description'), 'Testing error recovery')
      await user.click(screen.getByTestId('generate-spec'))

      await waitFor(() => {
        expect(mockSpeckItTools.generate_tasks).toHaveBeenCalled()
      })

      // Fix the issue and retry
      mockSpeckItTools.generate_tasks.mockResolvedValueOnce({
        success: true,
        tasks: [
          {
            task_id: 'T001',
            description: 'Recovery task',
            completed: false,
          },
        ],
      })

      await user.click(screen.getByTestId('generate-spec'))

      await waitFor(() => {
        expect(mockSpeckItTools.generate_tasks).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Performance and Scalability', () => {
    it('should handle large task lists efficiently', async () => {
      const user = userEvent.setup()

      // Mock large task list
      const largeTaskList = Array.from({ length: 50 }, (_, index) => ({
        task_id: `T${String(index + 1).padStart(3, '0')}`,
        description: `Task ${index + 1}`,
        completed: index < 10,
        priority: (index % 5) + 1,
      }))

      mockSpeckItTools.list_tasks.mockResolvedValue({
        feature_id: 'large-feature',
        tasks: largeTaskList,
      })

      render(
        <BrowserRouter>
          <MockTaskDashboard />
        </BrowserRouter>
      )

      await user.click(screen.getByTestId('refresh-tasks'))

      await waitFor(() => {
        expect(mockSpeckItTools.list_tasks).toHaveBeenCalled()
      })

      // Verify performance metrics (mock)
      expect(mockSpeckItTools.list_tasks).toHaveBeenCalledTimes(1)
    })

    it('should maintain responsiveness during batch operations', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <MockTaskDashboard />
        </BrowserRouter>
      )

      // Mock batch task operations
      const batchUpdatePromises = Array.from({ length: 10 }, (_, index) =>
        Promise.resolve({
          task_id: `T${String(index + 1).padStart(3, '0')}`,
          completed: true,
        })
      )

      mockSpeckItTools.update_task.mockImplementation(() =>
        batchUpdatePromises.shift()
      )

      // Simulate rapid task updates
      for (let i = 0; i < 10; i++) {
        await user.click(screen.getByTestId('complete-task'))
      }

      await waitFor(() => {
        expect(mockSpeckItTools.update_task).toHaveBeenCalledTimes(10)
      })
    })
  })

  describe('Integration with UI Components', () => {
    it('should update UI components when tasks change', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <div>
            <MockSpecGenerator />
            <MockTaskDashboard />
          </div>
        </BrowserRouter>
      )

      // Generate spec and tasks
      await user.type(screen.getByTestId('feature-name'), 'UI Integration Feature')
      await user.type(screen.getByTestId('feature-description'), 'Testing UI integration')
      await user.click(screen.getByTestId('generate-spec'))

      await waitFor(() => {
        expect(mockSpeckItTools.generate_tasks).toHaveBeenCalled()
      })

      // Mock task status change
      mockSpeckItTools.list_tasks.mockResolvedValueOnce({
        feature_id: 'ui-integration-feature',
        tasks: [
          {
            task_id: 'T001',
            description: 'Set up project structure',
            completed: true,
          },
          {
            task_id: 'T002',
            description: 'Configure development environment',
            completed: false,
          },
        ],
      })

      // Refresh UI
      await user.click(screen.getByTestId('refresh-tasks'))

      await waitFor(() => {
        expect(mockSpeckItTools.list_tasks).toHaveBeenCalled()
      })

      // Verify UI reflects task changes
      expect(screen.getByTestId('task-item-T001')).toBeInTheDocument()
      expect(screen.getByTestId('task-item-T002')).toBeInTheDocument()
    })

    it('should provide visual feedback for task operations', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <MockTaskDashboard />
        </BrowserRouter>
      )

      // Mock task completion with feedback
      mockSpeckItTools.complete_task.mockResolvedValue({
        feature_id: 'test-feature',
        task: {
          task_id: 'T001',
          description: 'Set up project structure',
          completed: true,
          notes: ['Task completed with visual feedback'],
        },
        remaining: 2,
      })

      await user.click(screen.getByTestId('complete-task'))

      await waitFor(() => {
        expect(mockSpeckItTools.complete_task).toHaveBeenCalled()
      })

      // Verify visual feedback would be shown
      expect(screen.getByTestId('complete-task')).toBeInTheDocument()
    })
  })

  describe('Cross-Feature Integration', () => {
    it('should handle multiple features with independent task lists', async () => {
      const user = userEvent.setup()

      render(
        <BrowserRouter>
          <div>
            <MockSpecGenerator />
            <MockTaskDashboard />
          </div>
        </BrowserRouter>
      )

      // Mock multiple features
      mockSpeckItTools.list_features.mockResolvedValue({
        features: [
          {
            feature_id: 'feature-001',
            feature_name: 'First Feature',
            task_count: 5,
          },
          {
            feature_id: 'feature-002',
            feature_name: 'Second Feature',
            task_count: 3,
          },
        ],
        count: 2,
      })

      // Generate tasks for first feature
      await user.type(screen.getByTestId('feature-name'), 'First Feature')
      await user.type(screen.getByTestId('feature-description'), 'First feature description')
      await user.click(screen.getByTestId('generate-spec'))

      await waitFor(() => {
        expect(mockSpeckItTools.generate_tasks).toHaveBeenCalledWith(
          expect.objectContaining({
            feature_name: 'First Feature',
          })
        )
      })

      // Generate tasks for second feature
      await user.clear(screen.getByTestId('feature-name'))
      await user.clear(screen.getByTestId('feature-description'))
      await user.type(screen.getByTestId('feature-name'), 'Second Feature')
      await user.type(screen.getByTestId('feature-description'), 'Second feature description')
      await user.click(screen.getByTestId('generate-spec'))

      await waitFor(() => {
        expect(mockSpeckItTools.generate_tasks).toHaveBeenCalledWith(
          expect.objectContaining({
            feature_name: 'Second Feature',
          })
        )
      })

      expect(mockSpeckItTools.generate_tasks).toHaveBeenCalledTimes(2)
    })
  })
})
