/**
 * Erro base para violações de regras de negócio do domínio.
 *
 * Lançado pelas entidades (no factory `criar`) e pelos services quando um
 * dado ou operação viola uma invariante (ex: campo fora do intervalo
 * permitido, regra de negócio não satisfeita).
 *
 * Será especializado em subclasses (ex: NotFoundError, ConflictError)
 * quando o middleware global de tratamento de erros for implementado.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
