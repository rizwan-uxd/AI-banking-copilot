import type { Conversation } from "@/types";

import conversationsSeed from "./conversations.json";
import { reanchorToToday } from "./demo-clock";

const conversations: Conversation[] = conversationsSeed as Conversation[];

export function getConversations(): Conversation[] {
  return reanchorToToday(conversations);
}
