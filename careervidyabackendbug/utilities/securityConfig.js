import SecurityConfig from "../models/SecurityConfig.js";

let cached = null;
let cachedAt = 0;
const CACHE_MS = 60 * 1000;

export const getSecurityConfig = async ({ fresh = false } = {}) => {
  if (!fresh && cached && Date.now() - cachedAt < CACHE_MS) return cached;

  let config = await SecurityConfig.findOne();
  if (!config) config = await SecurityConfig.create({});

  cached = config;
  cachedAt = Date.now();
  return config;
};

export const invalidateSecurityConfigCache = () => {
  cached = null;
};
