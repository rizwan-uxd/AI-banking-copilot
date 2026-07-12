import type { TransactionCategory } from "./transaction";

export interface Merchant {
  id: string;
  name: string;
  defaultCategory: TransactionCategory;
}
