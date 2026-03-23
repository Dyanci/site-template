import { headers } from 'next/headers'

export async function getCurrentDomain(): Promise<string> {
  const h = await headers()
  const host = h.get('host') || 'localhost:3000'
  return host.replace(/:\d+$/, '').replace(/^www\./, '')
}
