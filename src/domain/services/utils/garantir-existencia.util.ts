import { DomainError } from '../../errors/domain-error';

/**
 * Busca uma entidade e lança um `DomainError` caso ela não seja encontrada.
 *
 * Centraliza o padrão "buscar ou falhar" usado pelos services antes de
 * retornar, editar ou excluir uma entidade identificada por código.
 *
 * @param buscar Função que busca a entidade, retornando `null` se ela não existir.
 * @param mensagemErro Mensagem do `DomainError` lançado caso `buscar` retorne `null`.
 * @throws DomainError se `buscar` retornar `null`.
 */
export async function garantirExistencia<T>(
  buscar: () => Promise<T | null>,
  mensagemErro: string,
): Promise<T> {
  const entidade = await buscar();

  if (!entidade) {
    throw new DomainError(mensagemErro);
  }

  return entidade;
}
