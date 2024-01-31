// import fs from 'fs';
// import csv from 'csv-parser';
// import * as tf from '@tensorflow/tfjs';
// // import '@tensorflow/tfjs-node';

// export const trainedModel = async () => {
//   // Function to read CSV file
//   async function readCSV(filePath: string) {
//     return new Promise<any[]>((resolve, reject) => {
//       const data: any[] = [];
//       fs.createReadStream(filePath)
//         .pipe(csv())
//         .on('data', (row) => {
//           data.push(row);
//         })
//         .on('end', () => {
//           resolve(data);
//         })
//         .on('error', (error) => {
//           reject(error);
//         });
//     });
//   }

//   // Adjust the file paths accordingly
//   const songsFilePath = 'path/to/songs.csv';
//   const likesFilePath = 'path/to/likes.csv';

//   // Read songs data
//   const songsData = await readCSV(songsFilePath);

//   // Extract features
//   const songFeatures = songsData.map((row) => [
//     parseFloat(row.speechiness),
//     parseFloat(row.acousticness),
//   ]);

//   // Convert features data to TensorFlow tensor
//   const songFeaturesTensor = tf.tensor2d(songFeatures);

//   // Read likes data
//   const likesData = await readCSV(likesFilePath);

//   // Create a user-song matrix (binary matrix indicating if a user liked a song)
//   const userSongMatrix: number[][] = [];

//   // Extract user IDs and populate the user-song matrix
//   likesData.forEach((likeRow) => {
//     const userId = likeRow.id; // Assuming 'id' is the user ID column
//     const likedSongs = likeRow.likes.split(',').map(String); // Assuming 'likes' is a comma-separated list of song IDs

//     // Initialize the user row with zeros
//     let userRow: number[] = new Array(songsData.length).fill(0);

//     // Mark liked songs as 1 in the user row
//     likedSongs.forEach((songId) => {
//       const index = songsData.findIndex((song) => song.id === songId);
//       if (index !== -1) {
//         userRow[index] = 1;
//       }
//     });

//     // Add the user row to the matrix
//     userSongMatrix.push(userRow);
//   });

//   // Convert user-song matrix to TensorFlow tensor
//   const userSongMatrixTensor = tf.tensor2d(userSongMatrix);

//   // Function to recommend songs using cosine similarity
//   function recommend(userIndex: number) {
//     // Get the user preferences (row from user-song matrix)
//     const userPreferences = userSongMatrixTensor.slice([userIndex, 0], [1, -1]);

//     // Compute cosine similarity
//     const similarity = tf.dot(songFeaturesTensor, userPreferences.transpose());
//     const normSongs = tf.norm(songFeaturesTensor, 2, 1);
//     const normUser = tf.norm(userPreferences, 2, 1);
//     const normProduct = tf.outerProduct(normSongs, normUser);
//     const cosineSimilarity = tf.div(similarity, normProduct);

//     // Get the indices of top recommendations
//     const topRecommendations = tf.topk(cosineSimilarity, 5);
//     const indices = topRecommendations.indices.arraySync();

//     return indices;
//   }

//   // Example: Recommend songs for a user with specific preferences
//   const userIndex = 0; // Replace with the actual index of the user you want to recommend songs for
//   const recommendations = recommend(userIndex);
//   console.log('Top recommended song indices:', recommendations);
// };
