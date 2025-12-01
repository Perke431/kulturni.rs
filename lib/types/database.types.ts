export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blogs: {
        Row: {
          content: string
          created_at: string
          date: string
          description: string
          id: string
          image_url: string | null
          read_time: number
          related_blogs: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          date: string
          description: string
          id?: string
          image_url?: string | null
          read_time: number
          related_blogs?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          image_url?: string | null
          read_time?: number
          related_blogs?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          buy_ticket_links: Json | null
          content: string
          created_at: string
          date: string
          description: string
          id: string
          image_url: string | null
          related_events: string[] | null
          start_time: string
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          buy_ticket_links?: Json | null
          content: string
          created_at?: string
          date: string
          description: string
          id?: string
          image_url?: string | null
          related_events?: string[] | null
          start_time: string
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          buy_ticket_links?: Json | null
          content?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          image_url?: string | null
          related_events?: string[] | null
          start_time?: string
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: 'user' | 'admin'
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: 'user' | 'admin'
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: 'user' | 'admin'
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Blog = Database['public']['Tables']['blogs']['Row'];
export type BlogInsert = Database['public']['Tables']['blogs']['Insert'];
export type BlogUpdate = Database['public']['Tables']['blogs']['Update'];

export type Event = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Buy ticket link type (from JSONB)
export type BuyTicketLink = {
  label: string;
  url: string;
};
