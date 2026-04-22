import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, ScanBarcode, Flame } from 'lucide-react';

const Layout = () => {
  return (
    <div className="layout">
      <header className="header glass">
        <div className="logo">
          <Flame size={28} color="var(--primary)" fill="var(--primary)" />
          <span className="logo-text">FireGear</span>
        </div>
        <nav className="nav">
          <NavLink to="/scanner" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <ScanBarcode size={20} />
            <span>Scanner</span>
          </NavLink>
          <NavLink to="/inventory" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <ShoppingBag size={20} />
            <span>Bestand</span>
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} />
            <span>Statistik</span>
          </NavLink>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
      
      <style>{`
        .layout { min-height: 100vh; display: flex; flex-direction: column; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; position: sticky; top: 0; z-index: 50; margin-bottom: 2rem; border-radius: 0 0 var(--radius) var(--radius); }
        .logo { display: flex; align-items: center; gap: 0.75rem; font-weight: 800; font-size: 1.5rem; letter-spacing: -0.5px; }
        .logo-text { background: linear-gradient(135deg, #fff 0%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav { display: flex; gap: 1rem; }
        .nav-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; text-decoration: none; color: var(--text-muted); border-radius: 8px; transition: all 0.2s; }
        .nav-item:hover { color: var(--text); background: var(--surface); }
        .nav-item.active { color: white; background: var(--primary); }
        .content { padding: 0 2rem 4rem; max-width: 1400px; margin: 0 auto; width: 100%; flex-grow: 1; }
      `}</style>
    </div>
  );
};

export default Layout;
