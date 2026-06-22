// Permite anexar dados do usuario autenticado ao objeto Request do Express
// (preenchido pelo middleware de autenticacao a partir do token JWT).
export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        /** E-mail do usuario autenticado (campo `sub` do payload JWT). */
        email: string;
        /** Papel do usuario no sistema (`ADMIN` | `PROFESSOR`). */
        role: string;
      };
    }
  }
}
