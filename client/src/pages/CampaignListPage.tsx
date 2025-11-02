import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { campaignsApi } from '../api/client';

export function CampaignListPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [showSceneModal, setShowSceneModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [sceneName, setSceneName] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [isCreatingScene, setIsCreatingScene] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadCampaigns();
  }, [user, navigate]);

  const loadCampaigns = async () => {
    try {
      setIsLoading(true);
      const response = await campaignsApi.getAllCampaigns();
      setCampaigns(response.data);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
      setError('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      setError('Campaign name is required');
      return;
    }

    try {
      setIsCreating(true);
      setError('');
      const response = await campaignsApi.createCampaign(campaignName, campaignDescription);
      setCampaigns([...campaigns, response.data]);
      setShowCreateModal(false);
      setCampaignName('');
      setCampaignDescription('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create campaign');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditCampaign = async (campaignId: string) => {
    try {
      const response = await campaignsApi.getScenes(campaignId);
      const scenes = response.data;

      if (scenes && scenes.length > 0) {
        // Navigate to the first scene
        navigate(`/campaigns/${campaignId}/scenes/${scenes[0].id}`);
      } else {
        // Show modal to create first scene
        setSelectedCampaignId(campaignId);
        setShowSceneModal(true);
      }
    } catch (err) {
      console.error('Failed to load scenes:', err);
      setError('Failed to load campaign scenes');
    }
  };

  const handleCreateScene = async () => {
    if (!sceneName.trim()) {
      setError('Scene name is required');
      return;
    }

    try {
      setIsCreatingScene(true);
      const response = await campaignsApi.createScene(selectedCampaignId, sceneName, sceneDescription);
      const newScene = response.data;

      // Navigate to the new scene
      navigate(`/campaigns/${selectedCampaignId}/scenes/${newScene.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create scene');
    } finally {
      setIsCreatingScene(false);
    }
  };

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
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            + New Campaign
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-gray-300">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No campaigns yet</h3>
            <p className="text-gray-400 mb-8">Create your first D&D campaign to get started!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
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
                <button
                  onClick={() => handleEditCampaign(campaign.id)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                >
                  Edit →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">Create New Campaign</h3>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Dragon's Quest"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  placeholder="Describe your campaign..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCampaignName('');
                    setCampaignDescription('');
                    setError('');
                  }}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition font-semibold"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Scene Modal */}
      {showSceneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">Create Your First Scene</h3>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Scene Name
                </label>
                <input
                  type="text"
                  value={sceneName}
                  onChange={(e) => setSceneName(e.target.value)}
                  placeholder="e.g., Tavern Meeting"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={sceneDescription}
                  onChange={(e) => setSceneDescription(e.target.value)}
                  placeholder="Describe the scene..."
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowSceneModal(false);
                    setSceneName('');
                    setSceneDescription('');
                    setSelectedCampaignId('');
                    setError('');
                  }}
                  disabled={isCreatingScene}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateScene}
                  disabled={isCreatingScene}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition font-semibold"
                >
                  {isCreatingScene ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
