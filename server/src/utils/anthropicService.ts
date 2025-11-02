import Anthropic from '@anthropic-ai/sdk';
import { decryptApiKey } from './encryption';

export type ModelType = 'claude-sonnet-4-5-20250929' | 'claude-haiku-4-5-20251001';

interface AnthropicClientOptions {
  apiKey: string;
  model: ModelType;
}

export class AnthropicService {
  private client: Anthropic;
  private model: ModelType;

  constructor(options: AnthropicClientOptions) {
    this.client = new Anthropic({ apiKey: options.apiKey });
    this.model = options.model;
  }

  async generateDialogue(context: {
    speaker: string;
    npcPersonality?: string;
    sceneSoFar?: string;
    campaignContext?: string;
  }): Promise<string> {
    const prompt = `You are a D&D game master creating dialogue for an NPC.

Speaker: ${context.speaker}
${context.npcPersonality ? `NPC Personality: ${context.npcPersonality}` : ''}
${context.sceneSoFar ? `Scene Context: ${context.sceneSoFar}` : ''}
${context.campaignContext ? `Campaign Context: ${context.campaignContext}` : ''}

Generate 2-3 sentences of dialogue that fits the character and context. Keep it concise and in-character.`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    return textContent && textContent.type === 'text' ? textContent.text : '';
  }

  async generateNPCProfile(context: {
    name: string;
    role?: string;
    campaignSetting?: string;
    numberOfNPCs?: number;
  }): Promise<{
    personality: string;
    backstory: string;
    traits: string[];
    suggestedClass: string;
    suggestedRace: string;
  }> {
    const prompt = `You are a D&D game master creating an NPC profile.

NPC Name: ${context.name}
${context.role ? `Role in Campaign: ${context.role}` : ''}
${context.campaignSetting ? `Campaign Setting: ${context.campaignSetting}` : ''}

Generate a D&D NPC profile with the following structure:
1. A 2-3 sentence personality description
2. A 2-3 sentence backstory
3. Three character traits (brief, comma-separated)
4. A suggested D&D class
5. A suggested D&D race

Format your response as JSON with keys: personality, backstory, traits (array), suggestedClass, suggestedRace`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    const responseText = textContent && textContent.type === 'text' ? textContent.text : '{}';

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : responseText;

    try {
      const parsed = JSON.parse(jsonString);
      return {
        personality: parsed.personality || 'Mysterious and reserved',
        backstory: parsed.backstory || 'A wanderer with unclear origins',
        traits: Array.isArray(parsed.traits) ? parsed.traits : ['Mysterious', 'Cautious'],
        suggestedClass: parsed.suggestedClass || 'Rogue',
        suggestedRace: parsed.suggestedRace || 'Human',
      };
    } catch {
      return {
        personality: 'Mysterious and reserved',
        backstory: 'A wanderer with unclear origins',
        traits: ['Mysterious', 'Cautious'],
        suggestedClass: 'Rogue',
        suggestedRace: 'Human',
      };
    }
  }

  async suggestBranches(context: {
    currentScene: string;
    playerActions?: string;
    campaignGoal?: string;
    numberOfSuggestions?: number;
  }): Promise<string[]> {
    const numSuggestions = context.numberOfSuggestions || 3;
    const prompt = `You are a D&D game master suggesting story branches.

Current Scene: ${context.currentScene}
${context.playerActions ? `Recent Player Actions: ${context.playerActions}` : ''}
${context.campaignGoal ? `Campaign Goal: ${context.campaignGoal}` : ''}

Suggest ${numSuggestions} different story branches/plot hooks that could happen next. Keep each suggestion to 1-2 sentences.

Format as a numbered list.`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    const responseText = textContent && textContent.type === 'text' ? textContent.text : '';

    // Parse numbered list
    const branches = responseText
      .split('\n')
      .filter((line) => /^\d+\.|^-|^\*/.test(line.trim()))
      .map((line) => line.replace(/^\d+\.\s*|-\s*|\*\s*/, '').trim())
      .filter((branch) => branch.length > 0);

    return branches.length > 0 ? branches : ['A mysterious stranger approaches', 'Combat breaks out unexpectedly'];
  }

