// Shared types across frontend and backend

// ============ User & Auth ============
export interface User {
  id: string;
  email: string;
  name?: string;
  anthropicModel?: string; // Model choice, not the key
  createdAt: Date;
  updatedAt: Date;
}

// ============ Campaign ============
export interface Campaign {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ Scene & Node Graph ============
export type NodeType =
  | 'start'
  | 'dialogue'
  | 'choice'
  | 'branch'
  | 'variable_set'
  | 'variable_get'
  | 'npc'
  | 'encounter'
  | 'quest'
  | 'run_scene'
  | 'comment';

// Base node data
export interface BaseNodeData {
  label: string;
  description?: string;
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
}

export interface DialogueNodeData extends BaseNodeData {
  type: 'dialogue';
  speaker?: string;
  npcId?: string;
  text: string;
  voiceAudio?: string;
}

export interface ChoiceNodeData extends BaseNodeData {
  type: 'choice';
  prompt: string;
  choices: {
    id: string;
    text: string;
    requirementVariable?: string;
    requirementValue?: any;
  }[];
}

export interface BranchNodeData extends BaseNodeData {
  type: 'branch';
  conditions: {
    id: string;
    variable: string;
    operator: 'equals' | 'not_equals' | 'greater' | 'less' | 'greater_equal' | 'less_equal';
    value: any;
    outputLabel?: string;
  }[];
  defaultOutput: boolean;
}

export interface VariableSetNodeData extends BaseNodeData {
  type: 'variable_set';
  variableName: string;
  operation: 'set' | 'add' | 'subtract' | 'multiply' | 'divide';
  value: any;
  isGlobal: boolean;
}

export interface VariableGetNodeData extends BaseNodeData {
  type: 'variable_get';
  variableName: string;
  outputVariable: string;
}

export interface NPCNodeData extends BaseNodeData {
  type: 'npc';
  npcId: string;
  action: 'introduce' | 'update_status' | 'move_location';
  customData?: any;
}

export interface EncounterNodeData extends BaseNodeData {
  type: 'encounter';
  name: string;
  monsters: {
    id: string;
    name: string;
    count: number;
    cr: number;
  }[];
  environment?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'deadly';
  loot?: string;
  xpReward?: number;
}

export interface QuestNodeData extends BaseNodeData {
  type: 'quest';
  questId: string;
  action: 'start' | 'update_objective' | 'complete' | 'fail';
  objectiveIndex?: number;
}

export interface RunSceneNodeData extends BaseNodeData {
  type: 'run_scene';
  sceneId: string;
  sceneName: string;
  returnToSource: boolean;
}

export interface CommentNodeData extends BaseNodeData {
  type: 'comment';
  text: string;
  color: string;
}

export type CustomNodeData =
  | StartNodeData
  | DialogueNodeData
  | ChoiceNodeData
  | BranchNodeData
  | VariableSetNodeData
  | VariableGetNodeData
  | NPCNodeData
  | EncounterNodeData
  | QuestNodeData
  | RunSceneNodeData
  | CommentNodeData;

// React Flow node structure
export interface CustomNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: CustomNodeData;
  selected?: boolean;
}

export interface CustomEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface SceneGraph {
  nodes: CustomNode[];
  edges: CustomEdge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface Scene {
  id: string;
  name: string;
  description?: string;
  order: number;
  campaignId: string;
  graph: SceneGraph;
  variables: LocalVariable[];
  createdAt: Date;
  updatedAt: Date;
}

// ============ NPC ============
export interface DndStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface NPC {
  id: string;
  name: string;
  race?: string;
  class?: string;
  level?: number;
  stats?: DndStats;
  armorClass?: number;
  hitPoints?: number;
  personality?: string;
  appearance?: string;
  backstory?: string;
  portrait?: string;
  faction?: string;
  location?: string;
  campaignId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ Quest ============
export interface QuestObjective {
  id: string;
  text: string;
  completed: boolean;
}

export type QuestStatus = 'NOT_STARTED' | 'ACTIVE' | 'COMPLETED' | 'FAILED';

export interface Quest {
  id: string;
  name: string;
  description: string;
  objectives: QuestObjective[];
  status: QuestStatus;
  campaignId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============ Variables ============
export type VariableType = 'STRING' | 'NUMBER' | 'BOOLEAN';

export interface Variable {
  id: string;
  name: string;
  type: VariableType;
  value: string | number | boolean;
  description?: string;
}

export interface LocalVariable extends Variable {
  sceneId: string;
}

export interface GlobalVariable extends Variable {
  campaignId: string;
}

// ============ Sessions ============
export interface Session {
  id: string;
  sessionNum: number;
  date: Date;
  notes?: string;
  duration?: number;
  campaignId: string;
  createdAt: Date;
}

// ============ API Request/Response ============
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateCampaignRequest {
  name: string;
  description?: string;
}

export interface CreateSceneRequest {
  name: string;
  description?: string;
}

export interface CreateNPCRequest {
  name: string;
  race?: string;
  class?: string;
  level?: number;
  personality?: string;
  appearance?: string;
  backstory?: string;
  portrait?: string;
}

export interface CreateQuestRequest {
  name: string;
  description: string;
  objectives: string[]; // Just texts, we'll create the objects
}

export interface CreateVariableRequest {
  name: string;
  type: VariableType;
  value: any;
}
