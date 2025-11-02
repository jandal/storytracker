import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Layout } from '../components/layout/Layout';

export function HomePage() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <Layout breadcrumbs={[{ label: 'Home', path: '/' }]}>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold text-white mb-4">Welcome to StoryTracker</h2>
          <p className="text-gray-300 text-lg mb-8">
            A D&D Campaign Story Editor - Create your next adventure!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Link
              to="/campaigns"
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition cursor-pointer"
            >
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white mb-2">Story Editor</h3>
              <p className="text-gray-400">Visual node-based story creation</p>
            </Link>

            <Link
              to="/campaigns"
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition cursor-pointer"
            >
              <div className="text-4xl mb-4">🧙</div>
              <h3 className="text-xl font-semibold text-white mb-2">NPC Management</h3>
              <p className="text-gray-400">Track NPCs, quests, and encounters</p>
            </Link>

            <Link
              to="/settings"
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition cursor-pointer"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Assistant</h3>
              <p className="text-gray-400">Generate content with Claude</p>
            </Link>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}
