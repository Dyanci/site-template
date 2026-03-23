import { runQuery } from './firestore-client'

export type CmsPage = {
  id: string
  slug: string
  title: string
  content: string
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
      content: str(data.content),
      seoTitle: str(data.seoTitle),
      seoDesc: str(data.seoDesc),
    }
  } catch (e) {
    console.error('[pages] getPageBySlug error:', e)
    return null
  }
}
