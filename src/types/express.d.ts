// Permite anexar dados do usuário autenticado ao objeto Request do Express
// (preenchido pelo middleware de autenticação a partir do token JWT).
export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'admin' | 'professor';
      };
    }
  }
}
