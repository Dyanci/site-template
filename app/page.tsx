import { notFound } from 'next/navigation'
import { getCurrentDomain } from '@/lib/tenant'
import { getPageBySlug } from '@/lib/pages'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const domain = await getCurrentDomain()
  const page =
    (await getPageBySlug(domain, 'home')) ??
    (await getPageBySlug(domain, 'index')) ??
    (await getPageBySlug(domain, '/'))

  if (!page) notFound()

  return (
    <>
      <title>{page.seoTitle || page.title}</title>
      {page.seoDesc && <meta name="description" content={page.seoDesc} />}
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </>
  )
}
