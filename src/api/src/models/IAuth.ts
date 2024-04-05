export interface IAuth {
    verifyToken(token: string): Promise<void>
}