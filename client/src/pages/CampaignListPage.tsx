import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function CampaignListPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // TODO: Load campaigns from API
    setCampaigns([]);
  }, [user, navigate]);

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
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Campaigns</h2>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
            + New Campaign
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No campaigns yet</h3>
            <p className="text-gray-400 mb-8">Create your first D&D campaign to get started!</p>
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-500 transition cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{campaign.name}</h3>
                <p className="text-gray-400 mb-4">{campaign.description || 'No description'}</p>
                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                  Edit →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
