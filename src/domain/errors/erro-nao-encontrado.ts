import { ErroDominio } from './erro-dominio';

/**
 * Erro lançado quando uma entidade buscada por código não é encontrada.
 *
 * Mapeado pelo middleware global de erros para HTTP 404 (Not Found).
 */
export class ErroNaoEncontrado extends ErroDominio {
  readonly statusCode = 404;
}
