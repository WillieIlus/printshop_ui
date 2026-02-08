import type { User } from './user'
import type { SocialLink } from './profile'

export interface ShopHours {
  id: number
  shop: number
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

export interface ShopMember {
  id: number
  shop: number
  user: number
  role: 'owner' | 'manager' | 'staff'
  joined_at: string
  user_details?: User
}

export interface Shop {
  id: number
  name: string
  slug: string
  description: string | null
  logo: string | null
  cover_image: string | null
  email: string | null
  phone: string | null
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  latitude: number | null
  longitude: number | null
  is_verified: boolean
  is_active: boolean
  owner: number
  hours: ShopHours[]
  social_links: SocialLink[]
  members: ShopMember[]
  created_at: string
  updated_at: string
}

export interface ShopCreateInput {
  name: string
  description?: string
  email?: string
  phone?: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
}
