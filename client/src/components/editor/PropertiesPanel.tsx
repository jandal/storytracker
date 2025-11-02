import { useEditorStore } from '../../stores/editorStore';
import { CustomNode } from '../../shared/src/types';

export function PropertiesPanel() {
  const { nodes, selectedNodeId, updateNode, deleteNode } = useEditorStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) as CustomNode | undefined;

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 text-center text-gray-400">
        Select a node to edit properties
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Properties</h3>
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white text-sm rounded transition"
        >
          Delete
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1">Label</label>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1">Description</label>
          <textarea
            value={selectedNode.data.description || ''}
            onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
            rows={3}
          />
        </div>

        {/* Dialogue-specific fields */}
        {selectedNode.data.type === 'dialogue' && (
          <>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Speaker</label>
              <input
                type="text"
                value={selectedNode.data.speaker || ''}
                onChange={(e) => updateNode(selectedNode.id, { speaker: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="e.g., Innkeeper"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Dialogue Text</label>
              <textarea
                value={selectedNode.data.text || ''}
                onChange={(e) => updateNode(selectedNode.id, { text: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                rows={4}
                placeholder="What the character says..."
              />
            </div>
          </>
        )}

        {/* Choice-specific fields */}
        {selectedNode.data.type === 'choice' && (
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Prompt</label>
            <textarea
              value={selectedNode.data.prompt || ''}
              onChange={(e) => updateNode(selectedNode.id, { prompt: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              placeholder="What question are you asking?"
            />
          </div>
        )}

        {/* Variable Set-specific fields */}
        {selectedNode.data.type === 'variable_set' && (
          <>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Variable Name</label>
              <input
                type="text"
                value={selectedNode.data.variableName || ''}
                onChange={(e) => updateNode(selectedNode.id, { variableName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Operation</label>
              <select
                value={selectedNode.data.operation || 'set'}
                onChange={(e) => updateNode(selectedNode.id, { operation: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="set">Set</option>
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
                <option value="multiply">Multiply</option>
                <option value="divide">Divide</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Is Global?</label>
              <input
                type="checkbox"
                checked={selectedNode.data.isGlobal || false}
                onChange={(e) => updateNode(selectedNode.id, { isGlobal: e.target.checked })}
                className="px-3 py-2"
              />
            </div>
          </>
        )}

        {/* Quest-specific fields */}
        {selectedNode.data.type === 'quest' && (
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Action</label>
            <select
              value={selectedNode.data.action || 'start'}
              onChange={(e) => updateNode(selectedNode.id, { action: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="start">Start Quest</option>
              <option value="update_objective">Update Objective</option>
              <option value="complete">Complete</option>
              <option value="fail">Fail</option>
            </select>
          </div>
        )}

        {/* Run Scene-specific fields */}
        {selectedNode.data.type === 'run_scene' && (
          <>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Scene Name</label>
              <input
                type="text"
                value={selectedNode.data.sceneName || ''}
                onChange={(e) => updateNode(selectedNode.id, { sceneName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Return to Source?</label>
              <input
                type="checkbox"
                checked={selectedNode.data.returnToSource || false}
                onChange={(e) => updateNode(selectedNode.id, { returnToSource: e.target.checked })}
                className="px-3 py-2"
              />
            </div>
          </>
        )}

        {/* Comment-specific fields */}
        {selectedNode.data.type === 'comment' && (
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Comment Text</label>
            <textarea
              value={selectedNode.data.text || ''}
              onChange={(e) => updateNode(selectedNode.id, { text: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              placeholder="Write a note..."
            />
          </div>
        )}

        <div className="pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">Node ID: {selectedNode.id}</p>
          <p className="text-xs text-gray-500">Type: {selectedNode.data.type}</p>
        </div>
      </div>
    </div>
  );
}
