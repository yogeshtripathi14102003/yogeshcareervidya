export const requireRole = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ msg: "Access denied: insufficient role" });
  }
  next();
};

export const requirePermissions = (...requiredPermissions) => {
  return (req, res, next) => {
    if (req.user?.role === "admin") return next(); // super admin bypasses granular checks

    const userPermissions = req.user?.permissions || [];

    const hasAll = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAll) {
      return res.status(403).json({ error: "Forbidden: Missing Permissions" });
    }

    next();
  };
};

export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (req.user?.role === "admin") return next(); // super admin bypasses granular checks

    const userPermissions = req.user?.permissions || [];
    const hasAny = permissions.some((perm) => userPermissions.includes(perm));
    if (!hasAny)
      return res.status(403).json({ error: "Forbidden: Missing Permissions" });
    next();
  };
};
