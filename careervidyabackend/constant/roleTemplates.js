// import { PERMISSIONS } from "./permissions.js";
import { PERMISSIONS } from "./permission.js";

export const ROLE_TEMPLATES = {
  admin: Object.values(PERMISSIONS), // full access
  subadmin: [
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.REFUND_ORDERS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_VENDORS,
  ],
  user: [], // no admin permissions
};
