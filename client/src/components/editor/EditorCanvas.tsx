import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useEffect, useCallback } from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { StartNode, DialogueNode, ChoiceNode, BranchNode } from './nodes';
import { CustomNode } from '../../shared/src/types';

const nodeTypes = {
  start: StartNode,
  dialogue: DialogueNode,
  choice: ChoiceNode,
  branch: BranchNode,
};

export function EditorCanvas() {
  const { getNode } = useReactFlow();
  const { nodes: storeNodes, edges: storeEdges, setNodes: setStoreNodes, setEdges: setStoreEdges, selectNode, selectEdge } = useEditorStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Sync local state to store
  useEffect(() => {
    setStoreNodes(nodes);
  }, [nodes, setStoreNodes]);

  useEffect(() => {
    setStoreEdges(edges);
  }, [edges, setStoreEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: CustomNode) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      onPaneClick={handlePaneClick}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
