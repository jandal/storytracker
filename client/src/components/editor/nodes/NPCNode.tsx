import { NodeProps } from 'reactflow';
import { NPCNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function NPCNode({ selected, data }: NodeProps<NPCNodeData>) {
  return (
    <BaseNode selected={selected} label={data.label || 'NPC'} icon="🧙" color="bg-red-800">
      <p className="text-sm text-red-200">
        {data.action === 'introduce' && '🎭 Introduce'}
        {data.action === 'update_status' && '📊 Update Status'}
        {data.action === 'move_location' && '📍 Move Location'}
      </p>
      <p className="text-xs text-red-100 mt-1">NPC interaction</p>
    </BaseNode>
  );
}
