import type { Conversation } from "@/types";

import conversationsSeed from "./conversations.json";

const conversations: Conversation[] = conversationsSeed as Conversation[];

export function getConversations(): Conversation[] {
  return conversations;
}
