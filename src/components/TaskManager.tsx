'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Progress } from '@/src/components/ui/progress';
import { useThemeStore } from '@/src/lib/store';
import { AlertCircle, CheckCircle2, Circle, Clock, Pause, Play, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Task {
  task_id: string;
  description: string;
  completed: boolean;
  notes: string[];
  priority: number;
  dependencies: string[];
  prerequisites: string[];
  estimated_hours?: number;
  actual_hours?: number;
  status: 'pending' | 'in_progress' | 'completed';
  tags: string[];
}

interface Feature {
  feature_id: string;
  feature_name: string;
  spec_path: string;
  plan_path: string;
  tasks_path: string;
  status: 'active' | 'completed' | 'archived';
}

interface TaskManagerProps {
  featureId?: string;
  autoRefresh?: boolean;
  showProgress?: boolean;
}

export default function TaskManager({
  featureId,
  autoRefresh = true,
  showProgress = true,
}: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string>(featureId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(autoRefresh);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useThemeStore();

  // Mock Speck-It MCP server integration
  const mockSpeckItIntegration = {
    async listFeatures(): Promise<Feature[]> {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return [
        {
          feature_id: '001-speck-it-mcp-server-docs',
          feature_name: 'Speck-It MCP Server Documentation Site',
          spec_path: '.speck-it/specs/001-speck-it-mcp-server-docs/spec.md',
          plan_path: '.speck-it/specs/001-speck-it-mcp-server-docs/plan.md',
          tasks_path: '.speck-it/specs/001-speck-it-mcp-server-docs/tasks.md',
          status: 'active' as const,
        },
        {
          feature_id: '002-example-feature',
          feature_name: 'Example Feature',
          spec_path: '.speck-it/specs/002-example-feature/spec.md',
          plan_path: '.speck-it/specs/002-example-feature/plan.md',
          tasks_path: '.speck-it/specs/002-example-feature/tasks.md',
          status: 'active' as const,
        },
      ];
    },

    async listTasks(featureId: string): Promise<Task[]> {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (featureId === '001-speck-it-mcp-server-docs') {
        return [
          {
            task_id: 'T001',
            description:
              'T001 Establish project scaffolding per plan structure (src/, tests/, docs/).',
            completed: true,
            notes: ['Established project scaffolding with src/, tests/, docs/ directories.'],
            priority: 1,
            dependencies: [],
            prerequisites: ['constitution_exists'],
            estimated_hours: 2,
            actual_hours: 1.5,
            status: 'completed',
            tags: ['workflow', 'setup'],
          },
          {
            task_id: 'T002',
            description: 'T002 Document environment bootstrap instructions in quickstart.md.',
            completed: true,
            notes: [
              'Enhanced quickstart.md with comprehensive environment bootstrap instructions.',
            ],
            priority: 2,
            dependencies: ['T001'],
            prerequisites: ['spec_exists'],
            estimated_hours: 3,
            actual_hours: 2,
            status: 'completed',
            tags: ['documentation'],
          },
          {
            task_id: 'T003',
            description: 'T003 [P] Configure linting, formatting, and CI guards.',
            completed: true,
            notes: ['Configured comprehensive linting, formatting, and CI guards.'],
            priority: 3,
            dependencies: ['T002'],
            prerequisites: ['spec_exists'],
            estimated_hours: 4,
            actual_hours: 3,
            status: 'completed',
            tags: ['workflow', 'quality'],
          },
          {
            task_id: 'T004',
            description: 'T004 [P] Author contract test for requirement 1.',
            completed: true,
            notes: ['Created contract test for requirement 1.'],
            priority: 4,
            dependencies: ['T003'],
            prerequisites: ['spec_exists'],
            estimated_hours: 2,
            actual_hours: 1.5,
            status: 'completed',
            tags: ['testing', 'contract'],
          },
          {
            task_id: 'T005',
            description: 'T005 [P] Create integration test for requirement 1.',
            completed: true,
            notes: ['Created integration test for requirement 1.'],
            priority: 5,
            dependencies: ['T004'],
            prerequisites: ['spec_exists'],
            estimated_hours: 3,
            actual_hours: 2,
            status: 'completed',
            tags: ['testing', 'integration'],
          },
          {
            task_id: 'T006',
            description:
              'T006 Implement functionality for requirement 1 in src/ with corresponding unit tests.',
            completed: true,
            notes: ['Implemented core functionality for requirement 1.'],
            priority: 6,
            dependencies: ['T005'],
            prerequisites: ['spec_exists', 'plan_exists'],
            estimated_hours: 8,
            actual_hours: 6,
            status: 'completed',
            tags: ['implementation'],
          },
          {
            task_id: 'T007',
            description: 'T007 [P] Author contract test for requirement 2.',
            completed: true,
            notes: ['Created contract test for requirement 2.'],
            priority: 7,
            dependencies: ['T006'],
            prerequisites: ['spec_exists'],
            estimated_hours: 2,
            actual_hours: 1.5,
            status: 'completed',
            tags: ['testing', 'contract'],
          },
          {
            task_id: 'T008',
            description: 'T008 [P] Create integration test for requirement 2.',
            completed: true,
            notes: ['Created integration test for requirement 2.'],
            priority: 8,
            dependencies: ['T007'],
            prerequisites: ['spec_exists'],
            estimated_hours: 3,
            actual_hours: 2,
            status: 'completed',
            tags: ['testing', 'integration'],
          },
          {
            task_id: 'T009',
            description:
              'T009 Implement functionality for requirement 2 in src/ with corresponding unit tests.',
            completed: true,
            notes: ['Implemented functionality for requirement 2.'],
            priority: 9,
            dependencies: ['T008'],
            prerequisites: ['spec_exists', 'plan_exists'],
            estimated_hours: 6,
            actual_hours: 4,
            status: 'completed',
            tags: ['implementation'],
          },
          {
            task_id: 'T010',
            description: 'T010 [P] Author contract test for requirement 3.',
            completed: true,
            notes: ['Created contract test for requirement 3.'],
            priority: 10,
            dependencies: ['T009'],
            prerequisites: ['spec_exists'],
            estimated_hours: 2,
            actual_hours: 1.5,
            status: 'completed',
            tags: ['testing', 'contract'],
          },
          {
            task_id: 'T011',
            description: 'T011 [P] Create integration test for requirement 3.',
            completed: true,
            notes: ['Created integration test for requirement 3.'],
            priority: 11,
            dependencies: ['T010'],
            prerequisites: ['spec_exists'],
            estimated_hours: 3,
            actual_hours: 2,
            status: 'completed',
            tags: ['testing', 'integration'],
          },
          {
            task_id: 'T012',
            description:
              'T012 Implement functionality for requirement 3 in src/ with corresponding unit tests.',
            completed: true,
            notes: ['Implemented functionality for requirement 3.'],
            priority: 12,
            dependencies: ['T011'],
            prerequisites: ['spec_exists', 'plan_exists'],
            estimated_hours: 8,
            actual_hours: 6,
            status: 'completed',
            tags: ['implementation'],
          },
          {
            task_id: 'T013',
            description: 'T013 [P] Author contract test for requirement 4.',
            completed: true,
            notes: ['Created contract test for requirement 4.'],
            priority: 13,
            dependencies: ['T012'],
            prerequisites: ['spec_exists'],
            estimated_hours: 2,
            actual_hours: 1.5,
            status: 'completed',
            tags: ['testing', 'contract'],
          },
          {
            task_id: 'T014',
            description: 'T014 [P] Create integration test for requirement 4.',
            completed: true,
            notes: ['Created integration test for requirement 4.'],
            priority: 14,
            dependencies: ['T013'],
            prerequisites: ['spec_exists'],
            estimated_hours: 3,
            actual_hours: 2,
            status: 'completed',
            tags: ['testing', 'integration'],
          },
          {
            task_id: 'T015',
            description:
              'T015 Implement functionality for requirement 4 in src/ with corresponding unit tests.',
            completed: true,
            notes: ['Implemented functionality for requirement 4.'],
            priority: 15,
            dependencies: ['T014'],
            prerequisites: ['spec_exists', 'plan_exists'],
            estimated_hours: 6,
            actual_hours: 4,
            status: 'completed',
            tags: ['implementation'],
          },
          {
            task_id: 'T016',
            description: 'T016 [P] Author contract test for requirement 5.',
            completed: true,
            notes: ['Created contract test for requirement 5.'],
            priority: 16,
            dependencies: ['T015'],
            prerequisites: ['spec_exists'],
            estimated_hours: 2,
            actual_hours: 1.5,
            status: 'completed',
            tags: ['testing', 'contract'],
          },
          {
            task_id: 'T017',
            description: 'T017 [P] Create integration test for requirement 5.',
            completed: true,
            notes: ['Created integration test for requirement 5.'],
            priority: 17,
            dependencies: ['T016'],
            prerequisites: ['spec_exists'],
            estimated_hours: 3,
            actual_hours: 2,
            status: 'completed',
            tags: ['testing', 'integration'],
          },
          {
            task_id: 'T018',
            description:
              'T018 Implement functionality for requirement 5 in src/ with corresponding unit tests.',
            completed: false,
            notes: [],
            priority: 18,
            dependencies: ['T017'],
            prerequisites: ['spec_exists', 'plan_exists'],
            estimated_hours: 4,
            actual_hours: null,
            status: 'pending',
            tags: ['implementation'],
          },
          {
            task_id: 'T019',
            description:
              'T019 Wire integration paths end-to-end and ensure contract tests fail prior to implementation.',
            completed: false,
            notes: [],
            priority: 19,
            dependencies: ['T018'],
            prerequisites: ['spec_exists', 'plan_exists'],
            estimated_hours: 6,
            actual_hours: null,
            status: 'pending',
            tags: ['integration'],
          },
          {
            task_id: 'T020',
            description: 'T020 Harden error handling, logging, and observability hooks.',
            completed: false,
            notes: [],
            priority: 20,
            dependencies: ['T019'],
            prerequisites: ['spec_exists', 'plan_exists'],
            estimated_hours: 4,
            actual_hours: null,
            status: 'pending',
            tags: ['quality'],
          },
          {
            task_id: 'T021',
            description: 'T021 Document manual validation steps in quickstart.md.',
            completed: false,
            notes: [],
            priority: 21,
            dependencies: ['T020'],
            prerequisites: ['spec_exists', 'plan_exists'],
            estimated_hours: 2,
            actual_hours: null,
            status: 'pending',
            tags: ['documentation'],
          },
          {
            task_id: 'T022',
            description: 'T022 Perform regression run and collect metrics for performance goals.',
            completed: false,
            notes: [],
            priority: 22,
            dependencies: ['T021'],
            prerequisites: ['spec_exists', 'plan_exists'],
            estimated_hours: 3,
            actual_hours: null,
            status: 'pending',
            tags: ['testing', 'quality'],
          },
        ];
      }

      return [];
    },

    async generateSpec(featureName: string, description: string): Promise<void> {
      // Simulate spec generation triggering task updates
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // This would automatically call generate_tasks internally
      // demonstrating the automatic task update functionality
    },

    async updateTask(taskId: string, completed: boolean, note?: string): Promise<void> {
      // Simulate task update
      await new Promise((resolve) => setTimeout(resolve, 200));
    },
  };

  const loadFeatures = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const featuresData = await mockSpeckItIntegration.listFeatures();
      setFeatures(featuresData);

      if (!selectedFeature && featuresData.length > 0) {
        setSelectedFeature(featuresData[0].feature_id);
      }
    } catch (err) {
      setError('Failed to load features');
      console.error('Error loading features:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasks = async () => {
    if (!selectedFeature) return;

    try {
      setIsLoading(true);
      setError(null);
      const tasksData = await mockSpeckItIntegration.listTasks(selectedFeature);
      setTasks(tasksData);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId: string, completed: boolean) => {
    try {
      await mockSpeckItIntegration.updateTask(
        taskId,
        completed,
        `Task marked as ${completed ? 'completed' : 'incomplete'}`
      );
      await loadTasks(); // Refresh tasks to show updated status
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleSpecGeneration = async () => {
    if (!selectedFeature) return;

    try {
      setIsLoading(true);
      setError(null);

      const feature = features.find((f) => f.feature_id === selectedFeature);
      if (feature) {
        await mockSpeckItIntegration.generateSpec(
          feature.feature_name,
          'Auto-generated spec from task manager'
        );
        await loadTasks(); // Refresh tasks to show automatic updates
      }
    } catch (err) {
      setError('Failed to generate specification');
      console.error('Error generating spec:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    loadFeatures();
  }, []);

  useEffect(() => {
    if (selectedFeature) {
      loadTasks();
    }
  }, [selectedFeature]);

  useEffect(() => {
    if (!isAutoRefreshing) return;

    const interval = setInterval(() => {
      loadTasks();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [selectedFeature, isAutoRefreshing]);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 5) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (priority <= 10)
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (priority <= 15)
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Task Manager</CardTitle>
              <CardDescription>
                Automatic task updates when specifications are generated
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoRefreshing(!isAutoRefreshing)}
              >
                {isAutoRefreshing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isAutoRefreshing ? 'Pause' : 'Auto-refresh'}
              </Button>
              <Button variant="outline" size="sm" onClick={loadTasks} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Feature Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Feature</label>
              <select
                value={selectedFeature}
                onChange={(e) => setSelectedFeature(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
                disabled={isLoading}
              >
                <option value="">Choose a feature...</option>
                {features.map((feature) => (
                  <option key={feature.feature_id} value={feature.feature_id}>
                    {feature.feature_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Progress Overview */}
            {showProgress && totalTasks > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {completedTasks}/{totalTasks} tasks completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
              </div>
            )}

            {/* Spec Generation Demo */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSpecGeneration}
                disabled={isLoading || !selectedFeature}
                size="sm"
              >
                Generate Spec (Auto-updates Tasks)
              </Button>
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      {tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tasks ({tasks.length})</CardTitle>
            <CardDescription>Automatically generated from specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.task_id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${
                    task.completed ? 'bg-muted/50' : 'bg-background'
                  }`}
                >
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(task.status)}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleTaskUpdate(task.task_id, e.target.checked)}
                      className="rounded"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-medium">{task.task_id}</span>
                      <Badge className={getPriorityColor(task.priority)}>
                        Priority {task.priority}
                      </Badge>
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm">{task.description}</p>

                    {task.notes.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <ul className="list-disc list-inside space-y-1">
                          {task.notes.map((note, index) => (
                            <li key={index}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {task.estimated_hours && (
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Est: {task.estimated_hours}h</span>
                        {task.actual_hours && <span>Actual: {task.actual_hours}h</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
