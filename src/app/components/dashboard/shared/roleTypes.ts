import type { UserType } from '../../../auth/AuthContext';

export type { UserType };

export function isOwnerRole(role: UserType): role is 'owner' {
  return role === 'owner';
}
