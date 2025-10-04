'use client';

import { Button } from '@/components/ui/button';
import { DocumentationLayout } from '@/src/components/DocumentationLayout';
import { Check, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const examples = [
  {
    title: 'Web Development Project',
    description: 'Complete example of building a React application with Speck-It.',
    difficulty: 'Beginner',
    tags: ['React', 'TypeScript', 'Web'],
    githubUrl: 'https://github.com/example/react-speck-it',
    demoUrl: 'https://demo.example.com',
    setup: [
      'Initialize project with constitution',
      'Create feature for user authentication',
      'Generate API integration tasks',
      'Implement responsive design',
    ],
    codeExample: `{
  "constitution": "Build a modern React application with user authentication, responsive design, and best practices.",
  "features": [
    "User authentication system",
    "Responsive UI components",
    "API integration layer",
    "State management with Zustand"
  ]
}`,
  },
  {
    title: 'CLI Tool Development',
    description: 'Build a command-line tool using Speck-It for project management.',
    difficulty: 'Intermediate',
    tags: ['CLI', 'Node.js', 'TypeScript'],
    githubUrl: 'https://github.com/example/cli-speck-it',
    demoUrl: null,
    setup: [
      'Set up CLI project structure',
      'Create command parsing features',
      'Implement configuration management',
      'Add help and documentation',
    ],
    codeExample: `{
  "constitution": "Create a powerful CLI tool for project scaffolding and management.",
  "features": [
    "Command-line interface",
    "Project templates",
    "Configuration management",
    "Plugin system"
  ]
}`,
  },
  {
    title: 'API Service',
    description: 'Develop a REST API service with comprehensive Speck-It integration.',
    difficulty: 'Advanced',
    tags: ['API', 'Node.js', 'Database'],
    githubUrl: 'https://github.com/example/api-speck-it',
    demoUrl: 'https://api.example.com',
    setup: [
      'Design API architecture',
      'Implement authentication middleware',
      'Create database models',
      'Add comprehensive testing',
    ],
    codeExample: `{
  "constitution": "Build a scalable REST API service with authentication, database integration, and comprehensive testing.",
  "features": [
    "RESTful API endpoints",
    "JWT authentication",
    "PostgreSQL integration",
    "Comprehensive test suite"
  ]
}`,
  },
  {
    title: 'Mobile App Development',
    description: 'Create a mobile application using React Native with Speck-It.',
    difficulty: 'Intermediate',
    tags: ['Mobile', 'React Native', 'TypeScript'],
    githubUrl: 'https://github.com/example/mobile-speck-it',
    demoUrl: null,
    setup: [
      'Initialize React Native project',
      'Create navigation structure',
      'Implement state management',
      'Add platform-specific features',
    ],
    codeExample: `{
  "constitution": "Develop a cross-platform mobile application with native features and smooth user experience.",
  "features": [
    "Cross-platform UI",
    "Navigation system",
    "Offline support",
    "Push notifications"
  ]
}`,
  },
];

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group">
      <pre className="bg-muted rounded-lg p-4 overflow-x-auto">
        <code className={`text-sm language-${language}`}>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={copyToClipboard}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">Copy code</span>
      </Button>
    </div>
  );
}

function ExampleCard({ example }: { example: any }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{example.title}</h3>
          <p className="text-sm text-muted-foreground">{example.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(example.difficulty)}`}
          >
            {example.difficulty}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {example.tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Setup Steps:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          {example.setup.map((step: string, index: number) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Example Constitution:</h4>
        <CodeBlock code={example.codeExample} />
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" asChild>
          <a href={example.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            View Code
          </a>
        </Button>
        {example.demoUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={example.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Live Demo
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function ExamplesPage() {
  return (
    <DocumentationLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Examples</h1>
          <p className="text-xl text-muted-foreground">
            Real-world examples showcasing Speck-It in action across different project types.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Featured Examples</h2>
            <p className="text-muted-foreground">(Coming Soon...)</p>
          </div>
        </div>

        {/* <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Featured Examples</h2>
            <p className="text-muted-foreground">
              Explore these comprehensive examples to learn how Speck-It can be applied to various
              projects.
            </p>
          </div>

          <div className="grid gap-6">
            {examples.map((example, index) => (
              <ExampleCard key={index} example={example} />
            ))}
          </div>
        </div> */}

        {/* <div className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">Quick Start Examples</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 rounded-lg border p-4">
              <Terminal className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-medium">Hello World</h3>
              <p className="text-sm text-muted-foreground">
                The simplest example to get you started with Speck-It.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Get Started
              </Button>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <Code className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-medium">Template Generator</h3>
              <p className="text-sm text-muted-foreground">
                Generate project templates for different frameworks and use cases.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Generate Template
              </Button>
            </div>
          </div>
        </div> */}

        {/* <div className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">Community Examples</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Discover examples created by the Speck-It community. These projects showcase
              innovative ways to use Speck-IT in real-world scenarios.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 rounded-lg border p-4">
                <h3 className="font-medium">E-commerce Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Full-stack e-commerce solution with Speck-It.
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>by @community-user</span>
                  <span>•</span>
                  <span>2 days ago</span>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border p-4">
                <h3 className="font-medium">IoT Dashboard</h3>
                <p className="text-sm text-muted-foreground">Real-time IoT monitoring dashboard.</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>by @dev-explorer</span>
                  <span>•</span>
                  <span>1 week ago</span>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border p-4">
                <h3 className="font-medium">Data Pipeline</h3>
                <p className="text-sm text-muted-foreground">
                  ETL pipeline with Speck-It orchestration.
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>by @data-engineer</span>
                  <span>•</span>
                  <span>2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline">View More Community Examples</Button>
        </div> */}

        <div className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">Submit Your Example</h2>
          <div className="space-y-4 rounded-lg border p-6">
            <p className="text-muted-foreground">
              Have you built something amazing with Speck-It? Share your example with the community!
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium">What to Include:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Clear project description</li>
                  <li>Step-by-step setup instructions</li>
                  <li>Code examples and configurations</li>
                  <li>Live demo or screenshots</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Benefits:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Showcase your work to the community</li>
                  <li>Help others learn Speck-It</li>
                  <li>Get feedback and improvement suggestions</li>
                  <li>Contribute to the ecosystem</li>
                </ul>
              </div>
            </div>

            <Link
              href="https://github.com/wuxnz/speck-it-mcp-server/discussions/new?category=examples"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Submit Your Example</Button>
            </Link>
          </div>
        </div>
      </div>
    </DocumentationLayout>
  );
}
