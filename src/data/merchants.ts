import type { Merchant } from "@/types";

import merchantsSeed from "./merchants.json";

const merchants: Merchant[] = merchantsSeed as Merchant[];

export function getMerchants(): Merchant[] {
  return merchants;
}

export function getMerchantById(id: string): Merchant | undefined {
  return merchants.find((merchant) => merchant.id === id);
}
