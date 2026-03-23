import { notFound } from 'next/navigation'
import { getCurrentDomain } from '@/lib/tenant'
import { getPageBySlug } from '@/lib/pages'
import BlockRenderer from '@/components/BlockRenderer'

export const dynamic = 'force-dynamic'

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugParts } = await params
  const slug = slugParts.join('/')
  const domain = await getCurrentDomain()
  const page = await getPageBySlug(domain, slug)

  if (!page) notFound()

  return (
    <>
      <title>{page.seoTitle || page.title}</title>
      {page.seoDesc && <meta name="description" content={page.seoDesc} />}
      <main>
        <BlockRenderer blocks={page.blocks} />
      </main>
    </>
  )
}
