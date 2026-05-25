import { Database } from '@/types/supabase'

export type ViewMode = "matchup" | "bracket";

export type Match = Database['public']['Tables']['matches']['Row']
export type Tournament = Database['public']['Tables']['tournaments']['Row']
export type Couple = Database['public']['Tables']['couples']['Row']
export type TournamentStatus = Database['public']['Enums']['tournament_status'];

export type MatchInsert = Database['public']['Tables']['matches']['Insert']
export type Organizer = Database['public']['Tables']['organizers']['Row']
export type Player = Database['public']['Tables']['players']['Row']

export interface CoupleInfo {
  id: string;
  player1_name: string | null;
  player2_name: string | null;
  couple_number: number;
}

export interface MatchWithCouples extends Match {
  couple1: CoupleInfo | null;
  couple2: CoupleInfo | null;
}

export interface TournamentFull extends Tournament {
  matches: MatchWithCouples[];
  couples: Couple[];
}

export interface Prize {
  rank: number;
  description: string;
  cash: number;
  tags?: string[];
}

export type Contact = {
  name: string;
  phone: string | null;
  is_whatsapp: boolean;
  instagram: string | null;
  facebook: string | null;
  email: string | null;
  description: string | null;
}