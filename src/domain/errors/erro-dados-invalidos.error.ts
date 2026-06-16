import { ErroDominioError } from './erro-dominio.error';

/**
 * Erro lançado quando o corpo da requisição não tem o formato esperado
 * (ex: campo obrigatório ausente, ou campo com tipo diferente do esperado).
 *
 * Diferente de `ErroValidacaoError` (que representa uma invariante de
 * domínio violada, ex: nome fora do tamanho permitido), este erro é
 * detectado antes de qualquer regra de negócio ser avaliada — ainda na
 * borda HTTP, pelo `Validador`.
 *
 * Mapeado pelo middleware global de erros para HTTP 422 (Unprocessable Entity).
 */
export class ErroDadosInvalidosError extends ErroDominioError {
  readonly statusCode = 422
}
