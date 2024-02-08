import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// Users Table
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

// Notebooks Folder
export const notebooks = pgTable('notebooks', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
  notebookUser: uuid('notebook_user').notNull(),
  title: text('title').notNull(),
  inTrash: text('in_trash'),
  pomodoroCount: smallint('pomodoro_count'),
});

// Folders Table
export const folders = pgTable('folders', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
  title: text('title').notNull(),
  iconId: text('icon_id').notNull(),
  inTrash: text('in_trash'),
  notebookId: uuid('notebook_id')
    .notNull()
    .references(() => notebooks.id, {
      onDelete: 'cascade',
    }),
});

// Files Table
export const files = pgTable('files', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
  title: text('title').notNull(),
  iconId: text('icon_id').notNull(),
  content: jsonb('content'),
  inTrash: text('in_trash'),
  notebookId: uuid('notebook_id')
    .notNull()
    .references(() => notebooks.id, {
      onDelete: 'cascade',
    }),
  folderId: uuid('folder_id')
    .notNull()
    .references(() => folders.id, {
      onDelete: 'cascade',
    }),
});

// Songs Table
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
  likes: uuid('likes').array(),
});

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
