import { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import { useEditorStore } from '../stores/editorStore';
import { EditorCanvas } from '../components/editor/EditorCanvas';
import { NodePalette } from '../components/editor/NodePalette';
import { PropertiesPanel } from '../components/editor/PropertiesPanel';
import { v4 as uuidv4 } from 'uuid';
import { CustomNode } from '../shared/src/types';

function EditorContent() {
  const navigate = useNavigate();
  const { sceneId } = useParams<{ sceneId: string }>();
  const { screenToFlowPosition } = useReactFlow();
  const { setScene, addNode, currentSceneName } = useEditorStore();

  useEffect(() => {
    if (!sceneId) {
      navigate('/campaigns');
      return;
    }

    // TODO: Load scene from API
    // For now, initialize empty scene
    setScene(sceneId, 'New Scene', { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } });
  }, [sceneId, navigate, setScene]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: CustomNode = {
        id: uuidv4(),
        type: nodeType as any,
        position,
        data: {
          type: nodeType as any,
          label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1),
          ...(nodeType === 'dialogue' && { speaker: '', text: '' }),
          ...(nodeType === 'choice' && { prompt: '', choices: [] }),
          ...(nodeType === 'branch' && { conditions: [], defaultOutput: true }),
        } as any,
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Story Editor</h1>
          <p className="text-gray-400 text-sm">{currentSceneName}</p>
        </div>
        <button
          onClick={() => navigate('/campaigns')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
        >
          ← Back
        </button>
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <div className="flex-1" onDragOver={onDragOver} onDrop={onDrop}>
          <EditorCanvas />
        </div>
        <PropertiesPanel />
      </div>
    </div>
  );
}

export function EditorPage() {
  return (
    <ReactFlowProvider>
      <EditorContent />
    </ReactFlowProvider>
  );
}
