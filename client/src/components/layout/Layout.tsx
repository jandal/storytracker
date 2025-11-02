import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { UserMenu } from './UserMenu';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showNav?: boolean;
  headerExtra?: React.ReactNode;
}

export function Layout({ children, breadcrumbs = [], showNav = true, headerExtra }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const handleToggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {showNav && (
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
        />
      )}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          showNav ? (isSidebarOpen ? 'ml-64' : 'ml-16') : ''
        }`}
      >
        {showNav && (
          <div className="bg-gray-800 border-b border-gray-700 h-16 px-4 flex justify-between items-center gap-4 relative z-50">
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                {breadcrumbs.map((item, idx) => (
                  <div key={item.path} className="flex items-center gap-2">
                    {idx > 0 && <span className="text-gray-600">/</span>}
                    {idx === breadcrumbs.length - 1 ? (
                      <span className="text-white font-medium">{item.label}</span>
                    ) : (
                      <Link
                        to={item.path}
                        className="text-blue-400 hover:text-blue-300 transition"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4">
              {headerExtra}
              <UserMenu />
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
