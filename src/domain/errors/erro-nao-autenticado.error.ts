import { ErroDominioError } from './erro-dominio.error';

/**
 * Erro lançado quando as credenciais de autenticação são inválidas ou ausentes.
 *
 * Mapeado para HTTP 401 (Unauthorized) pelo middleware global de erros.
 * Deve ser usado no serviço de autenticação quando o e-mail não existe ou
 * a senha não confere — sempre com a mesma mensagem genérica, para não
 * revelar qual das duas informações está errada (prevenção de enumeração).
 */
export class ErroNaoAutenticadoError extends ErroDominioError {
  readonly statusCode = 401
}
