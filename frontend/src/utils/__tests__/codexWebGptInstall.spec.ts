import { describe, expect, it } from 'vitest'
import { buildCodexWebGptInstallLink } from '@/utils/codexWebGptInstall'

describe('Codex Web GPT install links', () => {
  it('carries only a normalized Responses endpoint and display name', () => {
    const link = buildCodexWebGptInstallLink({
      baseUrl: 'https://gateway.example/',
      name: 'Sub2API Responses bridge'
    })
    expect(link).toBe(
      'codexwebgpt://install/responses?endpoint=https%3A%2F%2Fgateway.example%2Fv1&name=Sub2API+Responses+bridge'
    )
    expect(link).not.toContain('apiKey')
    expect(link).not.toContain('secret')
  })

  it('rejects endpoints that could leak credentials or bypass HTTPS', () => {
    for (const baseUrl of [
      'http://gateway.example',
      'https://user:secret@gateway.example',
      'https://gateway.example?apiKey=secret',
      'https://gateway.example#secret'
    ]) {
      expect(() => buildCodexWebGptInstallLink({
        baseUrl,
        name: 'Sub2API Responses bridge'
      })).toThrow()
    }
  })
})
