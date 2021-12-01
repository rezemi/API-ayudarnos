export interface JwtPayload {
    userId: string;
    email: string;
    name: string;
    fullName: string;
    imgURL: string;
    donaciones: number;
    premios: number;
}
