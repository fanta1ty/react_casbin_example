import { Authorizer } from "casbin.js";

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
  authorizer: Authorizer | null;
  permissions: CasbinJsPermissions | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  can: (action: string, object: string) => Promise<boolean>;
  cannot: (action: string, object: string) => Promise<boolean>;
  refreshPermissions: () => Promise<void>;
}
