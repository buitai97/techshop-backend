export interface JwtPayload  {
    id: number;
    username?: string;
    avatar?: string;
    role?: Role;
    name?: string;
}