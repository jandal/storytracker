import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={clsx(
          'fixed left-0 top-0 h-screen bg-gray-800 border-r border-gray-700 transition-all duration-300 z-40',
          isOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          {isOpen && <h1 className="text-lg font-bold text-white truncate">Story Tracker</h1>}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-700 rounded transition text-gray-400 hover:text-white"
            title={isOpen ? 'Collapse' : 'Expand'}
          >
            <svg
              className={clsx('w-5 h-5 transition-transform', !isOpen && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          <Link
            to="/"
            className={clsx(
              'flex items-center gap-3 px-4 py-2 rounded-lg transition',
              isActive('/') && location.pathname === '/'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            )}
            title="Home"
          >
            <span className="text-lg">🏠</span>
            {isOpen && <span>Home</span>}
          </Link>

          <Link
            to="/campaigns"
            className={clsx(
              'flex items-center gap-3 px-4 py-2 rounded-lg transition',
              isActive('/campaigns')
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            )}
            title="Campaigns"
          >
            <span className="text-lg">📚</span>
            {isOpen && <span>Campaigns</span>}
          </Link>
        </nav>

        {/* Settings at bottom */}
        <div className="px-2 border-t border-gray-700 pt-2 pb-2">
          <Link
            to="/settings"
            className={clsx(
              'flex items-center gap-3 px-4 py-2 rounded-lg transition',
              isActive('/settings')
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            )}
            title="Settings"
          >
            <span className="text-lg">⚙️</span>
            {isOpen && <span>Settings</span>}
          </Link>
        </div>
      </div>

      {/* Overlay for collapsed sidebar info */}
      {!isOpen && (
        <div className="fixed left-16 top-0 bottom-0 pointer-events-none" />
      )}
    </>
  );
}
