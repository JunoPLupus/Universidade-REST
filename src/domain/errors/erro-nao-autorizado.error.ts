import { ErroDominioError } from './erro-dominio.error';

/**
 * Erro lançado quando um usuário autenticado tenta acessar um recurso
 * para o qual não tem permissão (papel insuficiente).
 *
 * Mapeado para HTTP 403 (Forbidden) pelo middleware global de erros.
 * Deve ser usado nos middlewares de autorização por papel (`admin`, `professor`).
 */
export class ErroNaoAutorizadoError extends ErroDominioError {
  readonly statusCode = 403
}
