import { ErroDominio } from './erro-dominio';

/**
 * Erro lançado quando os dados informados violam uma invariante de domínio
 * (ex: campo fora do intervalo permitido, regra de negócio não satisfeita).
 *
 * Mapeado pelo middleware global de erros para HTTP 400 (Bad Request).
 */
export class ErroValidacao extends ErroDominio {
  readonly statusCode = 400;
}
