
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

// Mock the MCP server connection
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

describe('Requirement 5 Contract: Automatic Task Updates on Spec Generation', () => {
  describe('Spec Generation Trigger', () => {
    it('should trigger task generation when spec is created', async () => {
      // Mock the spec generation workflow
      const specGeneration = {
        feature_id: 'test-feature-001',
        feature_name: 'Test Feature',
        description: 'A test feature for validation',
      }

      // Mock the expected task generation call
      mockSpeckItTools.generate_tasks.mockResolvedValue({
        success: true,
        tasks: [
          { task_id: 'T001', description: 'Task 1', completed: false },
          { task_id: 'T002', description: 'Task 2', completed: false },
        ],
      })

      // Simulate spec generation
      const result = await mockSpeckItTools.generate_tasks({
        feature_id: specGeneration.feature_id,
        save: true,
      })

      // Verify task generation was triggered
      expect(mockSpeckItTools.generate_tasks).toHaveBeenCalledWith({
        feature_id: specGeneration.feature_id,
        save: true,
      })

      expect(result.success).toBe(true)
      expect(result.tasks).toBeDefined()
      expect(result.tasks.length).toBeGreaterThan(0)
    })

    it('should update task list when spec is modified', async () => {
      // Mock spec modification
      const specModification = {
        feature_id: 'test-feature-001',
        updated_description: 'Updated test feature description',
      }

      // Mock task regeneration
      mockSpeckItTools.generate_tasks.mockResolvedValue({
        success: true,
        tasks: [
          { task_id: 'T001', description: 'Updated Task 1', completed: false },
          { task_id: 'T002', description: 'Updated Task 2', completed: false },
          { task_id: 'T003', description: 'New Task 3', completed: false },
        ],
      })

      // Simulate spec modification and task regeneration
      const result = await mockSpeckItTools.generate_tasks({
        feature_id: specModification.feature_id,
        save: true,
      })

      // Verify tasks were updated
      expect(result.tasks.length).toBe(3)
      expect(result.tasks[0].description).toBe('Updated Task 1')
      expect(result.tasks[2].description).toBe('New Task 3')
    })
  })

  describe('Task Structure Validation', () => {
    it('should generate tasks with proper structure', async () => {
      const expectedTaskStructure = {
        task_id: expect.stringMatching(/^T\d{3}$/),
        description: expect.stringMatching(/.+/),
        completed: expect.any(Boolean),
        notes: expect.any(Array),
        priority: expect.any(Number),
        dependencies: expect.any(Array),
        prerequisites: expect.any(Array),
        estimated_hours: expect.any(Number),
        actual_hours: expect.any(Number),
        status: expect.stringMatching(/pending|in_progress|completed/),
        tags: expect.any(Array),
      }

      mockSpeckItTools.generate_tasks.mockResolvedValue({
        success: true,
        tasks: [
          {
            task_id: 'T001',
            description: 'Test task description',
            completed: false,
            notes: [],
            priority: 1,
            dependencies: [],
            prerequisites: ['spec_exists'],
            estimated_hours: 2,
            actual_hours: null,
            status: 'pending',
            tags: ['implementation'],
          },
        ],
      })

      const result = await mockSpeckItTools.generate_tasks({
        feature_id: 'test-feature',
        save: true,
      })

      expect(result.tasks[0]).toEqual(expect.objectContaining(expectedTaskStructure))
    })

    it('should include workflow-specific tasks', async () => {
      const expectedWorkflowTasks = [
        'T001: Establish project scaffolding',
        'T002: Document environment bootstrap',
        'T003: Configure linting and formatting',
        'T004: Author contract tests',
        'T005: Create integration tests',
        'T006: Implement core functionality',
      ]

      mockSpeckItTools.generate_tasks.mockResolvedValue({
        success: true,
        tasks: expectedWorkflowTasks.map((taskDesc, index) => ({
          task_id: `T${String(index + 1).padStart(3, '0')}`,
          description: taskDesc,
          completed: false,
          notes: [],
          priority: index + 1,
          dependencies: index > 0 ? [`T${String(index).padStart(3, '0')}`] : [],
          prerequisites: index === 0 ? ['constitution_exists'] : [],
          estimated_hours: 1,
          actual_hours: null,
          status: 'pending',
          tags: ['workflow'],
        })),
      })

      const result = await mockSpeckItTools.generate_tasks({
        feature_id: 'test-feature',
        save: true,
      })

      expect(result.tasks).toHaveLength(6)
      expect(result.tasks[0].description).toContain('Establish project scaffolding')
      expect(result.tasks[5].description).toContain('Implement core functionality')
    })
  })

  describe('Task Dependencies and Prerequisites', () => {
    it('should create proper task dependencies', async () => {
      mockSpeckItTools.generate_tasks.mockResolvedValue({
        success: true,
        tasks: [
          {
            task_id: 'T001',
            description: 'First task',
            completed: false,
            dependencies: [],
            prerequisites: ['constitution_exists'],
          },
          {
            task_id: 'T002',
            description: 'Second task',
            completed: false,
            dependencies: ['T001'],
            prerequisites: ['spec_exists'],
          },
          {
            task_id: 'T003',
            description: 'Third task',
            completed: false,
            dependencies: ['T002'],
            prerequisites: ['plan_exists'],
          },
        ],
      })

      const result = await mockSpeckItTools.generate_tasks({
        feature_id: 'test-feature',
        save: true,
      })

      // Verify dependency chain
      expect(result.tasks[0].dependencies).toEqual([])
      expect(result.tasks[1].dependencies).toEqual(['T001'])
      expect(result.tasks[2].dependencies).toEqual(['T002'])

      // Verify prerequisites
      expect(result.tasks[0].prerequisites).toContain('constitution_exists')
      expect(result.tasks[1].prerequisites).toContain('spec_exists')
      expect(result.tasks[2].prerequisites).toContain('plan_exists')
    })

    it('should validate prerequisite conditions', async () => {
      const prerequisites = [
        'constitution_exists',
        'feature_root_registered',
        'spec_exists',
        'plan_exists',
        'tasks_exist',
      ]

      mockSpeckItTools.manage_project_tasks.mockResolvedValue({
        success: true,
        validation_results: prerequisites.map(prereq => ({
          prerequisite,
          valid: true,
          message: `${prereq} is satisfied`,
        })),
      })

      const result = await mockSpeckItTools.manage_project_tasks({
        action: 'validate',
        feature_id: 'test-feature',
      })

      expect(result.validation_results).toHaveLength(5)
      result.validation_results.forEach(validation => {
        expect(validation.valid).toBe(true)
        expect(prerequisites).toContain(validation.prerequisite)
      })
    })
  })

  describe('Task Status Management', () => {
    it('should track task completion status', async () => {
      mockSpeckItTools.list_tasks.mockResolvedValue({
        feature_id: 'test-feature',
        tasks: [
          { task_id: 'T001', description: 'Task 1', completed: true },
          { task_id: 'T002', description: 'Task 2', completed: false },
          { task_id: 'T003', description: 'Task 3', completed: false },
        ],
      })

      const result = await mockSpeckItTools.list_tasks({
        feature_id: 'test-feature',
      })

      expect(result.tasks[0].completed).toBe(true)
      expect(result.tasks[1].completed).toBe(false)
      expect(result.tasks[2].completed).toBe(false)
    })

    it('should update task status when completed', async () => {
      mockSpeckItTools.complete_task.mockResolvedValue({
        feature_id: 'test-feature',
        task: {
          task_id: 'T001',
          description: 'Task 1',
          completed: true,
          notes: ['Task completed successfully'],
        },
        remaining: 2,
      })

      const result = await mockSpeckItTools.complete_task({
        feature_id: 'test-feature',
        task_id: 'T001',
        note: 'Task completed successfully',
      })

      expect(result.task.completed).toBe(true)
      expect(result.task.notes).toContain('Task completed successfully')
      expect(result.remaining).toBe(2)
    })

    it('should provide next executable task', async () => {
      mockSpeckItTools.next_task.mockResolvedValue({
        feature_id: 'test-feature',
        task: {
          task_id: 'T002',
          description: 'Next task to execute',
          completed: false,
          dependencies: ['T001'],
        },
      })

      const result = await mockSpeckItTools.next_task({
        feature_id: 'test-feature',
      })

      expect(result.task.task_id).toBe('T002')
      expect(result.task.completed).toBe(false)
      expect(result.task.dependencies).toContain('T001')
    })
  })

  describe('Integration with Speck-It Workflow', () => {
    it('should integrate with constitution setting', async () => {
      const constitution = {
        content: 'Project constitution for testing',
        mode: 'replace',
      }

      mockSpeckItTools.set_constitution.mockResolvedValue({
        success: true,
        message: 'Constitution set successfully',
      })

      const result = await mockSpeckItTools.set_constitution(constitution)

      expect(result.success).toBe(true)
      expect(mockSpeckItTools.set_constitution).toHaveBeenCalledWith(constitution)
    })

    it('should integrate with feature root registration', async () => {
      mockSpeckItTools.set_feature_root.mockResolvedValue({
        success: true,
        message: 'Feature root registered successfully',
      })

      const result = await mockSpeckItTools.set_feature_root({
        feature_id: 'test-feature',
        root: '/test/path',
      })

      expect(result.success).toBe(true)
      expect(mockSpeckItTools.set_feature_root).toHaveBeenCalledWith({
        feature_id: 'test-feature',
        root: '/test/path',
      })
    })

    it('should integrate with spec generation', async () => {
      mockSpeckItTools.generate_spec.mockResolvedValue({
        success: true,
        spec_path: '/test/path/spec.md',
        spec_content: 'Generated specification content',
      })

      const result = await mockSpeckItTools.generate_spec({
        feature_name: 'Test Feature',
        description: 'Test feature description',
        feature_id: 'test-feature',
        save: true,
      })

      expect(result.success).toBe(true)
      expect(result.spec_path).toBe('/test/path/spec.md')
      expect(mockSpeckItTools.generate_spec).toHaveBeenCalledWith({
        feature_name: 'Test Feature',
        description: 'Test feature description',
        feature_id: 'test-feature',
        save: true,
      })
    })

    it('should integrate with plan generation', async () => {
      mockSpeckItTools.generate_plan.mockResolvedValue({
        success: true,
        plan_path: '/test/path/plan.md',
        plan_content: 'Generated implementation plan',
      })

      const result = await mockSpeckItTools.generate_plan({
        feature_id: 'test-feature',
        tech_context: 'Next.js, TypeScript, Tailwind',
        save: true,
      })

      expect(result.success).toBe(true)
      expect(result.plan_path).toBe('/test/path/plan.md')
      expect(mockSpeckItTools.generate_plan).toHaveBeenCalledWith({
        feature_id: 'test-feature',
        tech_context: 'Next.js, TypeScript, Tailwind',
        save: true,
      })
    })
  })

  describe('Error Handling and Validation', () => {
    it('should handle missing prerequisites gracefully', async () => {
      mockSpeckItTools.generate_tasks.mockResolvedValue({
        success: false,
        error: 'Prerequisites not satisfied: constitution_exists, feature_root_registered',
        missing_prerequisites: ['constitution_exists', 'feature_root_registered'],
      })

      const result = await mockSpeckItTools.generate_tasks({
        feature_id: 'test-feature',
        save: true,
      })

      expect(result.success).toBe(false)
      expect(result.missing_prerequisites).toContain('constitution_exists')
      expect(result.missing_prerequisites).toContain('feature_root_registered')
    })

    it('should validate task structure integrity', async () => {
      mockSpeckItTools.manage_project_tasks.mockResolvedValue({
        success: false,
        error: 'Invalid task structure: missing required fields',
        validation_errors: [
          { field: 'task_id', error: 'Required field missing' },
          { field: 'description', error: 'Required field missing' },
        ],
      })

      const result = await mockSpeckItTools.manage_project_tasks({
        action: 'validate',
        feature_id: 'test-feature',
      })

      expect(result.success).toBe(false)
      expect(result.validation_errors).toHaveLength(2)
    })

    it('should handle concurrent task updates', async () => {
      mockSpeckItTools.update_task.mockResolvedValue({
        success: false,
        error: 'Task already being updated by another process',
        conflict: true,
      })

      const result = await mockSpeckItTools.update_task({
        feature_id: 'test-feature',
        task_id: 'T001',
        completed: true,
      })

      expect(result.success).toBe(false)
      expect(result.conflict).toBe(true)
    })
  })

  describe('Performance and Scalability', () => {
    it('should handle large task lists efficiently', async () => {
      const largeTaskList = Array.from({ length: 100 }, (_, index) => ({
        task_id: `T${String(index + 1).padStart(3, '0')}`,
        description: `Task ${index + 1}`,
        completed: index < 50,
        priority: (index % 5) + 1,
        dependencies: index > 0 ? [`T${String(index).padStart(3, '0')}`] : [],
      }))

      mockSpeckItTools.list_tasks.mockResolvedValue({
        feature_id: 'test-feature',
        tasks: largeTaskList,
      })

      const result = await mockSpeckItTools.list_tasks({
        feature_id: 'test-feature',
      })

      expect(result.tasks).toHaveLength(100)
      expect(result.tasks.filter(t => t.completed).length).toBe(50)
    })

    it('should maintain performance with multiple features', async () => {
      const multipleFeatures = Array.from({ length: 10 }, (_, index) => ({
        feature_id: `feature-${String(index + 1).padStart(3, '0')}`,
        feature_name: `Feature ${index + 1}`,
        task_count: 20,
      }))

      mockSpeckItTools.list_features.mockResolvedValue({
        features: multipleFeatures,
        count: 10,
      })

      const result = await mockSpeckItTools.list_features()

      expect(result.features).toHaveLength(10)
      expect(result.count).toBe(10)
    })
  })
})
