import { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import { useEditorStore } from '../../stores/editorStore';
import { v4 as uuidv4 } from 'uuid';
import { CustomNode } from '../../shared/src/types';

const NODE_TYPES = [
  { type: 'start', icon: '▶️', label: 'Start', color: 'bg-green-700' },
  { type: 'dialogue', icon: '💬', label: 'Dialogue', color: 'bg-blue-700' },
  { type: 'choice', icon: '🎯', label: 'Choice', color: 'bg-purple-700' },
  { type: 'branch', icon: '🔀', label: 'Branch', color: 'bg-orange-700' },
  { type: 'variable_set', icon: '📝', label: 'Set Var', color: 'bg-cyan-700' },
  { type: 'variable_get', icon: '🔍', label: 'Get Var', color: 'bg-cyan-700' },
  { type: 'npc', icon: '🧙', label: 'NPC', color: 'bg-red-700' },
  { type: 'encounter', icon: '⚔️', label: 'Encounter', color: 'bg-red-900' },
  { type: 'quest', icon: '📜', label: 'Quest', color: 'bg-yellow-700' },
  { type: 'run_scene', icon: '▶️', label: 'Run Scene', color: 'bg-indigo-700' },
  { type: 'comment', icon: '💬', label: 'Comment', color: 'bg-gray-700' },
];

export function NodePalette() {
  const { getNodes } = useReactFlow();
  const { addNode } = useEditorStore();

  const handleDragStart = useCallback(
    (e: React.DragEvent, nodeType: string) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/reactflow', nodeType);
    },
    []
  );

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-800 border-r border-gray-700 w-32">
      <p className="text-xs font-semibold text-gray-400 uppercase">Nodes</p>
      <div className="space-y-2">
        {NODE_TYPES.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
            className={`p-2 rounded cursor-move text-center text-sm font-semibold text-white ${item.color} hover:opacity-80 transition`}
          >
            <span className="mr-1">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
