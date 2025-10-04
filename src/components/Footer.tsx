'use client';

import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Heart } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-6 flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with <Heart className="inline h-4 w-4 text-red-500" /> for the Speck-It MCP Server
            community.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="https://github.com/wuxnz/speck-it-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">Documentation</Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/support">Support</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
