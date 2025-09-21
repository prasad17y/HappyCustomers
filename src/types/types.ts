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

export interface Tab {
  key: string;
  title: string;
}

export interface FilterTab extends Tab {
  role?: Role;
}
