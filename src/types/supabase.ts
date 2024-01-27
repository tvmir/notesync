import { InferSelectModel } from 'drizzle-orm';
import {
  files,
  folders,
  likedSongs,
  notebooks,
  songs,
  users,
} from '../../migrations/schema';

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
      files: {
        Row: {
          content: Json | null;
          created_at: string;
          folder_id: string;
          icon_id: string;
          id: string;
          in_trash: string | null;
          notebook_id: string;
          title: string;
        };
        Insert: {
          content?: Json | null;
          created_at?: string;
          folder_id: string;
          icon_id: string;
          id?: string;
          in_trash?: string | null;
          notebook_id: string;
          title: string;
        };
        Update: {
          content?: Json | null;
          created_at?: string;
          folder_id?: string;
          icon_id?: string;
          id?: string;
          in_trash?: string | null;
          notebook_id?: string;
          title?: string;
        };
        Relationships: [];
      };
      folders: {
        Row: {
          created_at: string;
          icon_id: string;
          id: string;
          in_trash: string | null;
          notebook_id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          icon_id: string;
          id?: string;
          in_trash?: string | null;
          notebook_id: string;
          title: string;
        };
        Update: {
          created_at?: string;
          icon_id?: string;
          id?: string;
          in_trash?: string | null;
          notebook_id?: string;
          title?: string;
        };
        Relationships: [];
      };
      liked_songs: {
        Row: {
          created_at: string;
          song_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          song_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          song_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'liked_songs_song_id_fkey';
            columns: ['song_id'];
            isOneToOne: false;
            referencedRelation: 'songs';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'liked_songs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      notebooks: {
        Row: {
          created_at: string;
          id: string;
          in_trash: string | null;
          notebook_user: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          in_trash?: string | null;
          notebook_user: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          in_trash?: string | null;
          notebook_user?: string;
          title?: string;
        };
        Relationships: [];
      };
      songs: {
        Row: {
          artist: string | null;
          created_at: string;
          genre: string | null;
          id: string;
          image_file: string | null;
          song_file: string | null;
          track_name: string | null;
          user_id: string | null;
        };
        Insert: {
          artist?: string | null;
          created_at?: string;
          genre?: string | null;
          id?: string;
          image_file?: string | null;
          song_file?: string | null;
          track_name?: string | null;
          user_id?: string | null;
        };
        Update: {
          artist?: string | null;
          created_at?: string;
          genre?: string | null;
          id?: string;
          image_file?: string | null;
          song_file?: string | null;
          track_name?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'songs_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string | null;
          has_set_password: boolean;
          id: string;
          name: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          has_set_password?: boolean;
          id: string;
          name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          has_set_password?: boolean;
          id?: string;
          name?: string | null;
          updated_at?: string | null;
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never;

export type User = InferSelectModel<typeof users>;
export type Notebook = InferSelectModel<typeof notebooks>;
export type Folder = InferSelectModel<typeof folders>;
export type File = InferSelectModel<typeof files>;
export type Song = InferSelectModel<typeof songs>;
export type LikedSong = InferSelectModel<typeof likedSongs>;
