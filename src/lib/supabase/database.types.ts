export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      accounts: {
        Row: {
          color: string | null;
          created_at: string;
          id: number;
          name: string;
          type: string;
          user_id: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          id?: never;
          name: string;
          type: string;
          user_id: string;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          id?: never;
          name?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      budget_categories: {
        Row: {
          amount: number;
          budget_id: number;
          category_id: number;
          created_at: string;
          description: string | null;
          id: number;
          user_id: string;
        };
        Insert: {
          amount?: number;
          budget_id: number;
          category_id: number;
          created_at?: string;
          description?: string | null;
          id?: never;
          user_id: string;
        };
        Update: {
          amount?: number;
          budget_id?: number;
          category_id?: number;
          created_at?: string;
          description?: string | null;
          id?: never;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "budget_categories_budget_id_fkey";
            columns: ["budget_id"];
            isOneToOne: false;
            referencedRelation: "budgets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "budget_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      budgets: {
        Row: {
          active: boolean;
          amount: number;
          created_at: string;
          end_date: string | null;
          id: number;
          initial_date: string | null;
          name: string;
          repeat: Database["public"]["Enums"]["budget_repeat"];
          user_id: string;
        };
        Insert: {
          active?: boolean;
          amount?: number;
          created_at?: string;
          end_date?: string | null;
          id?: never;
          initial_date?: string | null;
          name: string;
          repeat?: Database["public"]["Enums"]["budget_repeat"];
          user_id: string;
        };
        Update: {
          active?: boolean;
          amount?: number;
          created_at?: string;
          end_date?: string | null;
          id?: never;
          initial_date?: string | null;
          name?: string;
          repeat?: Database["public"]["Enums"]["budget_repeat"];
          user_id?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          color: string;
          created_at: string;
          id: number;
          name: string;
          user_id: string;
        };
        Insert: {
          color?: string;
          created_at?: string;
          id?: never;
          name: string;
          user_id: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          id?: never;
          name?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          read_at: string | null;
          title: string | null;
          type: Database["public"]["Enums"]["notification_type"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          read_at?: string | null;
          title?: string | null;
          type?: Database["public"]["Enums"]["notification_type"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          read_at?: string | null;
          title?: string | null;
          type?: Database["public"]["Enums"]["notification_type"];
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          currency: string;
          id: string;
          language: string;
          name: string | null;
          subscription: string | null;
        };
        Insert: {
          currency?: string;
          id: string;
          language?: string;
          name?: string | null;
          subscription?: string | null;
        };
        Update: {
          currency?: string;
          id?: string;
          language?: string;
          name?: string | null;
          subscription?: string | null;
        };
        Relationships: [];
      };
      stripe_customers: {
        Row: {
          created_at: string | null;
          id: number;
          stripe_customer_id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: never;
          stripe_customer_id: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: never;
          stripe_customer_id?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      stripe_payments: {
        Row: {
          amount_paid: number;
          created_at: string | null;
          currency: string;
          id: number;
          paid_at: string;
          payment_method_brand: string | null;
          payment_method_last4: string | null;
          stripe_invoice_id: string;
          user_id: string | null;
        };
        Insert: {
          amount_paid: number;
          created_at?: string | null;
          currency: string;
          id?: never;
          paid_at: string;
          payment_method_brand?: string | null;
          payment_method_last4?: string | null;
          stripe_invoice_id: string;
          user_id?: string | null;
        };
        Update: {
          amount_paid?: number;
          created_at?: string | null;
          currency?: string;
          id?: never;
          paid_at?: string;
          payment_method_brand?: string | null;
          payment_method_last4?: string | null;
          stripe_invoice_id?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          canceled_at: string | null;
          created_at: string | null;
          current_period_end: string | null;
          current_period_start: string | null;
          id: number;
          product_name: string | null;
          status: string;
          stripe_customer_id: string;
          stripe_price_id: string;
          stripe_subscription_id: string;
          user_id: string | null;
        };
        Insert: {
          canceled_at?: string | null;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: never;
          product_name?: string | null;
          status: string;
          stripe_customer_id: string;
          stripe_price_id: string;
          stripe_subscription_id: string;
          user_id?: string | null;
        };
        Update: {
          canceled_at?: string | null;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: never;
          product_name?: string | null;
          status?: string;
          stripe_customer_id?: string;
          stripe_price_id?: string;
          stripe_subscription_id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_stripe_customer_id";
            columns: ["stripe_customer_id"];
            isOneToOne: false;
            referencedRelation: "stripe_customers";
            referencedColumns: ["stripe_customer_id"];
          },
        ];
      };
      transactions: {
        Row: {
          account_id: number | null;
          amount: number;
          category_id: number | null;
          created_at: string;
          description: string | null;
          enabled: boolean;
          id: number;
          occurred_at: string;
          type: Database["public"]["Enums"]["transaction_type"];
          user_id: string;
        };
        Insert: {
          account_id: number | null;
          amount?: number;
          category_id?: number | null;
          created_at?: string;
          description?: string | null;
          enabled?: boolean;
          id?: never;
          occurred_at?: string;
          type: Database["public"]["Enums"]["transaction_type"];
          user_id?: string;
        };
        Update: {
          account_id?: number | null;
          amount?: number;
          category_id?: number | null;
          created_at?: string;
          description?: string | null;
          enabled?: boolean;
          id?: never;
          occurred_at?: string;
          type?: Database["public"]["Enums"]["transaction_type"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      waitlist: {
        Row: {
          created_at: string;
          email: string;
          id: number;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: number;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      budget_repeat: "day" | "week" | "month" | "year";
      locale: "es" | "en";
      notification_type: "error" | "info" | "warning";
      transaction_type: "income" | "expense";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      budget_repeat: ["day", "week", "month", "year"],
      locale: ["es", "en"],
      notification_type: ["error", "info", "warning"],
      transaction_type: ["income", "expense"],
    },
  },
} as const;
