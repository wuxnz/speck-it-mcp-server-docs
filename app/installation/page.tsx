'use client';

import { Button } from '@/components/ui/button';
import { DocumentationLayout } from '@/src/components/DocumentationLayout';
import { Check, Copy } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const installationSteps = [
  {
    title: 'Prerequisites',
    description: 'Make sure you have the following installed:',
    items: ['Python 3.10+', 'uv', 'Git'],
  },
  {
    title: 'Clone the Repository',
    description: 'Get the source code from GitHub:',
    code: 'git clone https://github.com/wuxnz/speck-it-mcp-server.git',
  },
  {
    title: 'Install Dependencies',
    description: 'Install the required dependencies:',
    code: 'uv add --requirements requirements.txt',
    // alternatives: [
    //   { label: 'pip', code: 'pip install -r requirements.txt' }, // Example alternative
    //   { label: 'yarn', code: 'yarn install' },
    // ],
  },
  {
    title: 'Run the Development Server',
    description: 'Start the development server to test if it works:',
    code: 'uv dev',
    alternatives: [{ label: 'uv run', code: 'uv run mcp run <path-to-repo>/main.py' }],
  },
  {
    title: 'Configure MCP Client',
    description: 'Add the server to your MCP client configuration:',
    code: `{
  "mcpServers": {
    "speck-it": {
      "command": "uv",
      "args": [
        "run",
        "--with",
        "mcp[cli]",
        "mcp",
        "run",
        "<path-to-repo>/main.py" // Replace with the actual path
      ],
    }
  }
}`,
  },
];

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
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

export default function InstallationPage() {
  return (
    <DocumentationLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Installation</h1>
          <p className="text-xl text-muted-foreground">
            Get started with the Speck-It MCP Server in a few simple steps.
          </p>
        </div>

        <div className="space-y-8">
          {installationSteps.map((step, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {index + 1}
                </div>
                <h2 className="text-2xl font-semibold">{step.title}</h2>
              </div>

              <p className="text-muted-foreground">{step.description}</p>

              {step.items && (
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-8">
                  {step.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              )}

              {step.code && (
                <div className="space-y-3">
                  <CodeBlock code={step.code} />

                  {step.alternatives && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Alternative commands:</p>
                      <div className="grid gap-2 md:grid-cols-2">
                        {step.alternatives.map((alt, altIndex) => (
                          <div key={altIndex} className="space-y-1">
                            <span className="text-sm font-medium">{alt.label}:</span>
                            <CodeBlock code={alt.code} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">Next Steps</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Explore the Documentation</h3>
              <p className="text-muted-foreground">
                Learn about all the features and capabilities of the Speck-It MCP Server.
              </p>
              <Button variant="outline" asChild>
                <Link href="/api">API Reference</Link>
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Try an Example</h3>
              <p className="text-muted-foreground">
                See the server in action with our comprehensive examples.
              </p>
              <Button variant="outline" asChild>
                <Link href="/examples">View Examples</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold">Troubleshooting</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Common Issues</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Old Python version</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Make sure you're using Python 3.10 or higher.
                  </p>
                  <CodeBlock code="python --version" />
                </div>

                {/* <div>
                  <h4 className="font-medium">Port already in use</h4>
                  <p className="text-sm text-muted-foreground">
                    If the default port is in use, you can specify a different port:
                  </p>
                  <CodeBlock code="uv run mcp run --port 1234 --path /path/to/main.py" />
                </div> */}

                <div>
                  <h4 className="font-medium">MCP server not connecting</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure the path to main.py in your MCP configuration is correct and the server
                    is running.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocumentationLayout>
  );
}
