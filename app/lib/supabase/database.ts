import "server-only";

import { getSupabaseConfig } from "./config";

export type EscrowMilestoneRow = {
  id: string;
  tier: "D" | "C" | "B" | "A";
  position: number;
  allocation_bps: number;
  status: "locked" | "pending" | "released" | "cancelled";
  released_at: string | null;
};

export type InvestmentRow = {
  id: string;
  athlete_reference: string;
  amount: number;
  currency: "USDC";
  status: "draft" | "pending" | "confirmed" | "cancelled" | "completed";
  transaction_hash: string | null;
  created_at: string;
  escrow_milestones: EscrowMilestoneRow[];
};

export async function getMyInvestments(
  accessToken: string,
): Promise<InvestmentRow[]> {
  const config = getSupabaseConfig();
  if (!config) return [];

  const query = new URLSearchParams({
    select:
      "id,athlete_reference,amount,currency,status,transaction_hash,created_at,escrow_milestones(id,tier,position,allocation_bps,status,released_at)",
    order: "created_at.desc",
  });

  const response = await fetch(
    `${config.url}/rest/v1/investments?${query.toString()}`,
    {
      headers: {
        apikey: config.publishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Unable to load investments.");
  }

  return (await response.json()) as InvestmentRow[];
}
