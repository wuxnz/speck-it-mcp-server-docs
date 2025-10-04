import { Button } from '@/components/ui/button';
import { DocumentationLayout } from '@/src/components/DocumentationLayout';
import { Code, Github, MessageSquare, Users } from 'lucide-react';

type GuidelineObject = {
  title: string;
  description: string;
  items: string[];
};

type ContributingSection = {
  title: string;
  description: string;
  steps?: any[];
  guidelines?: (string | GuidelineObject)[];
  process?: any[];
  reviewSteps?: string[];
};

function isStringArray(arr: any[]): arr is string[] {
  return arr.length > 0 && typeof arr[0] === 'string';
}

function isGuidelineObjectArray(arr: any[]): arr is GuidelineObject[] {
  return (
    arr.length > 0 &&
    typeof arr[0] === 'object' &&
    arr[0] !== null &&
    'title' in arr[0] &&
    'description' in arr[0] &&
    'items' in arr[0]
  );
}

const contributingSections: ContributingSection[] = [
  {
    title: 'Getting Started',
    description: 'How to set up your development environment and start contributing.',
    steps: [
      {
        title: 'Fork the Repository',
        description: 'Fork the repository on GitHub and clone your fork locally.',
        code: 'git clone https://github.com/wuxnz/speck-it-mcp-server.git',
      },
      {
        title: 'Create a Feature Branch',
        description: 'Create a new branch for your contribution.',
        code: 'git checkout -b feature/your-feature-name',
      },
      {
        title: 'Install Dependencies',
        description: 'Install the required dependencies for development.',
        code: 'uv add --requirements requirements.txt',
      },
      {
        title: 'Start Development',
        description: 'Run the development server to test your changes.',
        code: 'uv dev',
      },
    ],
  },
  {
    title: 'Development Workflow',
    description: 'Best practices for contributing to the project.',
    guidelines: [
      {
        title: 'Code Style',
        description: 'Follow the existing coding patterns and conventions.',
        items: [
          'Thouroughly explain what your PR does',
          'Write descriptive commit messages',
          'Include proper documentation',
        ],
      },
      {
        title: 'Testing',
        description: 'Ensure your changes are properly tested.',
        items: [
          'Ensure that your feature works as intended',
          'Test your changes with at least 3 different models',
          '(If Possible) Test your changes on two different agents',
        ],
      },
      {
        title: 'Documentation',
        description: 'Keep documentation up to date with your changes.',
        items: [
          'Update API documentation for new tools',
          'Add examples for new features',
          'Update the README if needed',
          'Document any breaking changes',
        ],
      },
    ],
  },
  {
    title: 'Submitting Changes',
    description: 'How to submit your contributions for review.',
    process: [
      {
        title: 'Commit Your Changes',
        description: 'Commit your changes with a clear message.',
        code: 'git commit -m "feat: add new feature description"',
      },
      {
        title: 'Push to Your Fork',
        description: 'Push your changes to your forked repository.',
        code: 'git push origin feature/your-feature-name',
      },
      {
        title: 'Create a Pull Request',
        description: 'Create a pull request on the original repository.',
        items: [
          'Provide a clear title and description',
          'Link any relevant issues',
          'Include screenshots if applicable',
          'Request review from maintainers',
        ],
      },
    ],
  },
  {
    title: 'Code Review Process',
    description: 'What happens after you submit a pull request.',
    reviewSteps: [
      'Automated checks run (linting, formatting, tests)',
      'Maintainers will review your code for quality and correctness',
      'Feedback is provided for any required changes',
      'Once approved, your PR is merged into the main branch',
    ],
  },
  {
    title: 'Community Guidelines',
    description: 'How we work together as a community.',
    guidelines: [
      'Be respectful and inclusive in all interactions',
      'Provide constructive feedback and suggestions',
      'Help others who are learning or struggling',
      'Follow the code of conduct',
      'Focus on what is best for the community',
    ],
  },
];

function StepCard({ step }: { step: any }) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <h4 className="font-semibold">{step.title}</h4>
      <p className="text-sm text-muted-foreground">{step.description}</p>
      {step.code && (
        <div className="bg-muted rounded p-3">
          <code className="text-sm">{step.code}</code>
        </div>
      )}
      {step.items && (
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          {step.items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ContributingPage() {
  return (
    <DocumentationLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Contributing</h1>
          <p className="text-xl text-muted-foreground">
            Learn how to contribute to the Speck-It MCP Server project.
          </p>
        </div>

        <div className="space-y-8">
          {contributingSections.map((section, index) => (
            <div key={index} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{section.title}</h2>
                <p className="text-muted-foreground">{section.description}</p>
              </div>

              {section.steps && (
                <div className="grid gap-4">
                  {section.steps.map((step, stepIndex) => (
                    <StepCard key={stepIndex} step={step} />
                  ))}
                </div>
              )}

              {section.guidelines && isGuidelineObjectArray(section.guidelines) && (
                <div className="grid gap-6 md:grid-cols-2">
                  {section.guidelines.map((guideline, guidelineIndex) => (
                    <div key={guidelineIndex} className="space-y-3 rounded-lg border p-4">
                      <h3 className="font-semibold flex items-center space-x-2">
                        {guideline.title === 'Code Style' && <Code className="h-4 w-4" />}
                        {guideline.title === 'Testing' && <Users className="h-4 w-4" />}
                        {guideline.title === 'Documentation' && (
                          <MessageSquare className="h-4 w-4" />
                        )}
                        <span>{guideline.title}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">{guideline.description}</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {guideline.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {section.process && (
                <div className="space-y-4">
                  {section.process.map((process, processIndex) => (
                    <StepCard key={processIndex} step={process} />
                  ))}
                </div>
              )}

              {section.reviewSteps && (
                <div className="space-y-3">
                  {section.reviewSteps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium mt-0.5">
                        {stepIndex + 1}
                      </div>
                      <p className="text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.guidelines && isStringArray(section.guidelines) && (
                <div className="space-y-3">
                  {section.guidelines.map((guideline, guidelineIndex) => (
                    <div key={guidelineIndex} className="flex items-start space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium mt-0.5">
                        {guidelineIndex + 1}
                      </div>
                      <p className="text-sm">{guideline}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">Getting Help</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-lg font-medium flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Discussions</span>
              </h3>
              <p className="text-muted-foreground">
                Join our GitHub Discussions to ask questions and share ideas.
              </p>
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/wuxnz/speck-it-mcp-server/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View Discussions
                </a>
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Issues</span>
              </h3>
              <p className="text-muted-foreground">
                Report bugs or request features through GitHub Issues.
              </p>
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/wuxnz/speck-it-mcp-server/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Report Issue
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">License</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              This project is licensed under the BSD 3-Clause License. By contributing, you agree
              that your contributions will be licensed under the same license.
            </p>
            <Button variant="outline" asChild>
              <a
                href="https://github.com/wuxnz/speck-it-mcp-server/blob/master/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View License
              </a>
            </Button>
          </div>
        </div>
      </div>
    </DocumentationLayout>
  );
}
