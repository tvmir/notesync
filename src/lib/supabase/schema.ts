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
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  title: text('title').notNull(),
  pomodoroCount: smallint('pomodoro_count').default(0),
  timeSpent: integer('time_spent').default(0),
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
});

// Liked Songs Table
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
    like_count: smallint('like_count'),
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

// Recommended Songs Table
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

// Tasks Table
export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
  task: text('task').notNull(),
  status: text('status').notNull(),
  notebookId: uuid('notebook_id')
    .notNull()
    .references(() => notebooks.id, {
      onDelete: 'cascade',
    }),
});
