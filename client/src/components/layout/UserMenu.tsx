import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditProfile = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center transition cursor-pointer"
        title={user?.name || user?.email || 'User menu'}
      >
        {getInitial()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-[9999]">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="text-sm text-gray-300 truncate">{user?.name || user?.email}</p>
            </div>
            <button
              onClick={handleEditProfile}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
