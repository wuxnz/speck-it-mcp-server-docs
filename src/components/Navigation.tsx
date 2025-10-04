'use client';

import { cn } from '@/lib/utils';
import { BookOpen, Code, FileText, Home, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  {
    title: 'Introduction',
    href: '/',
    icon: Home,
  },
  {
    title: 'Installation',
    href: '/installation',
    icon: Settings,
  },
  {
    title: 'API Reference',
    href: '/api',
    icon: Code,
  },
  {
    title: 'Guide',
    href: '/guide',
    icon: BookOpen,
  },
  {
    title: 'Contributing',
    href: '/contributing',
    icon: Users,
  },
  {
    title: 'Examples',
    href: '/examples',
    icon: FileText,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="space-y-2 p-4 absolute top-0 left-0 w-[250px] h-[calc(100vh-64px)] overflow-y-auto border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      aria-label="Main navigation"
    >
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
              isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
