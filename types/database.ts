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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          date: string | null
          id: string
          metric: string
          value: number | null
        }
        Insert: {
          date?: string | null
          id?: string
          metric: string
          value?: number | null
        }
        Update: {
          date?: string | null
          id?: string
          metric?: string
          value?: number | null
        }
        Relationships: []
      }
      course_chapters: {
        Row: {
          course_id: number
          created_at: string | null
          description: string | null
          id: number
          order_index: number | null
          title: string
        }
        Insert: {
          course_id: number
          created_at?: string | null
          description?: string | null
          id?: number
          order_index?: number | null
          title: string
        }
        Update: {
          course_id?: number
          created_at?: string | null
          description?: string | null
          id?: number
          order_index?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_chapters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_videos: {
        Row: {
          attachment_url: string | null
          bunny_library_id: string | null
          bunny_video_id: string | null
          chapter_id: number | null
          course_id: number | null
          created_at: string | null
          description: string | null
          duration: number | null
          external_url: string | null
          id: string
          order_index: number | null
          thumbnail_url: string | null
          title: string
          youtube_id: string
        }
        Insert: {
          attachment_url?: string | null
          bunny_library_id?: string | null
          bunny_video_id?: string | null
          chapter_id?: number | null
          course_id?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          external_url?: string | null
          id?: string
          order_index?: number | null
          thumbnail_url?: string | null
          title: string
          youtube_id: string
        }
        Update: {
          attachment_url?: string | null
          bunny_library_id?: string | null
          bunny_video_id?: string | null
          chapter_id?: number | null
          course_id?: number | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          external_url?: string | null
          id?: string
          order_index?: number | null
          thumbnail_url?: string | null
          title?: string
          youtube_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_chapter"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "course_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          image_url: string | null
          instructor: string | null
          price: number | null
          published: boolean | null
          seo_meta: Json | null
          slug: string | null
          title: string
          yt_video_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          instructor?: string | null
          price?: number | null
          published?: boolean | null
          seo_meta?: Json | null
          slug?: string | null
          title: string
          yt_video_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          instructor?: string | null
          price?: number | null
          published?: boolean | null
          seo_meta?: Json | null
          slug?: string | null
          title?: string
          yt_video_id?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: number | null
          enrolled_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          course_id?: number | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          course_id?: number | null
          enrolled_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          amount: number
          course_id: number
          currency: string | null
          id: string
          invoice_url: string | null
          payment_id: string | null
          purchased_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          course_id: number
          currency?: string | null
          id?: string
          invoice_url?: string | null
          payment_id?: string | null
          purchased_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          course_id?: number
          currency?: string | null
          id?: string
          invoice_url?: string | null
          payment_id?: string | null
          purchased_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      seo_meta_pages: {
        Row: {
          description: string | null
          id: number
          keywords: string[] | null
          og_image_url: string | null
          page: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          keywords?: string[] | null
          og_image_url?: string | null
          page: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          keywords?: string[] | null
          og_image_url?: string | null
          page?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content: string | null
          id: number
          media_url: string | null
          order_index: number | null
          section: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          id?: number
          media_url?: string | null
          order_index?: number | null
          section: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          id?: number
          media_url?: string | null
          order_index?: number | null
          section?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          message: string | null
          name: string | null
          status: string | null
          subject: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          status?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          status?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: number
          role_id: number | null
          user_id: string | null
        }
        Insert: {
          id?: number
          role_id?: number | null
          user_id?: string | null
        }
        Update: {
          id?: number
          role_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_course_views: {
        Args: Record<PropertyKey, never>
        Returns: {
          course_id: string
          course_title: string
          total_views: number
        }[]
      }
      admin_daily_video_views: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_views: number
          video_id: string
          video_title: string
          view_date: string
        }[]
      }
      admin_video_views: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_views: number
          video_id: string
          video_title: string
        }[]
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
