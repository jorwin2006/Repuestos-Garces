export type AdminRole = "developer" | "staff";

export type AdminPermissions = {
  canCreateProduct: boolean;
  canEditProduct: boolean;
  canDeleteProduct: boolean;
  canUploadImage: boolean;
  canViewActivity: boolean;
  canViewDeletedProducts: boolean;
  canManageUsers: boolean;
};

export type SessionUser = {
  id: string;
  username: string;
  role: AdminRole;
  permissions: AdminPermissions;
};

export const DEVELOPER_PERMISSIONS: AdminPermissions = {
  canCreateProduct: true,
  canEditProduct: true,
  canDeleteProduct: true,
  canUploadImage: true,
  canViewActivity: true,
  canViewDeletedProducts: true,
  canManageUsers: true,
};

export const EMPTY_STAFF_PERMISSIONS: AdminPermissions = {
  canCreateProduct: false,
  canEditProduct: false,
  canDeleteProduct: false,
  canUploadImage: false,
  canViewActivity: false,
  canViewDeletedProducts: false,
  canManageUsers: false,
};