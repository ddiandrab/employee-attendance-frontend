import { Outlet } from 'react-router-dom';

import { Navigation } from './Navigation';

export function AppLayout() {
  return (
    <div className="min-vh-100 bg-light">
      <Navigation />

      <main className="container-fluid py-4">
        <Outlet />
      </main>
    </div>
  );
}