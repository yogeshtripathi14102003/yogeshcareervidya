/**
 * @typedef {Object} BlogAuthor
 * @property {string} name
 * @property {string} [designation]
 * @property {{url: string}} [profile_img]
 */

/**
 * @typedef {Object} BlogListItem
 * @property {string} _id
 * @property {string} title
 * @property {string} slug
 * @property {{url: string}} [image]
 * @property {BlogAuthor} [author]
 * @property {string} [category]
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} [reads]
 */

/**
 * @typedef {Object} BlogListResponse
 * @property {boolean} success
 * @property {BlogListItem[]} data
 * @property {number} [total]
 * @property {number} [totalPages]
 */

export {};
