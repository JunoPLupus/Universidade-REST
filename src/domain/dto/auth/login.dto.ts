/**
 * Dados necessários para autenticar um usuário.
 *
 * `senha` é texto plano — a comparação com o hash ocorre no `AuthService`.
 */
export type LoginDTO = {
  email: string
  senha: string
}
