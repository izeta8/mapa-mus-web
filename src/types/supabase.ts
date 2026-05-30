export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      couples: {
        Row: {
          couple_number: number
          created_at: string
          id: string
          player1_name: string | null
          player2_name: string | null
          tournament_id: string
        }
        Insert: {
          couple_number: number
          created_at?: string
          id?: string
          player1_name?: string | null
          player2_name?: string | null
          tournament_id: string
        }
        Update: {
          couple_number?: number
          created_at?: string
          id?: string
          player1_name?: string | null
          player2_name?: string | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "couples_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          couple1_id: string | null
          couple2_id: string | null
          created_at: string
          id: string
          is_bye: boolean
          is_consolation: boolean
          loser_match_id: string | null
          next_match_id: string | null
          round: number
          row_index: number
          table_number: string | null
          tournament_id: string
          updated_at: string
          venue_id: string | null
          winner_id: string | null
        }
        Insert: {
          couple1_id?: string | null
          couple2_id?: string | null
          created_at?: string
          id?: string
          is_bye?: boolean
          is_consolation?: boolean
          loser_match_id?: string | null
          next_match_id?: string | null
          round: number
          row_index: number
          table_number?: string | null
          tournament_id: string
          updated_at?: string
          venue_id?: string | null
          winner_id?: string | null
        }
        Update: {
          couple1_id?: string | null
          couple2_id?: string | null
          created_at?: string
          id?: string
          is_bye?: boolean
          is_consolation?: boolean
          loser_match_id?: string | null
          next_match_id?: string | null
          round?: number
          row_index?: number
          table_number?: string | null
          tournament_id?: string
          updated_at?: string
          venue_id?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_couple1_id_fkey"
            columns: ["couple1_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_couple2_id_fkey"
            columns: ["couple2_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_loser_match_id_fkey"
            columns: ["loser_match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_next_match_id_fkey"
            columns: ["next_match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      organizers: {
        Row: {
          address: string | null
          contacts: Json | null
          created_at: string
          id: string
          is_verified: boolean
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contacts?: Json | null
          created_at?: string
          id: string
          is_verified?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contacts?: Json | null
          created_at?: string
          id?: string
          is_verified?: boolean
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          avatar_url: string | null
          display_name: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          display_name?: string | null
          id: string
          is_active?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          display_name?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      processed_posters: {
        Row: {
          created_at: string
          hash: string
          tournament_id: string | null
        }
        Insert: {
          created_at?: string
          hash: string
          tournament_id?: string | null
        }
        Update: {
          created_at?: string
          hash?: string
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processed_posters_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_registrations: {
        Row: {
          created_at: string | null
          id: number
          status: Database["public"]["Enums"]["registration_status"]
          tournament_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          status?: Database["public"]["Enums"]["registration_status"]
          tournament_id: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          status?: Database["public"]["Enums"]["registration_status"]
          tournament_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          contacts: Json | null
          created_at: string
          current_round: number | null
          featured_until: string | null
          id: string
          kings_modality:
            | Database["public"]["Enums"]["kings_modality_enum"]
            | null
          latitude: number | null
          location: string
          longitude: number | null
          max_spots: number | null
          name: string
          organizer_id: string | null
          points_modality:
            | Database["public"]["Enums"]["points_modality_enum"]
            | null
          poster_url: string
          price_per_couple: number | null
          prizes: Json
          registration_info: Json
          rules: string[] | null
          short_id: string
          status: Database["public"]["Enums"]["tournament_status"]
          tournament_date: string
          updated_at: string
        }
        Insert: {
          contacts?: Json | null
          created_at?: string
          current_round?: number | null
          featured_until?: string | null
          id?: string
          kings_modality?:
            | Database["public"]["Enums"]["kings_modality_enum"]
            | null
          latitude?: number | null
          location: string
          longitude?: number | null
          max_spots?: number | null
          name: string
          organizer_id?: string | null
          points_modality?:
            | Database["public"]["Enums"]["points_modality_enum"]
            | null
          poster_url: string
          price_per_couple?: number | null
          prizes: Json
          registration_info: Json
          rules?: string[] | null
          short_id?: string
          status: Database["public"]["Enums"]["tournament_status"]
          tournament_date: string
          updated_at?: string
        }
        Update: {
          contacts?: Json | null
          created_at?: string
          current_round?: number | null
          featured_until?: string | null
          id?: string
          kings_modality?:
            | Database["public"]["Enums"]["kings_modality_enum"]
            | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          max_spots?: number | null
          name?: string
          organizer_id?: string | null
          points_modality?:
            | Database["public"]["Enums"]["points_modality_enum"]
            | null
          poster_url?: string
          price_per_couple?: number | null
          prizes?: Json
          registration_info?: Json
          rules?: string[] | null
          short_id?: string
          status?: Database["public"]["Enums"]["tournament_status"]
          tournament_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
          tournament_id: number
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
          tournament_id: number
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
          tournament_id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      advance_winner: {
        Args: { p_match_id: string; p_winner_id: string }
        Returns: undefined
      }
      rollback_winner: { Args: { p_match_id: string }; Returns: undefined }
    }
    Enums: {
      kings_modality_enum: "4" | "8"
      points_modality_enum: "20" | "30" | "40"
      registration_status: "confirmed" | "waiting_list" | "canceled"
      tournament_status:
        | "planned"
        | "revision_pending"
        | "finished"
        | "canceled"
        | "ongoing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      kings_modality_enum: ["4", "8"],
      points_modality_enum: ["20", "30", "40"],
      registration_status: ["confirmed", "waiting_list", "canceled"],
      tournament_status: [
        "planned",
        "revision_pending",
        "finished",
        "canceled",
        "ongoing",
      ],
    },
  },
} as const
