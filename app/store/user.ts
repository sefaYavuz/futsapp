import { create } from 'zustand';
import { User, UserRole, getRolePermissions } from '../types/user';

interface UserState {
  currentUser: User | null;
  permissions: ReturnType<typeof getRolePermissions> | null;
  setUser: (user: User | null) => void;
  updateUserRole: (role: UserRole) => void;
  hasPermission: (permission: keyof ReturnType<typeof getRolePermissions>) => boolean;
}

export const useUserStore = create<UserState>()((set, get) => ({
  currentUser: null,
  permissions: null,
  setUser: (user) => {
    set({
      currentUser: user,
      permissions: user ? getRolePermissions(user.role) : null,
    });
  },
  updateUserRole: (role) => {
    const { currentUser } = get();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        role,
        updatedAt: new Date().toISOString(),
      };
      set({
        currentUser: updatedUser,
        permissions: getRolePermissions(role),
      });
    }
  },
  hasPermission: (permission) => {
    const { permissions } = get();
    return permissions ? permissions[permission] : false;
  },
})); 