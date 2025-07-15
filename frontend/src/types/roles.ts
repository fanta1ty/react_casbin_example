export interface RoleUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  role: string;
  accountStatus: "invited" | "active" | "blacklisted" | "invitation_expired";
  permissions: string[];
  createdAt: Date;
  lastModified: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  userCount: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  action: string;
  object: string;
}
