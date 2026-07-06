export enum Role {
  USER = 1 << 0, // 1

  /** @deprecated Giữ giá trị để không break JWT tokens cũ. Không dùng ở domain layer mới. */
  MERCHANT = USER | (1 << 1), // 1 | 2 = 3

  ADMIN = MERCHANT | (1 << 2), // 3 | 4 = 7
  SUPER_ADMIN = ADMIN | (1 << 3), // 7 | 8 = 15
}

export function hasPermission(userRole: number | Role | undefined, requiredRole: Role): boolean {
  if (userRole === undefined) return false;
  const roleNum = Number(userRole);
  if ((roleNum & Role.SUPER_ADMIN) === Role.SUPER_ADMIN) {
    return true;
  }
  return roleNum === requiredRole;
}

export function hasAnyPermission(userRole: number | Role | undefined, requiredRoles: Role[]): boolean {
  if (userRole === undefined) return false;
  const roleNum = Number(userRole);
  if ((roleNum & Role.SUPER_ADMIN) === Role.SUPER_ADMIN) {
    return true;
  }
  return requiredRoles.includes(roleNum);
}
