'use client';

import React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { ThemeProvider } from './ThemeProvider';

interface DocumentationLayoutProps {
  children: React.ReactNode;
}

export function DocumentationLayout({ children }: DocumentationLayoutProps) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="speck-it-theme">
      <div className="bg-background text-foreground">
        <div className="fixed top-0 inset-x-0 h-14 z-50 bg-background border-b border-border">
          <Header />
          <aside className="hidden md:block w-64 md:w-64 sticky top-14 border-r border-border h-[calc(100vh-3.5rem)]">
            <Navigation />
          </aside>
        </div>
        <div className="pl-0 md:pl-64 flex flex-col md:flex-row pt-14 pb-26 min-h-screen">
          {/* Desktop Sidebar */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 relative">
            <div className="max-w-4xl mx-auto">{children}</div>
            <div className="absolute bottom-0 inset-x-0 h-0 z-50 bg-background border-t border-border">
              <Footer />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
