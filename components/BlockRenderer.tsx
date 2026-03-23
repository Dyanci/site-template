import type { Block } from '@/lib/blocks'

function blockStyle(data: Record<string, unknown>): React.CSSProperties {
  return {
    paddingTop: data.paddingTop ? `${data.paddingTop}px` : undefined,
    paddingBottom: data.paddingBottom ? `${data.paddingBottom}px` : undefined,
    paddingLeft: data.paddingLeft ? `${data.paddingLeft}px` : undefined,
    paddingRight: data.paddingRight ? `${data.paddingRight}px` : undefined,
    backgroundColor: (data.backgroundColor as string) || undefined,
  }
}

function RenderBlock({ block }: { block: Block }) {
  const { type, data } = block
  const style = blockStyle(data)
  const cls = (data.cssClass as string) || ''

  switch (type) {
    case 'heading': {
      const Tag = (data.headingTag as keyof JSX.IntrinsicElements) || 'h2'
      const sizes: Record<string, string> = { xs: '0.75rem', sm: '1rem', md: '1.25rem', lg: '1.5rem', xl: '1.875rem', '2xl': '2.25rem', '3xl': '3rem', '4xl': '3.75rem' }
      return (
        <Tag className={cls} style={{ ...style, textAlign: (data.headingAlign as 'left' | 'center' | 'right') || 'left', fontSize: sizes[data.headingSize as string] || '1.5rem', color: (data.headingColor as string) || undefined }}>
          {data.headingText as string}
        </Tag>
      )
    }
    case 'text':
      return <div className={cls} style={style} dangerouslySetInnerHTML={{ __html: (data.textContent as string) || '' }} />

    case 'html':
      return <div className={cls} style={style} dangerouslySetInnerHTML={{ __html: (data.htmlCode as string) || '' }} />

    case 'image':
      return (
        <div className={cls} style={{ ...style, textAlign: (data.imageAlign as 'left' | 'center' | 'right') || 'left' }}>
          {data.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.imageUrl as string}
              alt={(data.imageAlt as string) || ''}
              style={{ maxWidth: (data.imageWidth as string) || '100%' }}
            />
          )}
          {data.imageCaption && <p style={{ fontSize: '0.875rem', color: '#666' }}>{data.imageCaption as string}</p>}
        </div>
      )

    case 'button': {
      const variants: Record<string, React.CSSProperties> = {
        primary: { backgroundColor: '#6366f1', color: '#fff', border: 'none' },
        secondary: { backgroundColor: '#334155', color: '#fff', border: 'none' },
        outline: { backgroundColor: 'transparent', color: '#6366f1', border: '2px solid #6366f1' },
        ghost: { backgroundColor: 'transparent', color: '#6366f1', border: 'none' },
      }
      const sizes: Record<string, React.CSSProperties> = { sm: { padding: '6px 14px', fontSize: '0.875rem' }, md: { padding: '10px 20px', fontSize: '1rem' }, lg: { padding: '14px 28px', fontSize: '1.125rem' } }
      return (
        <div className={cls} style={{ ...style, textAlign: (data.buttonAlign as 'left' | 'center' | 'right') || 'left' }}>
          <a
            href={(data.buttonUrl as string) || '#'}
            target={data.buttonNewTab ? '_blank' : undefined}
            rel={data.buttonNewTab ? 'noopener noreferrer' : undefined}
            style={{ ...variants[(data.buttonVariant as string) || 'primary'], ...sizes[(data.buttonSize as string) || 'md'], display: 'inline-block', borderRadius: '8px', textDecoration: 'none', cursor: 'pointer' }}
          >
            {data.buttonLabel as string}
          </a>
        </div>
      )
    }

    case 'divider':
      return <hr className={cls} style={{ ...style, borderStyle: (data.dividerStyle as string) || 'solid', borderColor: (data.dividerColor as string) || '#e5e7eb', width: (data.dividerWidth as string) || '100%' }} />

    case 'spacer':
      return <div className={cls} style={{ height: `${(data.spacerHeight as number) || 40}px` }} />

    case 'hero': {
      const overlay = (data.heroOverlay as number) ?? 40
      return (
        <div className={cls} style={{ ...style, position: 'relative', minHeight: (data.heroHeight as string) || '400px', backgroundImage: data.heroBgImage ? `url(${data.heroBgImage})` : undefined, backgroundColor: (data.heroBgColor as string) || '#1e293b', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center' }}>
          {data.heroBgImage && <div style={{ position: 'absolute', inset: 0, backgroundColor: `rgba(0,0,0,${overlay / 100})` }} />}
          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px', margin: '0 auto', padding: '40px 24px', textAlign: (data.heroTextAlign as 'left' | 'center' | 'right') || 'center' }}>
            {data.heroTitle && <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>{data.heroTitle as string}</h1>}
            {data.heroSubtitle && <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.85)', marginBottom: '24px' }}>{data.heroSubtitle as string}</p>}
            {data.heroButtonLabel && (
              <a href={(data.heroButtonUrl as string) || '#'} style={{ display: 'inline-block', backgroundColor: '#6366f1', color: '#fff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
                {data.heroButtonLabel as string}
              </a>
            )}
          </div>
        </div>
      )
    }

    case 'cta':
      return (
        <div className={cls} style={{ ...style, backgroundColor: (data.ctaBgColor as string) || '#6366f1', padding: '48px 24px', textAlign: 'center' }}>
          {data.ctaTitle && <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>{data.ctaTitle as string}</h2>}
          {data.ctaDescription && <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '24px', fontSize: '1.125rem' }}>{data.ctaDescription as string}</p>}
          {data.ctaButtonLabel && (
            <a href={(data.ctaButtonUrl as string) || '#'} style={{ display: 'inline-block', backgroundColor: '#fff', color: '#6366f1', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}>
              {data.ctaButtonLabel as string}
            </a>
          )}
        </div>
      )

    case 'card':
      return (
        <div className={cls} style={{ ...style, border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', maxWidth: '360px' }}>
          {data.cardImage && <img src={data.cardImage as string} alt="" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
          <div style={{ padding: '20px' }}>
            {data.cardTitle && <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>{data.cardTitle as string}</h3>}
            {data.cardDescription && <p style={{ color: '#64748b', marginBottom: '16px' }}>{data.cardDescription as string}</p>}
            {data.cardButtonLabel && (
              <a href={(data.cardButtonUrl as string) || '#'} style={{ display: 'inline-block', backgroundColor: '#6366f1', color: '#fff', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.875rem' }}>
                {data.cardButtonLabel as string}
              </a>
            )}
          </div>
        </div>
      )

    case 'alert': {
      const colors: Record<string, { bg: string; border: string; text: string }> = {
        info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
        success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
        warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
        error: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' },
      }
      const c = colors[(data.alertType as string) || 'info']
      return (
        <div className={cls} style={{ ...style, backgroundColor: c.bg, border: `1px solid ${c.border}`, borderRadius: '8px', padding: '16px', color: c.text }}>
          {data.alertTitle && <strong style={{ display: 'block', marginBottom: '4px' }}>{data.alertTitle as string}</strong>}
          {data.alertMessage && <span>{data.alertMessage as string}</span>}
        </div>
      )
    }

    case 'faq': {
      const items = (data.faqItems as { question: string; answer: string }[]) || []
      return (
        <div className={cls} style={style}>
          {items.map((item, i) => (
            <details key={i} style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 0' }}>
              <summary style={{ fontWeight: 600, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                {item.question} <span>+</span>
              </summary>
              <p style={{ marginTop: '8px', color: '#64748b' }}>{item.answer}</p>
            </details>
          ))}
        </div>
      )
    }

    case 'testimonial':
      return (
        <div className={cls} style={{ ...style, padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
          {data.testimonialRating && (
            <div style={{ color: '#f59e0b', marginBottom: '12px' }}>
              {'★'.repeat(data.testimonialRating as number)}
            </div>
          )}
          {data.testimonialText && <p style={{ fontStyle: 'italic', marginBottom: '16px' }}>&ldquo;{data.testimonialText as string}&rdquo;</p>}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {data.testimonialAvatar && <img src={data.testimonialAvatar as string} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
            <div>
              {data.testimonialAuthor && <strong style={{ display: 'block' }}>{data.testimonialAuthor as string}</strong>}
              {data.testimonialRole && <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{data.testimonialRole as string}</span>}
            </div>
          </div>
        </div>
      )

    case 'columns': {
      const layoutMap: Record<string, string[]> = {
        '1-1': ['1fr', '1fr'],
        '1-2': ['1fr', '2fr'],
        '2-1': ['2fr', '1fr'],
        '1-1-1': ['1fr', '1fr', '1fr'],
        '1-1-1-1': ['1fr', '1fr', '1fr', '1fr'],
        '2-1-1': ['2fr', '1fr', '1fr'],
        '1-2-1': ['1fr', '2fr', '1fr'],
        '1-1-2': ['1fr', '1fr', '2fr'],
      }
      const cols = layoutMap[(data.columnsLayout as string) || '1-1'] || ['1fr', '1fr']
      const children = (data.columnChildren as Block[][]) || []
      return (
        <div className={cls} style={{ ...style, display: 'grid', gridTemplateColumns: cols.join(' '), gap: '24px' }}>
          {cols.map((_, i) => (
            <div key={i}>
              {(children[i] || []).map(child => <RenderBlock key={child.id} block={child} />)}
            </div>
          ))}
        </div>
      )
    }

    case 'video': {
      const ratios: Record<string, string> = { '16:9': '56.25%', '4:3': '75%', '1:1': '100%' }
      const pt = ratios[(data.videoRatio as string) || '16:9']
      const url = (data.videoUrl as string) || ''
      const isYt = url.includes('youtube') || url.includes('youtu.be')
      const ytId = isYt ? url.split(/[?&v=/]/).filter(s => s.length === 11)[0] : null
      return (
        <div className={cls} style={{ ...style, position: 'relative', paddingTop: pt, width: '100%' }}>
          {isYt && ytId ? (
            <iframe src={`https://www.youtube.com/embed/${ytId}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen />
          ) : url ? (
            <video src={url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} autoPlay={!!data.videoAutoplay} loop={!!data.videoLoop} muted={!!data.videoMuted} controls />
          ) : null}
        </div>
      )
    }

    case 'gallery': {
      const images = (data.galleryImages as { url: string; alt: string }[]) || []
      const cols = (data.galleryColumns as number) || 3
      const gap = (data.galleryGap as number) || 8
      return (
        <div className={cls} style={{ ...style, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: `${gap}px` }}>
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={img.url} alt={img.alt || ''} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
          ))}
        </div>
      )
    }

    case 'counter': {
      const items = (data.counterItems as { icon: string; value: string; label: string; suffix?: string }[]) || []
      return (
        <div className={cls} style={{ ...style, display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center' }}>
          {items.map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              {item.icon && <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</div>}
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#6366f1' }}>{item.value}{item.suffix}</div>
              <div style={{ color: '#64748b' }}>{item.label}</div>
            </div>
          ))}
        </div>
      )
    }

    case 'timeline': {
      const items = (data.timelineItems as { date: string; title: string; description: string }[]) || []
      return (
        <div className={cls} style={{ ...style, position: 'relative', paddingLeft: '24px', borderLeft: '2px solid #6366f1' }}>
          {items.map((item, i) => (
            <div key={i} style={{ marginBottom: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-33px', top: '4px', width: '16px', height: '16px', backgroundColor: '#6366f1', borderRadius: '50%' }} />
              {item.date && <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 600 }}>{item.date}</span>}
              {item.title && <h4 style={{ fontWeight: 600, margin: '4px 0' }}>{item.title}</h4>}
              {item.description && <p style={{ color: '#64748b' }}>{item.description}</p>}
            </div>
          ))}
        </div>
      )
    }

    case 'map':
      return (
        <div className={cls} style={{ ...style, height: (data.mapHeight as string) || '400px' }}>
          <iframe
            src={`https://maps.google.com/maps?q=${data.mapLat},${data.mapLng}&z=${data.mapZoom || 14}&output=embed`}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
          />
        </div>
      )

    case 'social-icons': {
      const links = (data.socialLinks as { platform: string; url: string }[]) || []
      const sizes: Record<string, string> = { sm: '28px', md: '36px', lg: '48px' }
      const sz = sizes[(data.socialSize as string) || 'md']
      return (
        <div className={cls} style={{ ...style, display: 'flex', gap: '12px', justifyContent: (data.socialAlign as string) === 'center' ? 'center' : (data.socialAlign as string) === 'right' ? 'flex-end' : 'flex-start' }}>
          {links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ width: sz, height: sz, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', borderRadius: '50%', fontSize: '1.1rem', textDecoration: 'none' }}>
              {link.platform.charAt(0).toUpperCase()}
            </a>
          ))}
        </div>
      )
    }

    default:
      return null
  }
}

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <>
      {blocks.map(block => (
        <RenderBlock key={block.id} block={block} />
      ))}
    </>
  )
}
