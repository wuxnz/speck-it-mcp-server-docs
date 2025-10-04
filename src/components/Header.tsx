'use client';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { ExternalLink, Github, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 absolute top-0 z-50 w-full sticky">
        <div className="w-full px-4 sm:px-6 flex h-14 items-center">
          <div className="mr-4 flex flex-1">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">Speck-It</span>
              <span className="text-muted-foreground text-sm hidden sm:inline">
                MCP Server Docs
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:justify-end sm:hidden lg:flex">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Introduction</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/installation">Installation</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/api">API Reference</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/guide">Guide</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/contributing">Contributing</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/examples">Examples</Link>
              </Button>
            </nav>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild>
                <Link
                  href="https://github.com/wuxnz/speck-it-mcp-server"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1"
                >
                  <Github className="h-4 w-4" />
                  <span className="hidden sm:inline">GitHub</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
          />
          <div className="fixed top-14 left-0 right-0 z-50 bg-background border-b border-border md:hidden">
            <nav className="flex flex-col p-4 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="justify-start"
                onClick={closeMenu}
              >
                <Link href="/">Introduction</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="justify-start"
                onClick={closeMenu}
              >
                <Link href="/installation">Installation</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="justify-start"
                onClick={closeMenu}
              >
                <Link href="/api">API Reference</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="justify-start"
                onClick={closeMenu}
              >
                <Link href="/guide">Guide</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="justify-start"
                onClick={closeMenu}
              >
                <Link href="/contributing">Contributing</Link>
              </Button>
              <div className="pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="justify-start"
                  onClick={closeMenu}
                >
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
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
