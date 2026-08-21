export const CHATGPT_WEB_BRIDGE_TIERS = [
  'chatgpt-web/light',
  'chatgpt-web/medium',
  'chatgpt-web/high',
  'chatgpt-web/extra-high',
  'chatgpt-web/pro'
] as const

export type ChatGPTWebBridgeTier = (typeof CHATGPT_WEB_BRIDGE_TIERS)[number]

const CHATGPT_WEB_BRIDGE_TIER_SET = new Set<string>(CHATGPT_WEB_BRIDGE_TIERS)

export function normalizeChatGPTWebBridgeTiers(values: readonly string[]): ChatGPTWebBridgeTier[] {
  const selected = new Set(values.map((value) => value.trim()))
  return CHATGPT_WEB_BRIDGE_TIERS.filter((tier) => selected.has(tier))
}

export function buildChatGPTWebIdentityMappings(
  values: readonly string[]
): Record<string, string> | undefined {
  const tiers = normalizeChatGPTWebBridgeTiers(values)
  if (tiers.length === 0) return undefined
  return Object.fromEntries(tiers.map((tier) => [tier, tier]))
}

export function readChatGPTWebIdentityTiers(mapping: unknown): ChatGPTWebBridgeTier[] {
  if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) return []
  const record = mapping as Record<string, unknown>
  return CHATGPT_WEB_BRIDGE_TIERS.filter((tier) => record[tier] === tier)
}

export function isChatGPTWebBridgePresetFields(
  credentials: Record<string, unknown> | undefined,
  extra: Record<string, unknown> | undefined
): boolean {
  if (extra?.openai_responses_forward_mode !== 'strict_raw') return false
  if (extra?.openai_responses_mode !== 'force_responses') return false
  return readChatGPTWebIdentityTiers(credentials?.model_mapping).length > 0
}

export function isChatGPTWebBridgeTier(value: string): value is ChatGPTWebBridgeTier {
  return CHATGPT_WEB_BRIDGE_TIER_SET.has(value)
}
