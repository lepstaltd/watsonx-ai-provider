import { type WatsonXAI } from "@ibm-cloud/watsonx-ai";
import { type LanguageModelV1Prompt } from "@ai-sdk/provider";
export declare function convertToWatsonxChatMessages(prompt: LanguageModelV1Prompt): (WatsonXAI.TextChatMessagesTextChatMessageSystem | WatsonXAI.TextChatMessagesTextChatMessageAssistant | WatsonXAI.TextChatMessagesTextChatMessageUser | WatsonXAI.TextChatMessagesTextChatMessageTool)[];
