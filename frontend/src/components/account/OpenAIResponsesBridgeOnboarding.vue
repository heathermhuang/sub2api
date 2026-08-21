<template>
  <div class="space-y-4" :data-testid="`${testIdPrefix}-openai-connection-panel`">
    <fieldset>
      <legend :id="`${testIdPrefix}-openai-connection-target-label`" class="input-label">
        {{ t('admin.accounts.openai.bridgeOnboarding.connectionTarget') }}
      </legend>
      <p class="input-hint mb-3">{{ t('admin.accounts.openai.bridgeOnboarding.connectionTargetDesc') }}</p>
      <div
        class="grid grid-cols-1 gap-2 sm:grid-cols-2"
        role="radiogroup"
        :aria-labelledby="`${testIdPrefix}-openai-connection-target-label`"
      >
        <ChoiceCard
          :active="connectionTarget === 'api'"
          :data-testid="`${testIdPrefix}-openai-target-api`"
          :description="t('admin.accounts.openai.bridgeOnboarding.apiTargetDesc')"
          :label="t('admin.accounts.openai.bridgeOnboarding.apiTarget')"
          @click="emit('select-target', 'api')"
        />
        <ChoiceCard
          :active="connectionTarget === 'responses_bridge'"
          :data-testid="`${testIdPrefix}-openai-target-responses-bridge`"
          :description="t('admin.accounts.openai.bridgeOnboarding.responsesBridgeTargetDesc')"
          :label="t('admin.accounts.openai.bridgeOnboarding.responsesBridgeTarget')"
          @click="emit('select-target', 'responses_bridge')"
        />
      </div>
    </fieldset>

    <div
      v-if="connectionTarget === 'responses_bridge'"
      class="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-dark-600 dark:bg-dark-700"
    >
      <fieldset>
        <legend :id="`${testIdPrefix}-openai-bridge-preset-label`" class="input-label">
          {{ t('admin.accounts.openai.bridgeOnboarding.bridgeType') }}
        </legend>
        <div
          class="grid grid-cols-1 gap-2 sm:grid-cols-2"
          role="radiogroup"
          :aria-labelledby="`${testIdPrefix}-openai-bridge-preset-label`"
        >
          <ChoiceCard
            compact
            :active="bridgePreset === 'generic'"
            :data-testid="`${testIdPrefix}-openai-bridge-generic`"
            :description="t('admin.accounts.openai.bridgeOnboarding.genericBridgeDesc')"
            :label="t('admin.accounts.openai.bridgeOnboarding.genericBridge')"
            @click="emit('select-preset', 'generic')"
          />
          <ChoiceCard
            compact
            :active="bridgePreset === 'chatgpt_web'"
            :data-testid="`${testIdPrefix}-openai-bridge-chatgpt-web`"
            :description="t('admin.accounts.openai.bridgeOnboarding.chatGPTWebBridgeDesc')"
            :label="t('admin.accounts.openai.bridgeOnboarding.chatGPTWebBridge')"
            @click="emit('select-preset', 'chatgpt_web')"
          />
        </div>
      </fieldset>

      <fieldset>
        <legend :id="`${testIdPrefix}-openai-bridge-auth-label`" class="input-label">
          {{ t('admin.accounts.openai.bridgeOnboarding.upstreamProtection') }}
        </legend>
        <div
          class="grid grid-cols-1 gap-2 sm:grid-cols-2"
          role="radiogroup"
          :aria-labelledby="`${testIdPrefix}-openai-bridge-auth-label`"
        >
          <ChoiceCard
            compact
            :active="bridgeAuth === 'bearer'"
            :data-testid="`${testIdPrefix}-openai-bridge-auth-bearer`"
            :description="t('admin.accounts.openai.bridgeOnboarding.bearerProtectionDesc')"
            :label="t('admin.accounts.openai.bridgeOnboarding.bearerProtection')"
            @click="emit('select-auth', 'bearer')"
          />
          <ChoiceCard
            compact
            :active="bridgeAuth === 'private'"
            :data-testid="`${testIdPrefix}-openai-bridge-auth-private`"
            :description="t('admin.accounts.openai.bridgeOnboarding.privateProtectionDesc')"
            :label="t('admin.accounts.openai.bridgeOnboarding.privateProtection')"
            @click="emit('select-auth', 'private')"
          />
        </div>
      </fieldset>

      <div class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
        {{ t('admin.accounts.openai.forwardModeStrictWarning') }}
      </div>

      <fieldset v-if="bridgePreset === 'chatgpt_web'">
        <legend class="input-label">{{ t('admin.accounts.openai.bridgeOnboarding.discoveredTiers') }}</legend>
        <p class="input-hint mb-2">{{ t('admin.accounts.openai.bridgeOnboarding.discoveredTiersDesc') }}</p>
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label
            v-for="tier in CHATGPT_WEB_BRIDGE_TIERS"
            :key="tier"
            class="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-dark-600 dark:bg-dark-800"
          >
            <input
              type="checkbox"
              :data-testid="`${testIdPrefix}-chatgpt-web-tier-${tier.split('/')[1]}`"
              :checked="tiers.includes(tier)"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-500"
              @change="emit('toggle-tier', tier)"
            />
            <span class="font-mono text-xs text-gray-700 dark:text-gray-200">{{ tier }}</span>
          </label>
        </div>
      </fieldset>

      <div
        v-if="bridgePreset === 'chatgpt_web'"
        class="grid grid-cols-1 gap-2 text-xs text-gray-600 dark:text-gray-300 sm:grid-cols-2"
        :data-testid="`${testIdPrefix}-chatgpt-web-preset-summary`"
      >
        <span>• {{ t('admin.accounts.openai.bridgeOnboarding.forceResponsesSummary') }}</span>
        <span>• {{ t('admin.accounts.openai.bridgeOnboarding.httpOnlySummary') }}</span>
        <span>• {{ t('admin.accounts.openai.bridgeOnboarding.billingProbeOffSummary') }}</span>
        <span>• {{ t('admin.accounts.openai.bridgeOnboarding.concurrencyOneSummary') }}</span>
        <span class="sm:col-span-2">• {{ t('admin.accounts.openai.bridgeOnboarding.headerOverrideSummary') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  CHATGPT_WEB_BRIDGE_TIERS,
  type ChatGPTWebBridgeTier
} from '@/utils/openAIResponsesBridgePreset'

type ConnectionTarget = 'api' | 'responses_bridge'
type BridgePreset = 'generic' | 'chatgpt_web'
type BridgeAuth = 'bearer' | 'private'

defineProps<{
  testIdPrefix: 'create' | 'edit'
  connectionTarget: ConnectionTarget
  bridgePreset: BridgePreset
  bridgeAuth: BridgeAuth
  tiers: ChatGPTWebBridgeTier[]
}>()

const emit = defineEmits<{
  (event: 'select-target', target: ConnectionTarget): void
  (event: 'select-preset', preset: BridgePreset): void
  (event: 'select-auth', auth: BridgeAuth): void
  (event: 'toggle-tier', tier: ChatGPTWebBridgeTier): void
}>()

const { t } = useI18n()

const ChoiceCard = defineComponent({
  inheritAttrs: false,
  props: {
    active: { type: Boolean, required: true },
    compact: { type: Boolean, default: false },
    label: { type: String, required: true },
    description: { type: String, required: true }
  },
  emits: ['click'],
  setup(props, { attrs, emit: emitChoice }) {
    return () => h('button', {
      ...attrs,
      type: 'button',
      role: 'radio',
      'aria-checked': String(props.active),
      'data-testid': attrs['data-testid'],
      class: [
        'min-h-[44px] rounded-lg border text-left transition-colors',
        props.compact ? 'px-3 py-2 text-sm' : 'px-4 py-3',
        props.active
          ? 'border-primary-500 bg-white text-primary-700 dark:bg-dark-800 dark:text-primary-300'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-gray-200'
      ],
      onClick: () => emitChoice('click')
    }, [
      h('span', { class: 'block text-sm font-medium' }, props.label),
      h('span', { class: 'mt-1 block text-xs opacity-75' }, props.description)
    ])
  }
})
</script>
