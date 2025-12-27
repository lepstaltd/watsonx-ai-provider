import { LanguageModelV1 } from '@ai-sdk/provider';
import { OpenAICompatibleChatLanguageModel } from '@ai-sdk/openai-compatible';
import { FetchFunction, loadApiKey, withoutTrailingSlash } from '@ai-sdk/provider-utils';
import { WatsonxChatModelId, WatsonxChatSettings } from "./watsonx-chat-settings";

export interface WatsonxProviderSettings {
  /**
   * WatsonX API key for authentication.
   */
  apiKey?: string;

  /**
   * WatsonX project ID (required for WatsonX).
   */
  projectId?: string;

  /**
   * Base URL for the WatsonX API calls.
   * @default 'https://us-south.ml.cloud.ibm.com/ml/v1'
   */
  baseURL?: string;

  /**
   * API version to use.
   * @default '2024-05-31'
   */
  version?: string;

  /**
   * Custom headers to include in the requests.
   */
  headers?: Record<string, string>;

  /**
   * Custom fetch implementation.
   */
  fetch?: FetchFunction;
}

export interface WatsonxProvider {
  /**
   * Creates a model for text generation.
   */
  (
    modelId: WatsonxChatModelId,
    settings?: WatsonxChatSettings,
  ): LanguageModelV1;

  /**
   * Creates a chat model for text generation.
   */
  chatModel(
    modelId: WatsonxChatModelId,
    settings?: WatsonxChatSettings,
  ): LanguageModelV1;
}

export function createWatsonxProvider(
  options: WatsonxProviderSettings = {},
): WatsonxProvider {
  const baseURL = withoutTrailingSlash(
    options.baseURL ?? 'https://us-south.ml.cloud.ibm.com/ml/v1',
  );

  const version = options.version ?? '2024-05-31';

  const getHeaders = () => {
    const apiKey = loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: 'WATSONX_API_KEY',
      description: 'WatsonX API key',
    });

    return {
      'Authorization': `Bearer ${apiKey}`,
      ...options.headers,
    };
  };

  interface CommonModelConfig {
    provider: string;
    url: ({ path }: { path: string }) => string;
    headers: () => Record<string, string>;
    fetch?: FetchFunction;
  }

  const getCommonModelConfig = (modelType: string): CommonModelConfig => ({
    provider: `watsonx.${modelType}`,
    url: ({ path }) => {
      const url = new URL(`${baseURL}${path}`);

      // Add version and projectId as query parameters
      url.searchParams.set('version', version);
      if (options.projectId) {
        url.searchParams.set('project_id', options.projectId);
      }

      return url.toString();
    },
    headers: getHeaders,
    fetch: options.fetch,
  });

  const createChatModel = (
    modelId: WatsonxChatModelId,
    settings: WatsonxChatSettings = {},
  ) => {
    return new OpenAICompatibleChatLanguageModel(
      modelId,
      settings as any, // WatsonX settings are compatible with OpenAI settings
      getCommonModelConfig('chat'),
    );
  };

  const provider = function (
    modelId: WatsonxChatModelId,
    settings?: WatsonxChatSettings,
  ) {
    if (new.target) {
      throw new Error(
        'The WatsonX model factory function cannot be called with the new keyword.',
      );
    }

    return createChatModel(modelId, settings);
  };

  provider.chatModel = createChatModel;

  return provider;
}

// default provider instance
export const watsonx = createWatsonxProvider();
