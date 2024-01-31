'use server';
import { validate } from 'uuid';
import db from './db';
import {
  files,
  folders,
  likedSongs,
  notebooks,
  songs,
  users,
} from '../../../migrations/schema';
import { and, eq, inArray } from 'drizzle-orm';
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
    })
    .from(notebooks)
    .where(eq(notebooks.notebookUser, userId))) as Notebook[];
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

export const fetchSongByGenreID = async (songId: string, genre: string) => {
  try {
    const res = await db
      .select()
      .from(songs)
      .where(and(eq(songs.id, songId), eq(songs.genre, genre)))
      .limit(1);

    return { data: res[0], error: null };
  } catch (error) {
    console.log(error);

    return {
      data: null,
      error: 'Error: Unable to fetch songs',
    };
  }
};

export const fetchSongsByGenre = async (genre: string) => {
  try {
    const res = await db.select().from(songs).where(eq(songs.genre, genre));

    return { data: res, error: null };
  } catch (error) {
    console.log(error);

    return {
      data: null,
      error: 'Error: Unable to fetch songs by genre',
    };
  }
};

// export const fetchLikedSong = async (userId: string, songId: string) => {
//   try {
//     const res = (await db
//       .select()
//       .from(likedSongs)
//       .where(and(eq(users.id, userId), eq(songs.id, songId)))
//       .limit(1)) as LikedSong[] | [];

//     return {
//       data: res[0],
//       error: null,
//     };
//   } catch (error) {
//     console.log(error);

//     return {
//       data: null,
//       error: 'Error: Unable to fetch liked song',
//     };
//   }
// };

export const fetchLikedSong = async (userId: string, songId: string) => {
  try {
    const res = (await db
      .select({
        likes: songs.likes,
      }) // Adjust the columns as needed
      .from(songs)
      // .where(and(eq(users.id, userId), eq(songs.id, songId)))
      .limit(1)) as Song[] | [];

    if (res.length === 0) {
      return {
        data: null,
        error: 'Error: Song not found',
      };
    }

    // Extract likes array from the result
    const likesArray = res[0].likes;

    // Your existing logic for fetching user-specific data goes here
    // For example, checking if the user ID is in the likes array

    return {
      data: {
        id: res[0].id,
        track_name: res[0].trackName,
        artist: res[0].artist,
        likes: likesArray,
      },
      error: null,
    };
  } catch (error) {
    console.log(error);

    return {
      data: null,
      error: 'Error: Unable to fetch liked song',
    };
  }
};

export const likeSong = async (userId: string, songId: string) => {
  try {
    // db.update(files).set(file).where(eq(files.id, fileId));
    await db
      .update(songs)
      .set({
        likes: [userId],
      })
      .where(eq(songs.id, songId));

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

// export const likeSong = async (userId: string, songId: string) => {
//   try {
//     await db.insert(likedSongs).values({
//       userId,
//       songId,
//     });

//     return {
//       data: null,
//       error: null,
//     };
//   } catch (error) {
//     console.log('Like Song Error: ' + error);

//     return {
//       data: null,
//       error: 'Error: Unable to like song',
//     };
//   }
// };

export const removeLikedSong = async (userId: string[], songId: string) => {
  try {
    await db
      .delete(songs)
      .where(and(inArray(songs.likes, [userId]), eq(songs.id, songId)));
    // await db
    //   .delete(likedSongs)
    //   .where(and(eq(users.id, userId), eq(songs.id, songId)));

    return {
      data: null,
      error: null,
    };
  } catch (error) {
    console.log(error);

    return {
      data: null,
      error: 'Error: Unable to remove liked song',
    };
  }
};
