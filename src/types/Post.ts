export interface Post {
  id: number
  title_en: string
  title_fi: string
  body_en: string
  body_fi: string
  published: boolean
  posted_at: Date
  slug: string
  created_at: Date
  updated_at: Date
}
