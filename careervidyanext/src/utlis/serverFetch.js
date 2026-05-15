// // src/utlis/serverFetch.js

// export const serverFetch = async (path, options = {}) => {
//   const baseURL = process.env.API_URL;
  
//   const res = await fetch(`${baseURL}${path}`, {
//     ...options,
//   });
  
//   return res;
// }; 

// src/utlis/serverFetch.js



export const serverFetch = async (path, options = {}) => {
  const baseURL = process.env.API_URL || "https://api.careervidya.in";

  const res = await fetch(`${baseURL}${path}`, {
    ...options,
  });

  return res;
};