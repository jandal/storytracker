import { NodeProps } from 'reactflow';
import { QuestNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function QuestNode({ selected, data }: NodeProps<QuestNodeData>) {
  return (
    <BaseNode selected={selected} label="Quest" icon="📜" color="bg-yellow-800">
      <p className="text-sm text-yellow-200">
        {data.action === 'start' && '🎬 Start Quest'}
        {data.action === 'update_objective' && '✅ Update Objective'}
        {data.action === 'complete' && '🏆 Complete'}
        {data.action === 'fail' && '❌ Fail'}
      </p>
    </BaseNode>
  );
}
