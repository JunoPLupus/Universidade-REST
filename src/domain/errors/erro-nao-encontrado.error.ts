import { ErroDominioError } from './erro-dominio.error';

/**
 * Erro lançado quando uma entidade buscada por código não é encontrada.
 *
 * Mapeado pelo middleware global de erros para HTTP 404 (Not Found).
 */
export class ErroNaoEncontradoError extends ErroDominioError {
  readonly statusCode = 404
}
