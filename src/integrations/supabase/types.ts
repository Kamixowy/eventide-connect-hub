export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      collaboration_options: {
        Row: {
          collaboration_id: string
          created_at: string
          id: string
          sponsorship_option_id: string
        }
        Insert: {
          collaboration_id: string
          created_at?: string
          id?: string
          sponsorship_option_id: string
        }
        Update: {
          collaboration_id?: string
          created_at?: string
          id?: string
          sponsorship_option_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_options_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "collaborations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaboration_options_sponsorship_option_id_fkey"
            columns: ["sponsorship_option_id"]
            isOneToOne: false
            referencedRelation: "sponsorship_options"
            referencedColumns: ["id"]
          },
        ]
      }
      collaborations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          message: string | null
          organization_id: string
          sponsor_id: string
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          message?: string | null
          organization_id: string
          sponsor_id: string
          status: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          message?: string | null
          organization_id?: string
          sponsor_id?: string
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_organization: boolean | null
          organization_id: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          is_organization?: boolean | null
          organization_id?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_organization?: boolean | null
          organization_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "direct_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_conversations: {
        Row: {
          collaboration_id: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          collaboration_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          collaboration_id?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_conversations_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "direct_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      event_posts: {
        Row: {
          content: string
          created_at: string
          event_id: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          event_id: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          event_id?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_posts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          audience: string[] | null
          category: string | null
          created_at: string
          description: string
          detailed_location: string | null
          end_date: string | null
          expected_participants: number | null
          id: string
          image_url: string | null
          location: string | null
          organization_id: string
          social_media: Json | null
          start_date: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string[] | null
          category?: string | null
          created_at?: string
          description: string
          detailed_location?: string | null
          end_date?: string | null
          expected_participants?: number | null
          id?: string
          image_url?: string | null
          location?: string | null
          organization_id: string
          social_media?: Json | null
          start_date: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string[] | null
          category?: string | null
          created_at?: string
          description?: string
          detailed_location?: string | null
          end_date?: string | null
          expected_participants?: number | null
          id?: string
          image_url?: string | null
          location?: string | null
          organization_id?: string
          social_media?: Json | null
          start_date?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          achievements: string[] | null
          address: string | null
          category: string | null
          contact_email: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          followers: number | null
          founding_date: string | null
          id: string
          logo_url: string | null
          name: string
          nip: string | null
          phone: string | null
          social_media: Json | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          achievements?: string[] | null
          address?: string | null
          category?: string | null
          contact_email?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          followers?: number | null
          founding_date?: string | null
          id?: string
          logo_url?: string | null
          name: string
          nip?: string | null
          phone?: string | null
          social_media?: Json | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          achievements?: string[] | null
          address?: string | null
          category?: string | null
          contact_email?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          followers?: number | null
          founding_date?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          nip?: string | null
          phone?: string | null
          social_media?: Json | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
          user_type: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          updated_at?: string
          user_type: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_type?: string
          username?: string | null
        }
        Relationships: []
      }
      sponsorship_options: {
        Row: {
          benefits: string[] | null
          created_at: string
          description: string | null
          event_id: string
          id: string
          price: number
          price_to: number | null
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string[] | null
          created_at?: string
          description?: string | null
          event_id: string
          id?: string
          price: number
          price_to?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string[] | null
          created_at?: string
          description?: string | null
          event_id?: string
          id?: string
          price?: number
          price_to?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsorship_options_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_column_exists: {
        Args: { table_name: string; column_name: string }
        Returns: boolean
      }
      create_collaboration_conversation: {
        Args: {
          collaboration_id: string
          sponsor_id: string
          organization_id: string
        }
        Returns: string
      }
      create_conversation_and_participants: {
        Args: { user_one: string; user_two: string }
        Returns: {
          conversation_id: string
        }[]
      }
      find_conversation_between_users: {
        Args: { user_one: string; user_two: string }
        Returns: {
          conversation_id: string
        }[]
      }
      is_conversation_participant: {
        Args: { conversation_id: string }
        Returns: boolean
      }
      mark_messages_as_read: {
        Args: { conversation_id: string }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
