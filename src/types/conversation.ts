export type ConversationIcon = "message" | "chart";

export interface Conversation {
  id: string;
  icon: ConversationIcon;
  title: string;
  subtitle: string;
  /** ISO 8601 date (YYYY-MM-DD). */
  date: string;
}
