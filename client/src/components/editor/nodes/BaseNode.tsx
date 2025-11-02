import { Handle, Position } from 'reactflow';
import clsx from 'clsx';

interface BaseNodeProps {
  selected?: boolean;
  label: string;
  icon: string;
  color: string;
  children?: React.ReactNode;
  hasInput?: boolean;
  hasOutput?: boolean;
}

export function BaseNode({
  selected,
  label,
  icon,
  color,
  children,
  hasInput = true,
  hasOutput = true,
}: BaseNodeProps) {
  return (
    <div
      className={clsx(
        'min-w-[200px] rounded-lg shadow-lg border-2 transition',
        color,
        selected ? 'border-blue-400 shadow-blue-500/50' : 'border-transparent'
      )}
    >
      {hasInput && <Handle type="target" position={Position.Top} />}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{icon}</span>
          <span className="font-semibold text-white">{label}</span>
        </div>
        {children}
      </div>

      {hasOutput && <Handle type="source" position={Position.Bottom} />}
    </div>
  );
}
