import { Button } from '@/components/ui/button';
import { DocumentationLayout } from '@/src/components/DocumentationLayout';
import { ArrowRight, BookOpen, Code, Github, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <DocumentationLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Speck-It MCP Server</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive MCP server for feature-driven development with automated specification
            generation, task management, and implementation tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/installation">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link
                href="https://github.com/wuxnz/speck-it-mcp-server"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Specification Generation</h3>
            </div>
            <p className="text-muted-foreground">
              Automatically generate detailed feature specifications from user descriptions with
              clear requirements and acceptance criteria.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Task Management</h3>
            </div>
            <p className="text-muted-foreground">
              Break down features into actionable tasks with dependencies, priorities, and progress
              tracking using TDD methodology.
            </p>
          </div>

          <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">Team Collaboration</h3>
            </div>
            <p className="text-muted-foreground">
              Enable teams to work together with shared specifications, task assignments, and
              real-time progress updates.
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="space-y-6 py-12 border-t">
          <h2 className="text-2xl font-bold text-center">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Documentation</h3>
              <ul className="space-y-2 text-center">
                <li>
                  <Link href="/installation" className="text-primary hover:underline">
                    Installation Guide
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-primary hover:underline">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/guide" className="text-primary hover:underline">
                    User Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Community</h3>
              <ul className="space-y-2 text-center">
                <li>
                  <Link href="/contributing" className="text-primary hover:underline">
                    Contributing Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/examples" className="text-primary hover:underline">
                    Examples
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/wuxnz/speck-it-mcp-server/issues"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Report Issues
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DocumentationLayout>
  );
}
