import { useState } from 'react';
import { aiApi } from '../api/client';

interface UseAIOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function useAI(options?: UseAIOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDialogue = async (speaker: string, context?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiApi.generateDialogue(
        speaker,
        context?.npcPersonality,
        context?.sceneSoFar,
        context?.campaignContext
      );
      const data = response.data;
      options?.onSuccess?.(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to generate dialogue';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateNPC = async (name: string, context?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiApi.generateNPC(name, context?.role, context?.campaignSetting);
      const data = response.data;
      options?.onSuccess?.(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to generate NPC';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const suggestBranches = async (currentScene: string, context?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiApi.suggestBranches(
        currentScene,
        context?.playerActions,
        context?.campaignGoal,
        context?.numberOfSuggestions
      );
      const data = response.data;
      options?.onSuccess?.(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to suggest branches';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuest = async (context?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiApi.generateQuest(context?.questTheme, context?.campaignContext, context?.rewardType);
      const data = response.data;
      options?.onSuccess?.(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to generate quest';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCampaign = async (campaignId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await aiApi.analyzeCampaign(campaignId);
      const data = response.data;
      options?.onSuccess?.(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to analyze campaign';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    generateDialogue,
    generateNPC,
    suggestBranches,
    generateQuest,
    analyzeCampaign,
  };
}
