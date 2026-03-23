const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

type Filter = { field: string; op: string; value: unknown }
type Order = { field: string; direction?: 'ASCENDING' | 'DESCENDING' }

function toValue(v: unknown): Record<string, unknown> {
  if (typeof v === 'string') return { stringValue: v }
  if (typeof v === 'boolean') return { booleanValue: v }
  if (typeof v === 'number') return { integerValue: String(v) }
  return { stringValue: String(v) }
}

function parseValue(v: Record<string, unknown>): unknown {
  if ('stringValue' in v) return v.stringValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('booleanValue' in v) return v.booleanValue
  if ('timestampValue' in v) return v.timestampValue
  if ('arrayValue' in v) {
    const arr = v.arrayValue as { values?: Record<string, unknown>[] }
    return (arr.values || []).map(parseValue)
  }
  if ('mapValue' in v) {
    const map = v.mapValue as { fields?: Record<string, Record<string, unknown>> }
    const out: Record<string, unknown> = {}
    for (const [k, val] of Object.entries(map.fields || {})) {
      out[k] = parseValue(val)
    }
    return out
  }
  return null
}

export async function runQuery(
  collection: string,
  filters: Filter[] = [],
  orderBy?: Order
): Promise<{ id: string; data: Record<string, unknown> }[]> {
  const where = filters.length > 1
    ? { compositeFilter: { op: 'AND', filters: filters.map(f => ({ fieldFilter: { field: { fieldPath: f.field }, op: f.op, value: toValue(f.value) } })) } }
    : filters.length === 1
    ? { fieldFilter: { field: { fieldPath: filters[0].field }, op: filters[0].op, value: toValue(filters[0].value) } }
    : undefined

  const body = {
    structuredQuery: {
      from: [{ collectionId: collection }],
      ...(where ? { where } : {}),
      ...(orderBy ? { orderBy: [{ field: { fieldPath: orderBy.field }, direction: orderBy.direction || 'ASCENDING' }] } : {}),
    }
  }

  const res = await fetch(`${BASE}:runQuery?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`Firestore query failed: ${res.status}`)

  const rows = await res.json() as Array<{ document?: { name: string; fields: Record<string, Record<string, unknown>> } }>

  return rows
    .filter(r => r.document)
    .map(r => {
      const doc = r.document!
      const id = doc.name.split('/').pop()!
      const data: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(doc.fields || {})) {
        data[k] = parseValue(v)
      }
      return { id, data }
    })
}
