export type CMSCredentials = {
  userName: string;
  password: string;
};

export interface StaffAccount {
  userName: string;
  email: string | null;
  displayName: string | null;
  department: string | null;
  groupMembers: number;
  id: string;
  isActive: boolean;
}

export interface CMSPassport extends StaffAccount {
  expiresAt: number;
  token: string;
}

export function isLoginExpired(pp: CMSPassport): boolean {
  return (Date.now() / 1000) > pp.expiresAt;
}

export function authHeader(token: string): { [key: string]: string } {
  return {
    'Authorization': `Bearer ${token}`,
  };
}

export type UpdatePasswordReq = {
  currentPassword: string;
  newPassword: string;
};

export type UpdatePasswordFormVal = {
  currentPassword: string;
  password: string
  confirmPassword: string;
};
