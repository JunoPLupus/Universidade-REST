import { ErroDominioError } from './erro-dominio.error';

/**
 * Erro lançado quando uma operação viola uma restrição de unicidade
 * (ex: cadastrar ou renomear para um nome já usado por outro registro).
 *
 * Mapeado pelo middleware global de erros para HTTP 409 (Conflict).
 */
export class ErroConflitoError extends ErroDominioError {
  readonly statusCode = 409
}
