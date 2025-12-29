export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string;
          make: string;
          model: string;
          version: string | null;
          year: number | null;
          mileage: number | null;
          price_cash: number | null;
          price_monthly: number | null;
          status: 'available' | 'reserved' | 'sold';
          images: string[] | null;
          options: Json | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          make: string;
          model: string;
          version?: string | null;
          year?: number | null;
          mileage?: number | null;
          price_cash?: number | null;
          price_monthly?: number | null;
          status?: 'available' | 'reserved' | 'sold';
          images?: string[] | null;
          options?: Json | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['vehicles']['Insert']>;
      };
      leads: {
        Row: {
          id: string;
          created_at: string;
          vehicle_id: string | null;
          status: 'new' | 'contacted' | 'document_pending' | 'signed' | 'rejected';
          contact_info: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          vehicle_id?: string | null;
          status?: 'new' | 'contacted' | 'document_pending' | 'signed' | 'rejected';
          contact_info?: Json | null;
        };
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'user' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'user' | 'admin';
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
    };
    Functions: Record<string, never>;
  };
}
