export type UserRole = 'player' | 'organizer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermissions {
  canCreateMatch: boolean;
  canEditMatch: boolean;
  canDeleteMatch: boolean;
  canManageUsers: boolean;
}

export function getRolePermissions(role: UserRole): UserPermissions {
  switch (role) {
    case 'admin':
      return {
        canCreateMatch: true,
        canEditMatch: true,
        canDeleteMatch: true,
        canManageUsers: true,
      };
    case 'organizer':
      return {
        canCreateMatch: true,
        canEditMatch: true,
        canDeleteMatch: false,
        canManageUsers: false,
      };
    case 'player':
      return {
        canCreateMatch: false,
        canEditMatch: false,
        canDeleteMatch: false,
        canManageUsers: false,
      };
  }
} 