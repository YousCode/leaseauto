export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_pins: {
        Row: {
          pin: string
        }
        Insert: {
          pin: string
        }
        Update: {
          pin?: string
        }
        Relationships: []
      }
      makes: {
        Row: {
          created_at: string | null
          id: number
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      models: {
        Row: {
          created_at: string | null
          first_year: number | null
          id: number
          last_year: number | null
          make_id: number | null
          name: string
        }
        Insert: {
          created_at?: string | null
          first_year?: number | null
          id?: number
          last_year?: number | null
          make_id?: number | null
          name: string
        }
        Update: {
          created_at?: string | null
          first_year?: number | null
          id?: number
          last_year?: number | null
          make_id?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "models_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "makes"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_options: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string | null
          category: string | null
          city: string | null
          co2_emissions: number | null
          color: string | null
          consumption_mixed: number | null
          created_at: string | null
          critair: number | null
          description: string | null
          dimensions: Json | null
          doors: number | null
          energy: string | null
          first_owner: boolean | null
          gearbox: string | null
          id: string
          images: string[] | null
          location_lat: number | null
          location_lng: number | null
          mileage: number | null
          model: string | null
          monthly: number | null
          options: string[] | null
          owner_id: string | null
          power_din: number | null
          power_fiscal: number | null
          price: number | null
          search: unknown | null
          seller_info: Json | null
          seller_type: string | null
          slug: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          weight: number | null
          year: number | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          city?: string | null
          co2_emissions?: number | null
          color?: string | null
          consumption_mixed?: number | null
          created_at?: string | null
          critair?: number | null
          description?: string | null
          dimensions?: Json | null
          doors?: number | null
          energy?: string | null
          first_owner?: boolean | null
          gearbox?: string | null
          id?: string
          images?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
          mileage?: number | null
          model?: string | null
          monthly?: number | null
          options?: string[] | null
          owner_id?: string | null
          power_din?: number | null
          power_fiscal?: number | null
          price?: number | null
          search?: unknown | null
          seller_info?: Json | null
          seller_type?: string | null
          slug?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          weight?: number | null
          year?: number | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          city?: string | null
          co2_emissions?: number | null
          color?: string | null
          consumption_mixed?: number | null
          created_at?: string | null
          critair?: number | null
          description?: string | null
          dimensions?: Json | null
          doors?: number | null
          energy?: string | null
          first_owner?: boolean | null
          gearbox?: string | null
          id?: string
          images?: string[] | null
          location_lat?: number | null
          location_lng?: number | null
          mileage?: number | null
          model?: string | null
          monthly?: number | null
          options?: string[] | null
          owner_id?: string | null
          power_din?: number | null
          power_fiscal?: number | null
          price?: number | null
          search?: unknown | null
          seller_info?: Json | null
          seller_type?: string | null
          slug?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          weight?: number | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_monthly_payment: {
        Args: {
          price: number
          down_payment?: number
          duration_months?: number
          interest_rate?: number
        }
        Returns: number
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      search_vehicles: {
        Args: { search_query: string }
        Returns: {
          id: string
          title: string
          brand: string
          model: string
          year: number
          price: number
          monthly: number
          images: string[]
          slug: string
          mileage: number
          energy: string
          gearbox: string
          city: string
          created_at: string
          rank: number
        }[]
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
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
  public: {
    Enums: {},
  },
} as const
