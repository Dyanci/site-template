export type WidgetType =
  | 'heading' | 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'html'
  | 'video' | 'gallery' | 'icon-box' | 'columns'
  | 'hero' | 'cta' | 'card' | 'testimonial' | 'faq' | 'tabs' | 'pricing'
  | 'progress' | 'counter' | 'timeline' | 'alert'
  | 'posts' | 'projects' | 'products' | 'form' | 'map' | 'social-icons'

export interface Block {
  id: string
  type: WidgetType
  data: Record<string, unknown>
}
