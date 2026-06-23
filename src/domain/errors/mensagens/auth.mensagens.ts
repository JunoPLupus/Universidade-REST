/**
 * Mensagens de erro relacionadas a autenticacao e autorizacao.
 */
export const authMensagens = {
  /** Usada pelo AuthService quando email nao existe ou senha nao confere. */
  credenciaisInvalidas: (): string => 'E-mail ou senha invalidos.',

  /** Usada pelo middleware verificarAutenticacao quando o token esta ausente ou invalido. */
  naoAutenticado: (): string => 'E necessario estar autenticado para acessar este recurso.',

  /** Usada pelo middleware exigirAdmin e pelo controller quando o role e insuficiente. */
  semPermissao: (): string => 'Voce nao tem permissao para realizar esta acao.',
}
