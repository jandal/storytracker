import { NodeProps } from 'reactflow';
import { CommentNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function CommentNode({ selected, data }: NodeProps<CommentNodeData>) {
  return (
    <BaseNode
      selected={selected}
      label="Comment"
      icon="💬"
      color="bg-gray-700"
      hasInput={false}
      hasOutput={false}
    >
      <p className="text-sm text-gray-200 italic">{data.text || 'Add a note...'}</p>
    </BaseNode>
  );
}
