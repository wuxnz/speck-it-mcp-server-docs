import { DocumentationLayout } from '@/src/components/DocumentationLayout';
import { BookOpen, Terminal } from 'lucide-react';

const apiSections = [
  {
    title: 'Workspace Setup',
    description: 'Tools for setting up and managing your project workspace.',
    tools: [
      {
        name: 'set_constitution',
        description: 'Create or update the project constitution used for downstream planning.',
        parameters: [
          { name: 'content', type: 'string', required: true, description: 'Constitution content' },
          { name: 'mode', type: 'string', required: false, description: 'Replace or append mode' },
          { name: 'root', type: 'string', required: false, description: 'Project root path' },
        ],
      },
      {
        name: 'get_constitution',
        description: 'Retrieve the current constitution contents, if any.',
        parameters: [
          { name: 'root', type: 'string', required: false, description: 'Project root path' },
        ],
      },
      {
        name: 'set_feature_root',
        description: 'Register the project root that owns the feature artifacts.',
        parameters: [
          { name: 'feature_id', type: 'string', required: true, description: 'Feature identifier' },
          { name: 'root', type: 'string', required: true, description: 'Project root path' },
        ],
      },
    ],
  },
  {
    title: 'Specification Pipeline',
    description: 'Tools for generating specifications, plans, and tasks.',
    tools: [
      {
        name: 'generate_spec',
        description: 'Create a specification artifact for the provided feature description.',
        parameters: [
          { name: 'feature_name', type: 'string', required: true, description: 'Feature name' },
          {
            name: 'description',
            type: 'string',
            required: true,
            description: 'Feature description',
          },
          {
            name: 'feature_id',
            type: 'string',
            required: false,
            description: 'Feature identifier',
          },
          { name: 'root', type: 'string', required: false, description: 'Project root path' },
          { name: 'save', type: 'boolean', required: false, description: 'Save to file' },
        ],
      },
      {
        name: 'generate_plan',
        description: 'Render an implementation plan using the previously generated spec.',
        parameters: [
          { name: 'feature_id', type: 'string', required: true, description: 'Feature identifier' },
          {
            name: 'tech_context',
            type: 'string',
            required: false,
            description: 'Technical context',
          },
          { name: 'root', type: 'string', required: false, description: 'Project root path' },
          { name: 'save', type: 'boolean', required: false, description: 'Save to file' },
        ],
      },
      {
        name: 'generate_tasks',
        description: 'Create a TDD-oriented task list from the existing plan.',
        parameters: [
          { name: 'feature_id', type: 'string', required: true, description: 'Feature identifier' },
          { name: 'root', type: 'string', required: false, description: 'Project root path' },
          { name: 'save', type: 'boolean', required: false, description: 'Save to file' },
        ],
      },
    ],
  },
  {
    title: 'Task Management',
    description: 'Tools for managing and tracking task execution.',
    tools: [
      {
        name: 'manage_project_tasks',
        description:
          'Comprehensive project task management with dependencies and progress tracking.',
        parameters: [
          { name: 'action', type: 'string', required: true, description: 'Action to perform' },
          {
            name: 'feature_id',
            type: 'string',
            required: false,
            description: 'Feature identifier',
          },
          { name: 'task_id', type: 'string', required: false, description: 'Task identifier' },
          { name: 'description', type: 'string', required: false, description: 'Task description' },
          { name: 'priority', type: 'number', required: false, description: 'Task priority' },
          { name: 'status', type: 'string', required: false, description: 'Task status' },
        ],
      },
      {
        name: 'list_tasks',
        description: 'Return the task checklist for a feature, including completion state.',
        parameters: [
          { name: 'feature_id', type: 'string', required: true, description: 'Feature identifier' },
          { name: 'root', type: 'string', required: false, description: 'Project root path' },
        ],
      },
      {
        name: 'update_task',
        description: 'Update task completion or append notes for execution traceability.',
        parameters: [
          { name: 'feature_id', type: 'string', required: true, description: 'Feature identifier' },
          { name: 'task_id', type: 'string', required: true, description: 'Task identifier' },
          {
            name: 'completed',
            type: 'boolean',
            required: false,
            description: 'Task completion status',
          },
          { name: 'note', type: 'string', required: false, description: 'Task notes' },
          { name: 'root', type: 'string', required: false, description: 'Project root path' },
        ],
      },
    ],
  },
  {
    title: 'Resources',
    description: 'Available resources for accessing project information.',
    resources: [
      {
        name: 'speck-it://features',
        description: 'Resource view exposing generated feature metadata for discovery.',
      },
    ],
  },
];

function ToolCard({ tool }: { tool: any }) {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="flex items-center space-x-2">
        <Terminal className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold font-mono">{tool.name}</h3>
      </div>

      <p className="text-muted-foreground">{tool.description}</p>

      {tool.parameters && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Parameters:</h4>
          <div className="space-y-1">
            {tool.parameters.map((param: any, index: number) => (
              <div key={index} className="text-sm">
                <code className="bg-muted px-1 py-0.5 rounded text-xs">{param.name}</code>
                <span className="text-muted-foreground ml-2">
                  {param.type}
                  {param.required && <span className="text-red-500 ml-1">*</span>}
                </span>
                <p className="text-xs text-muted-foreground mt-1">{param.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function APIPage() {
  return (
    <DocumentationLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
          <p className="text-xl text-muted-foreground">
            Complete reference for all Speck-It MCP Server tools and resources.
          </p>
        </div>

        <div className="space-y-8">
          {apiSections.map((section, index) => (
            <div key={index} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p className="text-muted-foreground">{section.description}</p>
              </div>

              <div className="grid gap-4">
                {section.tools?.map((tool, toolIndex) => (
                  <ToolCard key={toolIndex} tool={tool} />
                ))}

                {section.resources?.map((resource, resourceIndex) => (
                  <div key={resourceIndex} className="space-y-4 rounded-lg border p-6">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold font-mono">{resource.name}</h3>
                    </div>
                    <p className="text-muted-foreground">{resource.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">Usage Examples</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Basic Workflow</h3>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <code className="block text-sm">
                  1. Set constitution → 2. Register feature root → 3. Generate spec → 4. Create plan
                  → 5. Generate tasks → 6. Execute tasks
                </code>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">MCP Client Configuration</h3>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm overflow-x-auto">
                  {`{
  "mcpServers": {
    "speck-it": {
      "command": "uv",
      "args": [
        "run",
        "--with",
        "mcp[cli]",
        "mcp",
        "run",
        "<path-to-repo>/main.py"
      ],
    }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">Storage Layout</h2>
          <div className="bg-muted rounded-lg p-4">
            <pre className="text-sm">
              {`.speck-it/
├── memory/
│   └── constitution.md
├── project_tasks/
│   └── project_tasks.json
├── specs/
│   └── <feature-id>/
|       ├── analysis.json
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── analysis.json
└── state/
    └── <feature-id>_status.json`}
            </pre>
          </div>
          <p className="text-sm text-muted-foreground">
            All artifacts are written under the `.speck-it/` directory by default. Use the
            `SPECKIT_STORAGE_DIR` environment variable to customize the storage location.
          </p>
        </div>
      </div>
    </DocumentationLayout>
  );
}
