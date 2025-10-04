import { DocumentationLayout } from "@/src/components/DocumentationLayout";
import { BookOpen } from "lucide-react";

export default function GuidesPage() {
  return (
    <DocumentationLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Speck-It Development Workflow
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete step-by-step guide to using Speck-It for project
            development.
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                Complete Speck-It Workflow Guide
              </h2>
              <p className="text-muted-foreground">
                Master the complete Speck-It workflow from project setup to
                implementation.
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none dark:prose-invert">
            <div className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-xl font-semibold">
                  1. Set up a new project with a clear constitution and feature
                  root
                </h3>
                <p>
                  Initialize a new Speck-It project for your application. First,
                  create a project constitution that establishes the core
                  principles for your project goals. Then register the project
                  root directory for feature artifacts storage.
                </p>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">
                    Example Constitution Setup:
                  </h4>
                  <p>
                    Set the constitution of your project using the Speck-It MCP
                    server with these specifications:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <strong>Language:</strong> TypeScript
                    </li>
                    <li>
                      <strong>UI Framework:</strong> Shadcn UI
                    </li>
                    <li>
                      <strong>Code Style:</strong> Prefer efficient and reusable
                      code
                    </li>
                    <li>
                      <strong>Type Safety:</strong> Strong typing throughout
                    </li>
                    <li>
                      <strong>Authentication:</strong> Clerk
                    </li>
                    <li>
                      <strong>Backend:</strong> Convex for auth and payment
                    </li>
                    <li>
                      <strong>Monetization:</strong> Google Ads
                    </li>
                    <li>
                      <strong>State Management:</strong> Zustand (if needed)
                    </li>
                  </ul>
                  <div className="mt-3 p-3 bg-background rounded border">
                    <code className="text-sm">
                      Use the @mcp:speck-it "set_constitution" tool to configure
                      these settings
                    </code>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">
                  2. Ensure the LLM uses auto-update functionality across all
                  workflow stages
                </h3>
                <p>
                  Leverage Speck-It's auto-update capabilities to maintain
                  seamless workflow progression.
                </p>

                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">
                      Feature Specification Generation:
                    </h4>
                    <p>
                      Generate a feature specification for your feature with
                      detailed description using the speck-it mcp server. The
                      system should automatically update project tasks when the
                      spec is generated.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">
                      Implementation Plan Creation:
                    </h4>
                    <p>
                      Use the speck-it mcp server to create an implementation
                      plan for your feature with appropriate tech context
                      (frameworks/languages). Auto-update task statuses when
                      plan is complete.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">
                      TDD-Oriented Task Generation:
                    </h4>
                    <p>
                      Generate TDD-oriented tasks from the implementation plan
                      for your feature using the speck-it mcp server. The system
                      should automatically mark planning tasks as complete and
                      unlock implementation tasks.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">
                  3. Use the manage_project_tasks function for comprehensive
                  task operations
                </h3>
                <p>
                  Utilize the powerful task management capabilities of Speck-It
                  for comprehensive project oversight.
                </p>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">
                    Task Creation with Metadata:
                  </h4>
                  <p>
                    Use the speck-it mcp server to create a new project task for
                    your feature with detailed specifications:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                      <strong>Task Description:</strong> Clear, actionable task
                      description
                    </li>
                    <li>
                      <strong>Priority:</strong> Set priority level (1-10)
                    </li>
                    <li>
                      <strong>Task Type:</strong> Choose from workflow, spec,
                      plan, implementation, validation, or custom
                    </li>
                    <li>
                      <strong>Prerequisites:</strong> Define any prerequisite
                      conditions
                    </li>
                    <li>
                      <strong>Estimated Hours:</strong> Set time estimates for
                      planning
                    </li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">
                  4. Complete Implementation
                </h3>
                <p>
                  Execute the complete task list using the speck-it mcp server's
                  comprehensive task management system.
                </p>

                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2">Task Execution Workflow:</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Review the complete task list with all dependencies</li>
                    <li>Execute tasks in the recommended sequence</li>
                    <li>Update task completion status as you progress</li>
                    <li>Add notes for execution traceability</li>
                    <li>Monitor auto-updates as workflow stages complete</li>
                    <li>Finalize the feature when all tasks are complete</li>
                  </ol>
                </div>
              </section>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">
                  Key Benefits of This Workflow
                </h3>
                <ul className="space-y-2">
                  <li>
                    ✅ <strong>Automated Progression:</strong> Tasks
                    automatically unlock as prerequisites are met
                  </li>
                  <li>
                    ✅ <strong>Traceability:</strong> Complete audit trail of
                    all decisions and implementations
                  </li>
                  <li>
                    ✅ <strong>Quality Assurance:</strong> TDD-oriented approach
                    ensures robust development
                  </li>
                  <li>
                    ✅ <strong>Efficiency:</strong> Auto-update functionality
                    reduces manual overhead
                  </li>
                  <li>
                    ✅ <strong>Flexibility:</strong> Custom task types and
                    priorities adapt to project needs
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocumentationLayout>
  );
}
