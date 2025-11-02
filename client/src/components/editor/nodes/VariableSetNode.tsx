import { NodeProps } from 'reactflow';
import { VariableSetNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function VariableSetNode({ selected, data }: NodeProps<VariableSetNodeData>) {
  return (
    <BaseNode selected={selected} label="Set Variable" icon="📝" color="bg-cyan-800">
      <p className="text-sm text-cyan-200 font-semibold">{data.variableName || 'variable'}</p>
      <p className="text-xs text-cyan-100">
        {data.operation || 'set'} {data.isGlobal ? '(global)' : '(local)'}
      </p>
    </BaseNode>
  );
}
