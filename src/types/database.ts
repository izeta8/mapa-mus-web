import { Database } from '@/types/supabase'

export type ViewMode = "lista" | "bracket";

export type Match = Database['public']['Tables']['matches']['Row']
export type Tournament = Database['public']['Tables']['tournaments']['Row']
export type Couple = Database['public']['Tables']['couples']['Row']

export type MatchInsert = Database['public']['Tables']['matches']['Insert']

