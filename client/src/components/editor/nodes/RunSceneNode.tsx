import { NodeProps } from 'reactflow';
import { RunSceneNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function RunSceneNode({ selected, data }: NodeProps<RunSceneNodeData>) {
  return (
    <BaseNode selected={selected} label={data.label || 'Run Scene'} icon="▶️" color="bg-indigo-800">
      <p className="text-sm text-indigo-200 font-semibold">{data.sceneName || 'Scene'}</p>
      <p className="text-xs text-indigo-100">
        {data.returnToSource ? '↩️ Return after' : '→ Continue'}
      </p>
    </BaseNode>
  );
}
