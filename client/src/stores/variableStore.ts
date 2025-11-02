import { create } from 'zustand';
import { Variable } from '../../../shared/src/types';

interface VariableStore {
  localVariables: Record<string, Variable>; // sceneId -> variables
  globalVariables: Record<string, Variable>; // campaignId -> variables

  setLocalVariables: (sceneId: string, variables: Variable[]) => void;
  setGlobalVariables: (campaignId: string, variables: Variable[]) => void;

  addLocalVariable: (sceneId: string, variable: Variable) => void;
  addGlobalVariable: (campaignId: string, variable: Variable) => void;

  updateLocalVariable: (sceneId: string, variableId: string, data: Partial<Variable>) => void;
  updateGlobalVariable: (campaignId: string, variableId: string, data: Partial<Variable>) => void;

  deleteLocalVariable: (sceneId: string, variableId: string) => void;
  deleteGlobalVariable: (campaignId: string, variableId: string) => void;

  getLocalVariable: (sceneId: string, variableId: string) => Variable | undefined;
  getGlobalVariable: (campaignId: string, variableId: string) => Variable | undefined;

  getLocalVariablesForScene: (sceneId: string) => Variable[];
  getGlobalVariablesForCampaign: (campaignId: string) => Variable[];

  clear: () => void;
}

export const useVariableStore = create<VariableStore>((set, get) => ({
  localVariables: {},
  globalVariables: {},

  setLocalVariables: (sceneId, variables) =>
    set((state) => ({
      localVariables: {
        ...state.localVariables,
        [sceneId]: variables.reduce(
          (acc, v) => ({ ...acc, [v.id]: v }),
          {}
        ),
      },
    })),

  setGlobalVariables: (campaignId, variables) =>
    set((state) => ({
      globalVariables: {
        ...state.globalVariables,
        [campaignId]: variables.reduce(
          (acc, v) => ({ ...acc, [v.id]: v }),
          {}
        ),
      },
    })),

  addLocalVariable: (sceneId, variable) =>
    set((state) => ({
      localVariables: {
        ...state.localVariables,
        [sceneId]: {
          ...(state.localVariables[sceneId] || {}),
          [variable.id]: variable,
        },
      },
    })),

  addGlobalVariable: (campaignId, variable) =>
    set((state) => ({
      globalVariables: {
        ...state.globalVariables,
        [campaignId]: {
          ...(state.globalVariables[campaignId] || {}),
          [variable.id]: variable,
        },
      },
    })),

  updateLocalVariable: (sceneId, variableId, data) =>
    set((state) => ({
      localVariables: {
        ...state.localVariables,
        [sceneId]: {
          ...(state.localVariables[sceneId] || {}),
          [variableId]: {
            ...state.localVariables[sceneId]?.[variableId],
            ...data,
          } as Variable,
        },
      },
    })),

  updateGlobalVariable: (campaignId, variableId, data) =>
    set((state) => ({
      globalVariables: {
        ...state.globalVariables,
        [campaignId]: {
          ...(state.globalVariables[campaignId] || {}),
          [variableId]: {
            ...state.globalVariables[campaignId]?.[variableId],
            ...data,
          } as Variable,
        },
      },
    })),

  deleteLocalVariable: (sceneId, variableId) =>
    set((state) => {
      const newVars = { ...state.localVariables[sceneId] };
      delete newVars[variableId];
      return {
        localVariables: {
          ...state.localVariables,
          [sceneId]: newVars,
        },
      };
    }),

  deleteGlobalVariable: (campaignId, variableId) =>
    set((state) => {
      const newVars = { ...state.globalVariables[campaignId] };
      delete newVars[variableId];
      return {
        globalVariables: {
          ...state.globalVariables,
          [campaignId]: newVars,
        },
      };
    }),

  getLocalVariable: (sceneId, variableId) => {
    const vars = get().localVariables[sceneId];
    return vars?.[variableId];
  },

  getGlobalVariable: (campaignId, variableId) => {
    const vars = get().globalVariables[campaignId];
    return vars?.[variableId];
  },

  getLocalVariablesForScene: (sceneId) => {
    const vars = get().localVariables[sceneId];
    return vars ? Object.values(vars) : [];
  },

  getGlobalVariablesForCampaign: (campaignId) => {
    const vars = get().globalVariables[campaignId];
    return vars ? Object.values(vars) : [];
  },

  clear: () => set({ localVariables: {}, globalVariables: {} }),
}));
