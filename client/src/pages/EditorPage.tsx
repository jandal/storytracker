import { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import { useEditorStore } from '../stores/editorStore';
import { EditorCanvas } from '../components/editor/EditorCanvas';
import { NodePalette } from '../components/editor/NodePalette';
import { PropertiesPanel } from '../components/editor/PropertiesPanel';
import { VariablesPanel } from '../components/editor/VariablesPanel';
import { campaignsApi } from '../api/client';
import { Layout } from '../components/layout/Layout';
import { v4 as uuidv4 } from 'uuid';
import { CustomNode } from '../shared/src/types';

function EditorContent() {
  const navigate = useNavigate();
  const { sceneId, campaignId } = useParams<{ sceneId: string; campaignId: string }>();
  const { screenToFlowPosition } = useReactFlow();
  const { setScene, addNode, currentSceneName, nodes, edges, viewport } = useEditorStore();
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'variables'>('properties');
  const [isSaving, setIsSaving] = useState(false);
  const [campaignName, setCampaignName] = useState('Campaign');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sceneId || !campaignId) {
      navigate('/campaigns');
      return;
    }

    // Load scene from API
    const loadScene = async () => {
      try {
        // Load campaign name
        const campaignRes = await campaignsApi.getCampaign(campaignId);
        setCampaignName(campaignRes.data.name);

        // Load scene
        const response = await campaignsApi.getScene(campaignId, sceneId);
        const scene = response.data;

        // Parse JSON strings to objects for nodes and edges
        const nodes = typeof scene.nodes === 'string' ? JSON.parse(scene.nodes) : scene.nodes;
        const edges = typeof scene.edges === 'string' ? JSON.parse(scene.edges) : scene.edges;
        const viewport = typeof scene.viewport === 'string' ? JSON.parse(scene.viewport) : (scene.viewport || { x: 0, y: 0, zoom: 1 });

        setScene(sceneId, scene.name, { nodes, edges, viewport });
      } catch (error) {
        console.error('Failed to load scene:', error);
        // Fallback to empty scene if load fails
        setScene(sceneId, 'New Scene', { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } });
      }
    };

    loadScene();
  }, [sceneId, campaignId, navigate, setScene]);

  // Auto-save scene graph on changes
  useEffect(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Only save if we have sceneId and campaignId
    if (!sceneId || !campaignId) return;

    // Set a new timeout for debounced save
    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // Stringify nodes and edges for API
        await campaignsApi.saveSceneGraph(
          campaignId,
          sceneId,
          JSON.stringify(nodes),
          JSON.stringify(edges),
          JSON.stringify(viewport)
        );
      } catch (error) {
        console.error('Failed to auto-save scene:', error);
      } finally {
        setIsSaving(false);
      }
    }, 2500); // Save 2.5 seconds after last change

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [nodes, edges, viewport, sceneId, campaignId]);

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
    <Layout
      breadcrumbs={[
        { label: 'Campaigns', path: '/campaigns' },
        { label: campaignName, path: `/campaigns/${campaignId}/scenes` },
        { label: currentSceneName, path: `/campaigns/${campaignId}/scenes/${sceneId}` },
      ]}
      headerExtra={
        isSaving && <span className="text-blue-400 text-sm">● Saving...</span>
      }
    >
      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <div className="flex-1" onDragOver={onDragOver} onDrop={onDrop}>
          <EditorCanvas />
        </div>

        {/* Right panel with tabs */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setRightPanelTab('properties')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                rightPanelTab === 'properties'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setRightPanelTab('variables')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                rightPanelTab === 'variables'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Variables
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {rightPanelTab === 'properties' ? (
              <PropertiesPanel />
            ) : (
              sceneId && campaignId && <VariablesPanel sceneId={sceneId} campaignId={campaignId} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function EditorPage() {
  return (
    <ReactFlowProvider>
      <EditorContent />
    </ReactFlowProvider>
  );
}
