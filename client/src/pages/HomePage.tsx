import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">StoryTracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">{user?.name || user?.email}</span>
            <Link
              to="/settings"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold text-white mb-4">Welcome to StoryTracker</h2>
          <p className="text-gray-300 text-lg mb-8">
            A D&D Campaign Story Editor - Create your next adventure!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">Story Editor</h3>
              <p className="text-gray-400">Visual node-based story creation</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="text-4xl mb-4">🧙</div>
              <h3 className="text-xl font-semibold text-white mb-2">NPC Management</h3>
              <p className="text-gray-400">Track NPCs, quests, and encounters</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Assistant</h3>
              <p className="text-gray-400">Generate content with Claude</p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-300 mb-2">Phase 3 Complete!</h3>
            <p className="text-gray-400 mb-4">
              Node editor canvas is ready! Start creating your campaigns.
            </p>
            <div className="flex gap-4">
              <Link
                to="/campaigns"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
              >
                Create Campaign →
              </Link>
              <Link
                to="/settings"
                className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
              >
                Configure API Key
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
