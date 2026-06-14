/**
 * Erro base para violações de regras de negócio do domínio.
 *
 * Classe abstrata — sempre lançar uma das subclasses (`ErroNaoEncontradoError`,
 * `ErroConflitoError`, `ErroValidacaoError`), nunca `ErroDominioError` diretamente.
 * Cada subclasse define o `statusCode` HTTP correspondente, usado pelo
 * middleware global de tratamento de erros para montar a resposta.
 */
export abstract class ErroDominioError extends Error {
  /** Status HTTP correspondente a este tipo de erro. */
  abstract readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
