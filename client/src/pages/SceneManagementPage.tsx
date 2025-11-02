import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { campaignsApi } from '../api/client';
import { Layout } from '../components/layout/Layout';

export function SceneManagementPage() {
  const navigate = useNavigate();
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaign, setCampaign] = useState<any>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sceneName, setSceneName] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [isCreatingScene, setIsCreatingScene] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [isDeletingSceneId, setIsDeletingSceneId] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId) {
      navigate('/campaigns');
      return;
    }

    loadCampaignAndScenes();
  }, [campaignId, navigate]);

  const loadCampaignAndScenes = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Load campaign
      const campaignRes = await campaignsApi.getCampaign(campaignId!);
      setCampaign(campaignRes.data);

      // Load scenes
      const scenesRes = await campaignsApi.getScenes(campaignId!);
      setScenes(scenesRes.data || []);

      // If only one scene, auto-select it
      if (scenesRes.data && scenesRes.data.length === 1) {
        setSelectedSceneId(scenesRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load campaign:', err);
      setError('Failed to load campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateScene = async () => {
    if (!sceneName.trim()) {
      setError('Scene name is required');
      return;
    }

    try {
      setIsCreatingScene(true);
      setError('');
      const response = await campaignsApi.createScene(campaignId!, sceneName, sceneDescription);
      const newScene = response.data;

      // Add to scenes list
      setScenes([...scenes, newScene]);
      setShowCreateModal(false);
      setSceneName('');
      setSceneDescription('');
      setSelectedSceneId(newScene.id);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create scene');
    } finally {
      setIsCreatingScene(false);
    }
  };

  const handleDeleteScene = async (sceneId: string) => {
    if (!window.confirm('Are you sure you want to delete this scene?')) {
      return;
    }

    try {
      setIsDeletingSceneId(sceneId);
      setError('');
      await campaignsApi.deleteScene(campaignId!, sceneId);

      const updatedScenes = scenes.filter((s) => s.id !== sceneId);
      setScenes(updatedScenes);

      // Clear selection if deleted scene was selected
      if (selectedSceneId === sceneId) {
        setSelectedSceneId(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete scene');
    } finally {
      setIsDeletingSceneId(null);
    }
  };

  const handleEditScene = (sceneId: string) => {
    navigate(`/campaigns/${campaignId}/scenes/${sceneId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-300">Loading campaign...</p>
      </div>
    );
  }

  return (
    <Layout
      breadcrumbs={[
        { label: 'Campaigns', path: '/campaigns' },
        { label: campaign?.name || 'Campaign', path: `/campaigns/${campaignId}/scenes` },
      ]}
    >
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-white">
            Scenes ({scenes.length})
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            + New Scene
          </button>
        </div>

        {scenes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No scenes yet</h3>
            <p className="text-gray-400 mb-8">Create your first scene to start building your story!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              Create Your First Scene
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                className={`rounded-lg border-2 p-6 transition cursor-pointer ${
                  selectedSceneId === scene.id
                    ? 'border-blue-500 bg-gray-800'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
                onClick={() => setSelectedSceneId(scene.id)}
              >
                <h3 className="text-lg font-semibold text-white mb-2">{scene.name}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {scene.description || 'No description'}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditScene(scene.id);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScene(scene.id);
                    }}
                    disabled={isDeletingSceneId === scene.id}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded transition text-sm font-semibold"
                  >
                    {isDeletingSceneId === scene.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Scene Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">Create New Scene</h3>

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
                    setShowCreateModal(false);
                    setSceneName('');
                    setSceneDescription('');
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
    </Layout>
  );
}
