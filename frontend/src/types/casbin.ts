export interface User {
  id: string;
  username: string;
  roles: string[];
}

export interface CasbinPermission {
  user: string;
  roles: string[];
  permissions: string[][];
  implicitPermissions: string[][];
}

export interface EnforceRequest {
  user: string;
  object: string;
  action: string;
}

export interface EnforceResponse {
  allowed: boolean;
  request: {
    user: string;
    object: string;
    action: string;
  };
}

export interface CasbinContextType {
  user: User | null;
  permissions: CasbinPermission | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  checkPermission: (object: string, action: string) => Promise<boolean>;
  refreshPermissions: () => Promise<void>;
}
