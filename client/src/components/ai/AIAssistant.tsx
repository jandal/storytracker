import { useState } from 'react';
import { useAI } from '../../hooks/useAI';

interface AIAssistantProps {
  type: 'dialogue' | 'npc' | 'branches' | 'quest';
  context?: any;
  onGenerate: (data: any) => void;
  isOpen?: boolean;
}

export function AIAssistant({ type, context, onGenerate, isOpen = false }: AIAssistantProps) {
  const { isLoading, error, generateDialogue, generateNPC, suggestBranches, generateQuest } = useAI();
  const [showModal, setShowModal] = useState(isOpen);
  const [generatedData, setGeneratedData] = useState<any>(null);

  const handleGenerate = async () => {
    try {
      let data;
      switch (type) {
        case 'dialogue':
          data = await generateDialogue(context?.speaker || 'NPC', context);
          setGeneratedData(data);
          break;
        case 'npc':
          data = await generateNPC(context?.name || 'New NPC', context);
          setGeneratedData(data);
          break;
        case 'branches':
          data = await suggestBranches(context?.currentScene || 'The adventure begins...', context);
          setGeneratedData(data);
          break;
        case 'quest':
          data = await generateQuest(context);
          setGeneratedData(data);
          break;
      }
    } catch (err) {
      console.error('AI generation failed:', err);
    }
  };

  const handleApply = () => {
    if (generatedData) {
      onGenerate(generatedData);
      setShowModal(false);
      setGeneratedData(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Generating content...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
          {error}
        </div>
      );
    }

    if (!generatedData) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            {type === 'dialogue' && 'Generate AI dialogue for this NPC'}
            {type === 'npc' && 'Generate an NPC profile with AI'}
            {type === 'branches' && 'Get AI suggestions for story branches'}
            {type === 'quest' && 'Generate a quest hook with AI'}
          </p>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            ✨ Generate
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {type === 'dialogue' && generatedData.dialogue && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Generated Dialogue</label>
            <textarea
              value={generatedData.dialogue}
              onChange={(e) => setGeneratedData({ ...generatedData, dialogue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
              rows={4}
            />
          </div>
        )}

        {type === 'npc' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personality</label>
              <textarea
                value={generatedData.personality || ''}
                onChange={(e) => setGeneratedData({ ...generatedData, personality: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Backstory</label>
              <textarea
                value={generatedData.backstory || ''}
                onChange={(e) => setGeneratedData({ ...generatedData, backstory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <input
                  type="text"
                  value={generatedData.suggestedClass || ''}
                  onChange={(e) => setGeneratedData({ ...generatedData, suggestedClass: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
                <input
                  type="text"
                  value={generatedData.suggestedRace || ''}
                  onChange={(e) => setGeneratedData({ ...generatedData, suggestedRace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {type === 'branches' && generatedData.branches && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Story Branch Suggestions</label>
            <div className="space-y-2">
              {generatedData.branches.map((branch: string, idx: number) => (
                <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                  {branch}
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'quest' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quest Title</label>
              <input
                type="text"
                value={generatedData.title || ''}
                onChange={(e) => setGeneratedData({ ...generatedData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={generatedData.description || ''}
                onChange={(e) => setGeneratedData({ ...generatedData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objectives</label>
              {generatedData.objectives?.map((obj: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => {
                      const newObjs = [...generatedData.objectives];
                      newObjs[idx] = e.target.value;
                      setGeneratedData({ ...generatedData, objectives: newObjs });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reward</label>
              <input
                type="text"
                value={generatedData.reward || ''}
                onChange={(e) => setGeneratedData({ ...generatedData, reward: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ✓ Apply
          </button>
          <button
            onClick={() => {
              setGeneratedData(null);
            }}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Regenerate
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-1 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:opacity-90 transition-opacity flex items-center gap-1"
      >
        ✨ AI
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {type === 'dialogue' && '✨ Generate Dialogue'}
                {type === 'npc' && '✨ Generate NPC'}
                {type === 'branches' && '✨ Suggest Branches'}
                {type === 'quest' && '✨ Generate Quest'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setGeneratedData(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4">{renderContent()}</div>
          </div>
        </div>
      )}
    </>
  );
}
