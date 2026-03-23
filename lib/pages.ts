import { runQuery } from './firestore-client'
import type { Block } from './blocks'

export type CmsPage = {
  id: string
  slug: string
  title: string
  blocks: Block[]
  seoTitle?: string
  seoDesc?: string
}

function str(val: unknown): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'object') {
    const o = val as Record<string, string>
    return o.nl || o.en || o.fr || o.de || Object.values(o)[0] || ''
  }
  return ''
}

function getBlocks(val: unknown): Block[] {
  if (!val || typeof val !== 'object') return []
  const b = val as Record<string, unknown>
  // blocks is stored as { nl: Block[], en: Block[], ... } — use nl first
  const lang = b.nl || b.en || b.fr || b.de
  if (Array.isArray(lang)) return lang as Block[]
  if (Array.isArray(val)) return val as Block[]
  return []
}

export async function getPageBySlug(domain: string, slug: string): Promise<CmsPage | null> {
  try {
    const rows = await runQuery('pages', [
      { field: 'domains', op: 'ARRAY_CONTAINS', value: domain },
      { field: 'slug', op: 'EQUAL', value: slug },
    ])
    const published = rows.filter(r => r.data.status === 'published')
    if (published.length === 0) return null
    const { id, data } = published[0]
    return {
      id,
      slug: str(data.slug),
      title: str(data.title),
      blocks: getBlocks(data.blocks),
      seoTitle: str(data.seo ? (data.seo as Record<string, unknown>).nl ? ((data.seo as Record<string, Record<string, string>>).nl?.metaTitle) : undefined : undefined) || str(data.seoTitle),
      seoDesc: str(data.seo ? (data.seo as Record<string, unknown>).nl ? ((data.seo as Record<string, Record<string, string>>).nl?.metaDescription) : undefined : undefined) || str(data.seoDesc),
    }
  } catch (e) {
    console.error('[pages] getPageBySlug error:', e)
    return null
  }
}
