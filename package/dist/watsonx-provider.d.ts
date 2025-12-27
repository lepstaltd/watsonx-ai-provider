import { LanguageModelV1 } from '@ai-sdk/provider';
import { FetchFunction } from '@ai-sdk/provider-utils';
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
    (modelId: WatsonxChatModelId, settings?: WatsonxChatSettings): LanguageModelV1;
    /**
     * Creates a chat model for text generation.
     */
    chatModel(modelId: WatsonxChatModelId, settings?: WatsonxChatSettings): LanguageModelV1;
}
export declare function createWatsonxProvider(options?: WatsonxProviderSettings): WatsonxProvider;
export declare const watsonx: WatsonxProvider;
