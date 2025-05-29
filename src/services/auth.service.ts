export type User = {
    name: string;
    email: string;
    password: string;
};

export function getCurrentUser(): User | null {
    return null;
}