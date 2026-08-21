import { describe, expect, it } from 'vitest'
import {
  CHATGPT_WEB_BRIDGE_TIERS,
  buildChatGPTWebIdentityMappings,
  isChatGPTWebBridgePresetFields,
  normalizeChatGPTWebBridgeTiers,
  readChatGPTWebIdentityTiers
} from '../openAIResponsesBridgePreset'

describe('OpenAI Responses bridge preset helpers', () => {
  it('keeps only known discovered tiers in stable bridge order', () => {
    expect(normalizeChatGPTWebBridgeTiers([
      'chatgpt-web/high',
      'gpt-5.6-sol',
      'chatgpt-web/light',
      'chatgpt-web/high',
      'chatgpt-web/not-real'
    ])).toEqual(['chatgpt-web/light', 'chatgpt-web/high'])
  })

  it('builds identity mappings only for selected discovered tiers', () => {
    expect(buildChatGPTWebIdentityMappings(['chatgpt-web/pro', 'gpt-5.6-sol'])).toEqual({
      'chatgpt-web/pro': 'chatgpt-web/pro'
    })
    expect(buildChatGPTWebIdentityMappings([])).toBeUndefined()
  })

  it('rehydrates only exact identity mappings', () => {
    expect(readChatGPTWebIdentityTiers({
      'chatgpt-web/light': 'chatgpt-web/light',
      'chatgpt-web/high': 'another-model',
      'chatgpt-web/pro': 'chatgpt-web/pro',
      'gpt-5.6-sol': 'gpt-5.6-sol'
    })).toEqual(['chatgpt-web/light', 'chatgpt-web/pro'])
  })

  it('infers the unofficial preset only from generic strict Responses fields', () => {
    const credentials = {
      model_mapping: Object.fromEntries(CHATGPT_WEB_BRIDGE_TIERS.slice(0, 2).map((tier) => [tier, tier]))
    }
    expect(isChatGPTWebBridgePresetFields(credentials, {
      openai_responses_forward_mode: 'strict_raw',
      openai_responses_mode: 'force_responses'
    })).toBe(true)
    expect(isChatGPTWebBridgePresetFields(credentials, {
      openai_responses_forward_mode: 'strict_raw',
      openai_responses_mode: 'auto'
    })).toBe(false)
  })
})
