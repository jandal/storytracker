import { NodeProps } from 'reactflow';
import { DialogueNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function DialogueNode({ selected, data }: NodeProps<DialogueNodeData>) {
  return (
    <BaseNode selected={selected} label={data.label || 'Dialogue'} icon="💬" color="bg-blue-800">
      {data.speaker && <p className="text-sm text-blue-200 font-semibold">{data.speaker}</p>}
      <p className="text-sm text-blue-100 mt-1 whitespace-pre-wrap break-words">{data.text || 'Enter dialogue...'}</p>
    </BaseNode>
  );
}
