export const API_BASE_URL = "http://localhost:5001/api";

export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  USER: "user",
} as const;

export const ACCOUNT_STATUS = {
  INVITED: "invited",
  ACTIVE: "active",
  BLACKLISTED: "blacklisted",
  INVITATION_EXPIRED: "invitation_expired",
} as const;

export const PERMISSIONS = {
  // Certificate permissions
  CERT_CREATE: "cert_create",
  CERT_READ: "cert_read",
  CERT_UPDATE: "cert_update",
  CERT_DELETE: "cert_delete",

  // User permissions
  USER_CREATE: "user_create",
  USER_READ: "user_read",
  USER_UPDATE: "user_update",
  USER_DELETE: "user_delete",

  // Role permissions
  ROLE_CREATE: "role_create",
  ROLE_READ: "role_read",
  ROLE_UPDATE: "role_update",
  ROLE_DELETE: "role_delete",
} as const;

export const UI_ROUTES = {
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ROLE_MANAGEMENT: "/role-management",
  USERS: "/users",
  CERTIFICATES: "/certificates",
} as const;
