export interface User {
  id: string;
  username: string;
  roles: string[];
}

export interface CasbinJsPermissions {
  [action: string]: string[];
}

export interface CasbinPermission {
  user: string;
  roles: string[];
  permissions: string[][];
  implicitPermissions: string[][];
}

export interface CasbinContextType {
  user: User | null;
  permissions: CasbinJsPermissions | CasbinPermission | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  can: (action: string, object: string) => Promise<boolean>;
  refreshPermissions: () => Promise<void>;
}
