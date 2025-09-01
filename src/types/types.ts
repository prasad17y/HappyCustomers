export interface UserType {
  id: string;
  name: string;
  email: string | null;
  role: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}