  async generateQuestHook(context: {
    questTheme?: string;
    campaignContext?: string;
    rewardType?: string;
  }): Promise<{
    title: string;
    description: string;
    objectives: string[];
    reward: string;
  }> {
    const prompt = `You are a D&D game master creating a quest hook.

${context.questTheme ? `Quest Theme: ${context.questTheme}` : ''}
${context.campaignContext ? `Campaign Context: ${context.campaignContext}` : ''}
${context.rewardType ? `Expected Reward Type: ${context.rewardType}` : ''}

Generate a D&D quest with the following structure:
1. A compelling quest title (5-10 words)
2. A 2-3 sentence quest description/hook
3. Three clear quest objectives
4. A suitable reward

Format your response as JSON with keys: title, description, objectives (array), reward`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    const responseText = textContent && textContent.type === 'text' ? textContent.text : '{}';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : responseText;

    try {
      const parsed = JSON.parse(jsonString);
      return {
        title: parsed.title || 'A Mysterious Task',
        description: parsed.description || 'Someone needs your help.',
        objectives: Array.isArray(parsed.objectives) ? parsed.objectives : ['Complete the task', 'Report back'],
        reward: parsed.reward || '100 gold pieces',
      };
    } catch {
      return {
        title: 'A Mysterious Task',
        description: 'Someone needs your help.',
        objectives: ['Complete the task', 'Report back'],
        reward: '100 gold pieces',
      };
    }
  }

  async analyzeCampaign(context: {
    campaignName: string;
    campaignDescription?: string;
    scenesCount?: number;
    npcsCount?: number;
    questsCount?: number;
  }): Promise<{
    summary: string;
    strengths: string[];
    suggestedImprovements: string[];
    narrativeFlow: string;
  }> {
    const prompt = `You are a D&D campaign designer reviewing a campaign for narrative quality.

Campaign Name: ${context.campaignName}
${context.campaignDescription ? `Description: ${context.campaignDescription}` : ''}
${context.scenesCount ? `Number of Scenes: ${context.scenesCount}` : ''}
${context.npcsCount ? `Number of NPCs: ${context.npcsCount}` : ''}
${context.questsCount ? `Number of Quests: ${context.questsCount}` : ''}

Analyze this campaign and provide:
1. A brief summary (2-3 sentences)
2. Three strengths of the campaign
3. Three suggested improvements
4. Assessment of narrative flow (1-2 sentences)

Format your response as JSON with keys: summary, strengths (array), suggestedImprovements (array), narrativeFlow`;

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === 'text');
    const responseText = textContent && textContent.type === 'text' ? textContent.text : '{}';

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : responseText;

    try {
      const parsed = JSON.parse(jsonString);
      return {
        summary: parsed.summary || 'A promising campaign with good potential.',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Good structure', 'Engaging NPCs'],
        suggestedImprovements: Array.isArray(parsed.suggestedImprovements)
          ? parsed.suggestedImprovements
          : ['Add more detail', 'Expand quest hooks'],
        narrativeFlow: parsed.narrativeFlow || 'The campaign flows well with clear progression.',
      };
    } catch {
      return {
        summary: 'A promising campaign with good potential.',
        strengths: ['Good structure', 'Engaging NPCs'],
        suggestedImprovements: ['Add more detail', 'Expand quest hooks'],
        narrativeFlow: 'The campaign flows well with clear progression.',
      };
    }
  }

  /**
   * Test if the API key and model are valid by making a minimal API call
   */
  static async testConnection(apiKey: string, model: ModelType): Promise<boolean> {
    try {
      const client = new Anthropic({ apiKey });
      const message = await client.messages.create({
        model,
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Hi',
          },
        ],
      });
      return message.content.length > 0;
    } catch {
      return false;
    }
  }
}

/**
 * Factory function to create AnthropicService from encrypted API key
 */
export async function createAnthropicServiceFromEncrypted(
  encryptedApiKey: string,
  model: ModelType
): Promise<AnthropicService> {
  const decryptedKey = decryptApiKey(encryptedApiKey);
  return new AnthropicService({
    apiKey: decryptedKey,
    model: model as ModelType,
  });
}
