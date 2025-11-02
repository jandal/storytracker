import { useState } from 'react';
import { useVariableStore } from '../../stores/variableStore';
import { v4 as uuidv4 } from 'uuid';
import { Variable } from '../../shared/src/types';

interface VariablesPanelProps {
  sceneId: string;
  campaignId: string;
}

export function VariablesPanel({ sceneId, campaignId }: VariablesPanelProps) {
  const {
    getLocalVariablesForScene,
    getGlobalVariablesForCampaign,
    addLocalVariable,
    addGlobalVariable,
    updateLocalVariable,
    updateGlobalVariable,
    deleteLocalVariable,
    deleteGlobalVariable,
  } = useVariableStore();

  const [newVarName, setNewVarName] = useState('');
  const [newVarType, setNewVarType] = useState<'STRING' | 'NUMBER' | 'BOOLEAN'>('STRING');
  const [isGlobal, setIsGlobal] = useState(false);
  const [error, setError] = useState('');

  const localVars = getLocalVariablesForScene(sceneId);
  const globalVars = getGlobalVariablesForCampaign(campaignId);

  const handleAddVariable = () => {
    if (!newVarName.trim()) {
      setError('Variable name required');
      return;
    }

    const variable: Variable = {
      id: uuidv4(),
      name: newVarName,
      type: newVarType,
      value: newVarType === 'NUMBER' ? 0 : newVarType === 'BOOLEAN' ? false : '',
    };

    if (isGlobal) {
      addGlobalVariable(campaignId, variable);
    } else {
      addLocalVariable(sceneId, variable);
    }

    setNewVarName('');
    setNewVarType('STRING');
    setIsGlobal(false);
    setError('');
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto max-h-screen">
      <h3 className="text-lg font-semibold text-white mb-4">Variables</h3>

      {/* Add new variable */}
      <div className="mb-6 p-3 bg-gray-700 rounded">
        <p className="text-xs text-gray-300 font-semibold mb-2">Add Variable</p>

        {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

        <input
          type="text"
          value={newVarName}
          onChange={(e) => setNewVarName(e.target.value)}
          placeholder="Variable name"
          className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm mb-2 focus:outline-none focus:border-blue-500"
        />

        <select
          value={newVarType}
          onChange={(e) => setNewVarType(e.target.value as any)}
          className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm mb-2 focus:outline-none focus:border-blue-500"
        >
          <option value="STRING">String</option>
          <option value="NUMBER">Number</option>
          <option value="BOOLEAN">Boolean</option>
        </select>

        <label className="flex items-center text-sm text-gray-300 mb-2">
          <input
            type="checkbox"
            checked={isGlobal}
            onChange={(e) => setIsGlobal(e.target.checked)}
            className="mr-2"
          />
          Global (campaign-wide)
        </label>

        <button
          onClick={handleAddVariable}
          className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
        >
          Add Variable
        </button>
      </div>

      {/* Local Variables */}
      {localVars.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-cyan-300 mb-2">📍 Local Variables</h4>
          <div className="space-y-2">
            {localVars.map((variable) => (
              <VariableItem
                key={variable.id}
                variable={variable}
                onUpdate={(data) => updateLocalVariable(sceneId, variable.id, data)}
                onDelete={() => deleteLocalVariable(sceneId, variable.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Global Variables */}
      {globalVars.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-yellow-300 mb-2">🌍 Global Variables</h4>
          <div className="space-y-2">
            {globalVars.map((variable) => (
              <VariableItem
                key={variable.id}
                variable={variable}
                onUpdate={(data) => updateGlobalVariable(campaignId, variable.id, data)}
                onDelete={() => deleteGlobalVariable(campaignId, variable.id)}
              />
            ))}
          </div>
        </div>
      )}

      {localVars.length === 0 && globalVars.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-8">No variables yet</p>
      )}
    </div>
  );
}

interface VariableItemProps {
  variable: Variable;
  onUpdate: (data: Partial<Variable>) => void;
  onDelete: () => void;
}

function VariableItem({ variable, onUpdate, onDelete }: VariableItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(variable.value));

  const handleSave = () => {
    const newValue =
      variable.type === 'NUMBER'
        ? Number(editValue) || 0
        : variable.type === 'BOOLEAN'
        ? editValue === 'true'
        : editValue;

    onUpdate({ value: newValue });
    setIsEditing(false);
  };

  return (
    <div className="p-2 bg-gray-700 rounded text-sm">
      <div className="flex justify-between items-start mb-1">
        <div>
          <p className="text-white font-semibold">{variable.name}</p>
          <p className="text-gray-400 text-xs">{variable.type}</p>
        </div>
        <button
          onClick={onDelete}
          className="px-2 py-1 bg-red-700 hover:bg-red-600 text-white text-xs rounded transition"
        >
          ✕
        </button>
      </div>

      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full px-2 py-1 bg-gray-600 hover:bg-gray-500 text-gray-200 text-xs rounded transition text-left"
        >
          {variable.value === '' ? '(empty)' : String(variable.value)}
        </button>
      ) : (
        <div className="space-y-1">
          {variable.type === 'BOOLEAN' ? (
            <select
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          ) : (
            <input
              type={variable.type === 'NUMBER' ? 'number' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-xs focus:outline-none focus:border-blue-500"
            />
          )}
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="flex-1 px-2 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
