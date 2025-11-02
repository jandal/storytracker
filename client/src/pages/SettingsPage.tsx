import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { settingsApi } from '../api/client';

const CLAUDE_MODELS = [
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Balanced)' },
  { id: 'claude-3-opus-20250219', name: 'Claude 3 Opus (Most Capable)' },
  { id: 'claude-3-haiku-20250122', name: 'Claude 3 Haiku (Fast)' },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet-20241022');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadSettings();
  }, [user, navigate]);

  const loadSettings = async () => {
    try {
      const response = await settingsApi.getSettings();
      setHasApiKey(response.data.hasApiKey);
      if (response.data.anthropicModel) {
        setSelectedModel(response.data.anthropicModel);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleTestApiKey = async () => {
    if (!apiKey) {
      setError('Please enter an API key');
      return;
    }

    setIsTesting(true);
    setError('');
    setMessage('');

    try {
      await settingsApi.testApiKey(apiKey, selectedModel);
      setMessage('API key is valid!');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid API key');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey) {
      setError('Please enter an API key');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await settingsApi.updateApiKey(apiKey, selectedModel);
      setHasApiKey(true);
      setApiKey('');
      setMessage('API key saved successfully!');

      // Update user in store
      const response = await settingsApi.getSettings();
      useAuthStore.setState((state) => ({
        user: state.user ? { ...state.user, anthropicModel: selectedModel } : null,
      }));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveApiKey = async () => {
    if (!window.confirm('Are you sure you want to remove your API key?')) {
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await settingsApi.removeApiKey();
      setHasApiKey(false);
      setApiKey('');
      setMessage('API key removed successfully');
    } catch (err) {
      setError('Failed to remove API key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
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

        {/* User Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Account</h2>
          <div className="space-y-2">
            <p className="text-gray-300">
              <span className="text-gray-400">Email:</span> {user?.email}
            </p>
            {user?.name && (
              <p className="text-gray-300">
                <span className="text-gray-400">Name:</span> {user.name}
              </p>
            )}
          </div>
        </div>

        {/* Anthropic API Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Anthropic API Settings</h2>

          {message && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 text-green-200 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Claude Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
              >
                {CLAUDE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <p className="text-gray-400 text-sm mt-2">
                Get your API key from{' '}
                <a
                  href="https://console.anthropic.com/account/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Anthropic Console
                </a>
              </p>
            </div>

            {hasApiKey && (
              <div className="p-3 bg-blue-500/20 border border-blue-500 rounded">
                <p className="text-blue-200 text-sm">✓ API key is currently configured</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleTestApiKey}
                disabled={isTesting || !apiKey}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded transition"
              >
                {isTesting ? 'Testing...' : 'Test Key'}
              </button>

              <button
                onClick={handleSaveApiKey}
                disabled={isLoading || !apiKey}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition"
              >
                {isLoading ? 'Saving...' : 'Save API Key'}
              </button>

              {hasApiKey && (
                <button
                  onClick={handleRemoveApiKey}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded transition"
                >
                  Remove Key
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
