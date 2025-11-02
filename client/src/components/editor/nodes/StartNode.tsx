import { NodeProps } from 'reactflow';
import { StartNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function StartNode({ selected, data }: NodeProps<StartNodeData>) {
  return (
    <BaseNode
      selected={selected}
      label="Start"
      icon="▶️"
      color="bg-green-800"
      hasInput={false}
    >
      <p className="text-sm text-green-100">Entry point for this scene</p>
    </BaseNode>
  );
}
