// Strips Mongo operator injection payloads (keys starting with "$" or containing ".")
// from req.body / req.query / req.params. Runs with no extra dependency.

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    const clean = {};
    for (const key of Object.keys(value)) {
      if (key.startsWith("$") || key.includes(".")) continue; // drop dangerous keys
      clean[key] = sanitizeValue(value[key]);
    }
    return clean;
  }
  return value;
};

const sanitizeInputs = (req, _res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) {
    const cleaned = sanitizeValue(req.query);
    Object.keys(req.query).forEach((k) => delete req.query[k]);
    Object.assign(req.query, cleaned);
  }
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};

export default sanitizeInputs;
