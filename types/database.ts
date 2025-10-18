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
      before_cta_highlights: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: number
          section_id: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: number
          section_id?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: number
          section_id?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "before_cta_highlights_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "before_cta_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      before_cta_sections: {
        Row: {
          created_at: string | null
          id: number
          slug: string
          title_highlight: string | null
          title_main: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          slug: string
          title_highlight?: string | null
          title_main?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          slug?: string
          title_highlight?: string | null
          title_main?: string | null
        }
        Relationships: []
      }
      benefits: {
        Row: {
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      course_benefits: {
        Row: {
          course_id: number | null
          created_at: string | null
          description: string | null
          id: number
          title: string
        }
        Insert: {
          course_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          title: string
        }
        Update: {
          course_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_benefits_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_chapters: {
        Row: {
          course_id: number
          created_at: string | null
          description: string | null
          duration: string | null
          id: number
          image_url: string | null
          order_index: number | null
          title: string
        }
        Insert: {
          course_id: number
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: number
          image_url?: string | null
          order_index?: number | null
          title: string
        }
        Update: {
          course_id?: number
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: number
          image_url?: string | null
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
          youtube_id: string | null
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
          youtube_id?: string | null
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
          youtube_id?: string | null
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
          course_id: number
          enrolled_at: string | null
          id: string
          purchase_id: string | null
          user_id: string
        }
        Insert: {
          course_id: number
          enrolled_at?: string | null
          id?: string
          purchase_id?: string | null
          user_id: string
        }
        Update: {
          course_id?: number
          enrolled_at?: string | null
          id?: string
          purchase_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases_with_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "simple_users"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_items: {
        Row: {
          answer: string
          created_at: string | null
          id: number
          order_index: number | null
          question: string
          section_id: number | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: number
          order_index?: number | null
          question: string
          section_id?: number | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: number
          order_index?: number | null
          question?: string
          section_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "faq_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_sections: {
        Row: {
          created_at: string | null
          id: number
          slug: string
          title_part_1: string | null
          title_part_2: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          slug: string
          title_part_1?: string | null
          title_part_2?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          slug?: string
          title_part_1?: string | null
          title_part_2?: string | null
        }
        Relationships: []
      }
      featured_instructor_sections: {
        Row: {
          badge_text: string | null
          created_at: string | null
          cta_href: string | null
          cta_text: string | null
          id: number
          instructor_id: number | null
          main_title: string | null
          slug: string
          subtitle: string | null
        }
        Insert: {
          badge_text?: string | null
          created_at?: string | null
          cta_href?: string | null
          cta_text?: string | null
          id?: number
          instructor_id?: number | null
          main_title?: string | null
          slug: string
          subtitle?: string | null
        }
        Update: {
          badge_text?: string | null
          created_at?: string | null
          cta_href?: string | null
          cta_text?: string | null
          id?: number
          instructor_id?: number | null
          main_title?: string | null
          slug?: string
          subtitle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_instructor_sections_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      footer_links: {
        Row: {
          created_at: string | null
          footer_id: number | null
          href: string
          icon_name: string | null
          id: number
          label: string | null
          link_type: string
          order_index: number | null
        }
        Insert: {
          created_at?: string | null
          footer_id?: number | null
          href: string
          icon_name?: string | null
          id?: number
          label?: string | null
          link_type: string
          order_index?: number | null
        }
        Update: {
          created_at?: string | null
          footer_id?: number | null
          href?: string
          icon_name?: string | null
          id?: number
          label?: string | null
          link_type?: string
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "footer_links_footer_id_fkey"
            columns: ["footer_id"]
            isOneToOne: false
            referencedRelation: "footers"
            referencedColumns: ["id"]
          },
        ]
      }
      footers: {
        Row: {
          brand_description: string | null
          brand_name: string | null
          copyright_text: string | null
          created_at: string | null
          email: string | null
          id: number
          phone_number: string | null
          quick_links_title: string | null
          slug: string
          social_links_title: string | null
        }
        Insert: {
          brand_description?: string | null
          brand_name?: string | null
          copyright_text?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          phone_number?: string | null
          quick_links_title?: string | null
          slug: string
          social_links_title?: string | null
        }
        Update: {
          brand_description?: string | null
          brand_name?: string | null
          copyright_text?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          phone_number?: string | null
          quick_links_title?: string | null
          slug?: string
          social_links_title?: string | null
        }
        Relationships: []
      }
      header_nav_links: {
        Row: {
          created_at: string | null
          header_id: number | null
          href: string
          id: number
          label: string
        }
        Insert: {
          created_at?: string | null
          header_id?: number | null
          href: string
          id?: number
          label: string
        }
        Update: {
          created_at?: string | null
          header_id?: number | null
          href?: string
          id?: number
          label?: string
        }
        Relationships: [
          {
            foreignKeyName: "header_nav_links_header_id_fkey"
            columns: ["header_id"]
            isOneToOne: false
            referencedRelation: "headers"
            referencedColumns: ["id"]
          },
        ]
      }
      headers: {
        Row: {
          created_at: string | null
          home_href: string | null
          id: number
          logo_alt: string | null
          logo_src: string | null
          primary_button_href: string | null
          primary_button_text: string | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          home_href?: string | null
          id?: number
          logo_alt?: string | null
          logo_src?: string | null
          primary_button_href?: string | null
          primary_button_text?: string | null
          slug: string
        }
        Update: {
          created_at?: string | null
          home_href?: string | null
          id?: number
          logo_alt?: string | null
          logo_src?: string | null
          primary_button_href?: string | null
          primary_button_text?: string | null
          slug?: string
        }
        Relationships: []
      }
      hero_sections: {
        Row: {
          created_at: string | null
          cta_primary_text: string | null
          cta_secondary_text: string | null
          description: string | null
          highlight_text: string | null
          id: number
          slug: string
          title: string | null
          video_src: string | null
        }
        Insert: {
          created_at?: string | null
          cta_primary_text?: string | null
          cta_secondary_text?: string | null
          description?: string | null
          highlight_text?: string | null
          id?: number
          slug: string
          title?: string | null
          video_src?: string | null
        }
        Update: {
          created_at?: string | null
          cta_primary_text?: string | null
          cta_secondary_text?: string | null
          description?: string | null
          highlight_text?: string | null
          id?: number
          slug?: string
          title?: string | null
          video_src?: string | null
        }
        Relationships: []
      }
      instructor_highlights: {
        Row: {
          created_at: string | null
          id: number
          instructor_id: number | null
          order_index: number | null
          text: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          instructor_id?: number | null
          order_index?: number | null
          text: string
        }
        Update: {
          created_at?: string | null
          id?: number
          instructor_id?: number | null
          order_index?: number | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_highlights_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "instructors"
            referencedColumns: ["id"]
          },
        ]
      }
      instructors: {
        Row: {
          created_at: string | null
          id: number
          image_src: string | null
          linkedin_url: string | null
          name: string
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_src?: string | null
          linkedin_url?: string | null
          name: string
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image_src?: string | null
          linkedin_url?: string | null
          name?: string
          title?: string | null
        }
        Relationships: []
      }
      learn_section_items: {
        Row: {
          created_at: string | null
          icon_name: string | null
          id: number
          learn_section_id: number | null
          text: string
        }
        Insert: {
          created_at?: string | null
          icon_name?: string | null
          id?: number
          learn_section_id?: number | null
          text: string
        }
        Update: {
          created_at?: string | null
          icon_name?: string | null
          id?: number
          learn_section_id?: number | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "learn_section_items_learn_section_id_fkey"
            columns: ["learn_section_id"]
            isOneToOne: false
            referencedRelation: "learn_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      learn_sections: {
        Row: {
          created_at: string | null
          highlighted_word: string | null
          id: number
          section_title: string | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          highlighted_word?: string | null
          id?: number
          section_title?: string | null
          slug: string
        }
        Update: {
          created_at?: string | null
          highlighted_word?: string | null
          id?: number
          section_title?: string | null
          slug?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          alt: string
          created_at: string | null
          id: number
          src: string
        }
        Insert: {
          alt: string
          created_at?: string | null
          id?: number
          src: string
        }
        Update: {
          alt?: string
          created_at?: string | null
          id?: number
          src?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          name: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "simple_users"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_sections: {
        Row: {
          created_at: string | null
          cta_href: string | null
          cta_text: string | null
          id: number
          slug: string
          title_highlight: string | null
          title_main: string | null
          video_src: string | null
        }
        Insert: {
          created_at?: string | null
          cta_href?: string | null
          cta_text?: string | null
          id?: number
          slug: string
          title_highlight?: string | null
          title_main?: string | null
          video_src?: string | null
        }
        Update: {
          created_at?: string | null
          cta_href?: string | null
          cta_text?: string | null
          id?: number
          slug?: string
          title_highlight?: string | null
          title_main?: string | null
          video_src?: string | null
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
          purchased_at: string
          status: Database["public"]["Enums"]["purchase_status"]
          user_id: string
        }
        Insert: {
          amount: number
          course_id: number
          currency?: string | null
          id?: string
          invoice_url?: string | null
          payment_id?: string | null
          purchased_at?: string
          status: Database["public"]["Enums"]["purchase_status"]
          user_id: string
        }
        Update: {
          amount?: number
          course_id?: number
          currency?: string | null
          id?: string
          invoice_url?: string | null
          payment_id?: string | null
          purchased_at?: string
          status?: Database["public"]["Enums"]["purchase_status"]
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
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "simple_users"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string
          icon_name: string | null
          id: number
          link: string
          title: string
        }
        Insert: {
          created_at?: string
          icon_name?: string | null
          id?: number
          link: string
          title: string
        }
        Update: {
          created_at?: string
          icon_name?: string | null
          id?: number
          link?: string
          title?: string
        }
        Relationships: []
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
      support_messages: {
        Row: {
          admin_reply: string | null
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
          admin_reply?: string | null
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
          admin_reply?: string | null
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
      testimonials: {
        Row: {
          created_at: string | null
          id: number
          img_src: string | null
          name: string
          text: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          img_src?: string | null
          name: string
          text: string
        }
        Update: {
          created_at?: string | null
          id?: number
          img_src?: string | null
          name?: string
          text?: string
        }
        Relationships: []
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
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      video_progress: {
        Row: {
          created_at: string
          current_time: number | null
          id: number
          is_completed: boolean | null
          percentage: number | null
          updated_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string
          current_time?: number | null
          id?: number
          is_completed?: boolean | null
          percentage?: number | null
          updated_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string
          current_time?: number | null
          id?: number
          is_completed?: boolean | null
          percentage?: number | null
          updated_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "course_videos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      purchases_with_users: {
        Row: {
          amount: number | null
          course_id: number | null
          course_title: string | null
          currency: string | null
          id: string | null
          invoice_url: string | null
          payment_id: string | null
          purchased_at: string | null
          status: Database["public"]["Enums"]["purchase_status"] | null
          user_email: string | null
          user_id: string | null
          user_image: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "simple_users"
            referencedColumns: ["id"]
          },
        ]
      }
      simple_users: {
        Row: {
          email: string | null
          id: string | null
        }
        Insert: {
          email?: string | null
          id?: string | null
        }
        Update: {
          email?: string | null
          id?: string | null
        }
        Relationships: []
      }
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
      enroll_user_in_course: {
        Args: {
          p_amount?: number
          p_course_id: number
          p_currency?: string
          p_is_paid: boolean
          p_user_id: string
        }
        Returns: string
      }
      get_available_users_for_enrollment: {
        Args: { course_id: number }
        Returns: {
          email: string
          id: string
        }[]
      }
      get_course_chapters_details: {
        Args: { p_course_id: number }
        Returns: {
          benefits: Json
          chapter_created_at: string
          chapter_description: string
          chapter_duration: string
          chapter_id: number
          chapter_image_url: string
          chapter_order_index: number
          chapter_title: string
          course_description: string
          course_id: number
          course_image_url: string
          course_instructor: string
          course_price: number
          course_published: boolean
          course_seo_meta: Json
          course_slug: string
          course_title: string
        }[]
      }
      get_enrollments_with_details: {
        Args: {
          p_course_id?: number
          p_purchase_status?: Database["public"]["Enums"]["purchase_status"]
          p_user_id?: string
        }
        Returns: {
          course_description: string
          course_id: number
          course_price: number
          course_title: string
          enrolled_at: string
          enrollment_id: string
          purchase_amount: number
          purchase_currency: string
          purchase_id: string
          purchase_status: Database["public"]["Enums"]["purchase_status"]
          user_email: string
          user_id: string
          user_name: string
        }[]
      }
      get_homepage_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_invoice_details: {
        Args: { p_purchase_id: string }
        Returns: {
          amount: number
          course_title: string
          currency: string
          invoice_url: string
          purchase_id: string
          purchased_at: string
          status: string
          user_email: string
          user_name: string
        }[]
      }
      get_user_course_dashboard: {
        Args: { p_course_id: number; p_user_id: string }
        Returns: Json
      }
      get_user_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_role: {
        Args: { p_user_id: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_enrolled: {
        Args: { p_course_id: number; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      purchase_status: "pending" | "succeeded" | "failed"
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
    Enums: {
      purchase_status: ["pending", "succeeded", "failed"],
    },
  },
} as const
