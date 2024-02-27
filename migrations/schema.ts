import {
  pgTable,
  pgEnum,
  uuid,
  timestamp,
  text,
  smallint,
  jsonb,
  boolean,
  foreignKey,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const keyStatus = pgEnum('key_status', [
  'default',
  'valid',
  'invalid',
  'expired',
]);
export const keyType = pgEnum('key_type', [
  'aead-ietf',
  'aead-det',
  'hmacsha512',
  'hmacsha256',
  'auth',
  'shorthash',
  'generichash',
  'kdf',
  'secretbox',
  'secretstream',
  'stream_xchacha20',
]);
export const factorType = pgEnum('factor_type', ['totp', 'webauthn']);
export const factorStatus = pgEnum('factor_status', ['unverified', 'verified']);
export const aalLevel = pgEnum('aal_level', ['aal1', 'aal2', 'aal3']);
export const codeChallengeMethod = pgEnum('code_challenge_method', [
  's256',
  'plain',
]);

export const folders = pgTable('folders', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  title: text('title').notNull(),
  iconId: text('icon_id').notNull(),
  notebookId: text('notebook_id').notNull(),
});

export const notebooks = pgTable('notebooks', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  pomodoroCount: smallint('pomodoro_count').default(0),
});

export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  title: text('title').notNull(),
  iconId: text('icon_id').notNull(),
  content: jsonb('content'),
  notebookId: text('notebook_id').notNull(),
  folderId: uuid('folder_id').notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
  name: text('name'),
  email: text('email'),
  avatarUrl: text('avatar_url'),
  hasSetPassword: boolean('has_set_password').default(false).notNull(),
});

export const songs = pgTable('songs', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  trackName: text('track_name'),
  artist: text('artist'),
  songFile: text('song_file'),
  imageFile: text('image_file'),
  genre: text('genre'),
});

export const recommendedSongs = pgTable(
  'recommended_songs',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    songId: uuid('song_id')
      .notNull()
      .references(() => songs.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  },
  (table) => {
    return {
      recommendedSongsPkey: primaryKey({
        columns: [table.userId, table.songId],
        name: 'recommended_songs_pkey',
      }),
    };
  }
);

export const likedSongs = pgTable(
  'liked_songs',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    songId: uuid('song_id')
      .notNull()
      .references(() => songs.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    likeCount: smallint('like_count'),
  },
  (table) => {
    return {
      likedSongsPkey: primaryKey({
        columns: [table.userId, table.songId],
        name: 'liked_songs_pkey',
      }),
    };
  }
);
