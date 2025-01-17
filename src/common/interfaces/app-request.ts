import { Role } from './user/role.enum';

export interface AppRequest extends Request {
  query: Record<string, any>;
  user: {
    id: number;
    username: string;
    role: Role;
  };
}
