import { NodeProps } from 'reactflow';
import { DialogueNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function DialogueNode({ selected, data }: NodeProps<DialogueNodeData>) {
  return (
    <BaseNode selected={selected} label="Dialogue" icon="💬" color="bg-blue-800">
      {data.speaker && <p className="text-sm text-blue-200 font-semibold">{data.speaker}</p>}
      <p className="text-sm text-blue-100 line-clamp-2 mt-1">{data.text || 'Enter dialogue...'}</p>
    </BaseNode>
  );
}
