export interface CodexWebGptInstallInput {
  baseUrl: string
  name: string
}

function normalizeResponsesEndpoint(baseUrl: string): string {
  const parsed = new URL(baseUrl)
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error('Codex Web GPT installation requires a credential-free HTTPS endpoint')
  }
  const pathname = parsed.pathname.replace(/\/+$/, '')
  parsed.pathname = pathname.endsWith('/v1') ? pathname : `${pathname}/v1`
  return parsed.toString().replace(/\/$/, '')
}

export function buildCodexWebGptInstallLink(input: CodexWebGptInstallInput): string {
  const name = input.name.trim()
  if (!name || name.length > 80 || /[\r\n\u0000-\u001f]/.test(name)) {
    throw new Error('Codex Web GPT provider name is invalid')
  }
  const params = new URLSearchParams({
    endpoint: normalizeResponsesEndpoint(input.baseUrl),
    name
  })
  return `codexwebgpt://install/responses?${params.toString()}`
}
