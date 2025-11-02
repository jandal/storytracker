import { NodeProps } from 'reactflow';
import { EncounterNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function EncounterNode({ selected, data }: NodeProps<EncounterNodeData>) {
  return (
    <BaseNode selected={selected} label={data.label || 'Encounter'} icon="⚔️" color="bg-red-900">
      <p className="text-sm text-red-200 font-semibold">{data.name || 'Encounter'}</p>
      <p className="text-xs text-red-100">
        {data.monsters?.length || 0} monster(s) {data.difficulty && `(${data.difficulty})`}
      </p>
    </BaseNode>
  );
}
