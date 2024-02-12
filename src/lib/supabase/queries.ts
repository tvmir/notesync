'use server';
import { validate } from 'uuid';
import db from './db';
import {
  files,
  folders,
  likedSongs,
  notebooks,
  recommendedSongs,
  songs,
  users,
} from '../../../migrations/schema';
import { and, eq } from 'drizzle-orm';
import { File, Folder, LikedSong, Notebook, Song } from '@/types/supabase';

export const createNotebook = async (notebook: Notebook) => {
  try {
    await db.insert(notebooks).values(notebook);

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log('Create Notebook Error: ' + error);

    return {
      data: null,
      error: 'Error: Unable to create folder',
    };
  }
};

export const fetchNotebooks = async (userId: string) => {
  if (!userId) return [];

  return (await db
    .select({
      id: notebooks.id,
      createdAt: notebooks.createdAt,
      notebookUser: notebooks.notebookUser,
      title: notebooks.title,
      inTrash: notebooks.inTrash,
      pomodoroCount: notebooks.pomodoroCount,
    })
    .from(notebooks)
    .where(eq(notebooks.notebookUser, userId))) as Notebook[];
};

export const updateNotebook = async (
  notebook: Partial<Notebook>,
  notebookId: string
) => {
  try {
    await db
      .update(notebooks)
      .set(notebook)
      .where(eq(notebooks.id, notebookId));

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log('Update Notebook Error: ' + error);

    return {
      data: null,
      error: 'Error: Unable to update notebook',
    };
  }
};

export const fetchFolders = async (notebookId: string) => {
  const isValid = validate(notebookId);

  if (!isValid) {
    return {
      data: null,
      error: 'Error: Invalid user ID',
    };
  }

  try {
    const res: Folder[] | [] = await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.notebookId, notebookId));

    return {
      data: res,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: 'Error: Unable to fetch folders',
    };
  }
};

export const createFolder = async (folder: Folder) => {
  try {
    await db.insert(folders).values(folder);

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log('Create Folder Error: ', error);

    return {
      data: null,
      error: 'Error: Unable to create folder',
    };
  }
};

export const createFile = async (file: File) => {
  try {
    await db.insert(files).values(file);

    return {
      data: '',
      error: null,
    };
  } catch (error) {
    console.log(error);

    return {
      data: null,
      error: 'Error',
    };
  }
};

export const fetchFiles = async (folderId: string) => {
  const isValid = validate(folderId);

  if (!isValid)
    return {
      data: null,
      error: 'Error: This folder does not exist.',
    };

  try {
    const res = (await db
      .select()
      .from(files)
      .orderBy(files.createdAt)
      .where(eq(files.folderId, folderId))) as File[] | [];

    return {
      data: res,
      error: null,
    };
  } catch (error) {
    console.log(error);

    return { data: null, error: 'Error: Unable to fetch files' };
  }
};

export const updateFolder = async (
  folder: Partial<Folder>,
  folderId: string
) => {
  try {
    await db.update(folders).set(folder).where(eq(folders.id, folderId));

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log('Update Folder Error: ' + error);

    return {
      data: null,
      error: 'Error: Unable to update folder',
    };
  }
};

export const updateFile = async (file: Partial<File>, fileId: string) => {
  try {
    await db.update(files).set(file).where(eq(files.id, fileId));

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log(error);

    return {
      data: null,
      error: 'Error: Unable to update file',
    };
  }
};

export const fetchSongs = async () => {
  try {
    const res = await db.select().from(songs);

    return { data: res, error: null };
  } catch (error) {
    console.log(error);

    return {
      data: null,
      error: 'Error: Unable to fetch songs',
    };
  }
};

export const fetchSongByID = async (songId: string) => {
  try {
    const res = await db
      .select()
      .from(songs)
      .where(eq(songs.id, songId))
      .limit(1);

    return {
      data: res[0],
      error: null,
    };
  } catch (error) {
    console.log(error);

    return {
      data: null,
      error: 'Error: Unable to fetch songs',
    };
  }
};

export const likeSong = async (userId: string, songId: string) => {
  try {
    await db.insert(likedSongs).values({
      userId,
      songId,
      likeCount: 1,
    });

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log('Like Song Error: ' + error);

    return {
      data: null,
      error: 'Error: Unable to like song',
    };
  }
};
