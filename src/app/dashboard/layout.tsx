"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Website Management", path: "/dashboard/website", icon: "🌐" },
    { name: "App Management", path: "/dashboard/app", icon: "📱" },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">A</div>
          <div className="logo-text">
            <h1>Adhvaitha</h1>
            <span>Admin Control Panel</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <h4>Adhvaitha Admin</h4>
            <p>Super Admin</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="content-wrapper">
        <header className="top-header">
          <div className="search-bar">
            <span>🔍</span>
            <input type="text" placeholder="Search dashboard..." />
          </div>
          <div className="header-actions">
            <button className="action-btn" title="Notifications" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>🔔</button>
            <button className="action-btn" title="Settings" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>⚙️</button>
          </div>
        </header>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
