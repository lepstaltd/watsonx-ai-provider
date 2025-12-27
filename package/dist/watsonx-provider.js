"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watsonx = void 0;
exports.createWatsonxProvider = createWatsonxProvider;
const openai_compatible_1 = require("@ai-sdk/openai-compatible");
const provider_utils_1 = require("@ai-sdk/provider-utils");
function createWatsonxProvider(options = {}) {
    var _a, _b;
    const baseURL = (0, provider_utils_1.withoutTrailingSlash)((_a = options.baseURL) !== null && _a !== void 0 ? _a : 'https://us-south.ml.cloud.ibm.com/ml/v1');
    const version = (_b = options.version) !== null && _b !== void 0 ? _b : '2024-05-31';
    const getHeaders = () => {
        const apiKey = (0, provider_utils_1.loadApiKey)({
            apiKey: options.apiKey,
            environmentVariableName: 'WATSONX_API_KEY',
            description: 'WatsonX API key',
        });
        return {
            'Authorization': `Bearer ${apiKey}`,
            ...options.headers,
        };
    };
    const getCommonModelConfig = (modelType) => ({
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
    const createChatModel = (modelId, settings = {}) => {
        return new openai_compatible_1.OpenAICompatibleChatLanguageModel(modelId, settings, // WatsonX settings are compatible with OpenAI settings
        getCommonModelConfig('chat'));
    };
    const provider = function (modelId, settings) {
        if (new.target) {
            throw new Error('The WatsonX model factory function cannot be called with the new keyword.');
        }
        return createChatModel(modelId, settings);
    };
    provider.chatModel = createChatModel;
    return provider;
}
// default provider instance
exports.watsonx = createWatsonxProvider();
