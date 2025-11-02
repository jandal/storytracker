import { NodeProps } from 'reactflow';
import { VariableGetNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function VariableGetNode({ selected, data }: NodeProps<VariableGetNodeData>) {
  return (
    <BaseNode selected={selected} label={data.label || 'Get Variable'} icon="🔍" color="bg-cyan-800">
      <p className="text-sm text-cyan-200 font-semibold">{data.variableName || 'variable'}</p>
      <p className="text-xs text-cyan-100">→ {data.outputVariable || 'output'}</p>
    </BaseNode>
  );
}
