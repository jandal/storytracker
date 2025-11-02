import { NodeProps } from 'reactflow';
import { ChoiceNodeData } from '../../../shared/src/types';
import { BaseNode } from './BaseNode';

export function ChoiceNode({ selected, data }: NodeProps<ChoiceNodeData>) {
  return (
    <BaseNode selected={selected} label="Choice" icon="🎯" color="bg-purple-800">
      <p className="text-sm text-purple-200 font-semibold mb-2">{data.prompt || 'Question?'}</p>
      <div className="space-y-1">
        {data.choices.slice(0, 2).map((choice) => (
          <p key={choice.id} className="text-xs text-purple-100">
            • {choice.text}
          </p>
        ))}
        {data.choices.length > 2 && (
          <p className="text-xs text-purple-300">+{data.choices.length - 2} more</p>
        )}
      </div>
    </BaseNode>
  );
}
