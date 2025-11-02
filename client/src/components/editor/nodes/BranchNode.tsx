import { NodeProps } from 'reactflow';
import { BranchNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function BranchNode({ selected, data }: NodeProps<BranchNodeData>) {
  return (
    <BaseNode selected={selected} label="Branch" icon="🔀" color="bg-orange-800">
      <p className="text-sm text-orange-200 mb-2">{data.conditions.length} condition(s)</p>
      <div className="space-y-1">
        {data.conditions.slice(0, 2).map((cond) => (
          <p key={cond.id} className="text-xs text-orange-100">
            {cond.variable} {cond.operator}
          </p>
        ))}
        {data.conditions.length > 2 && (
          <p className="text-xs text-orange-300">+{data.conditions.length - 2} more</p>
        )}
      </div>
    </BaseNode>
  );
}
