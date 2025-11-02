import { create } from 'zustand';
import { CustomNode, CustomEdge, SceneGraph } from '../../../shared/src/types';
import { v4 as uuidv4 } from 'uuid';

interface EditorState {
  // Current scene
  currentSceneId: string | null;
  currentSceneName: string;
  nodes: CustomNode[];
  edges: CustomEdge[];
  viewport: { x: number; y: number; zoom: number };

  // UI state
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  isPanelOpen: boolean;

  // Actions
  setScene: (sceneId: string, sceneName: string, graph: SceneGraph) => void;
  setNodes: (nodes: CustomNode[]) => void;
  setEdges: (edges: CustomEdge[]) => void;
  addNode: (node: CustomNode) => void;
  updateNode: (nodeId: string, data: Partial<any>) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: CustomEdge) => void;
  deleteEdge: (edgeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  togglePanel: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  currentSceneId: null,
  currentSceneName: '',
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  selectedNodeId: null,
  selectedEdgeId: null,
  isPanelOpen: true,

  setScene: (sceneId, sceneName, graph) =>
    set({
      currentSceneId: sceneId,
      currentSceneName: sceneName,
      nodes: graph.nodes,
      edges: graph.edges,
      viewport: graph.viewport || { x: 0, y: 0, zoom: 1 },
      selectedNodeId: null,
      selectedEdgeId: null,
    }),

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  updateNode: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n
      ),
    })),

  deleteNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  deleteEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
      selectedEdgeId: state.selectedEdgeId === edgeId ? null : state.selectedEdgeId,
    })),

  selectNode: (nodeId) => set({ selectedNodeId: nodeId, selectedEdgeId: null }),

  selectEdge: (edgeId) => set({ selectedEdgeId: edgeId, selectedNodeId: null }),

  setViewport: (viewport) => set({ viewport }),

  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
}));
