import { Outlet } from 'react-router';

/**
 * Main application layout component.
 * Provides the global site header and a main content area for routed child pages.
 */
export function Layout() {
  return (
    <div className="min-h-screen bg-muted text-foreground">
      <header className="border-b bg-background p-4">
        <nav className="font-bold text-lg">HR Recruitment Pipeline</nav>
      </header>
      <main>
        {/* Renders the matching child route component */}
        <Outlet />
      </main>
    </div>
  );
}