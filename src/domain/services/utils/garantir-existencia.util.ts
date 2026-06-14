import { ErroNaoEncontradoError } from '../../errors/erro-nao-encontrado.error';

/**
 * Busca uma entidade e lança um `ErroNaoEncontradoError` caso ela não seja encontrada.
 *
 * Centraliza o padrão "buscar ou falhar" usado pelos services antes de
 * retornar, editar ou excluir uma entidade identificada por código.
 *
 * @param buscar Função que busca a entidade, retornando `null` se ela não existir.
 * @param mensagemErro Mensagem do `ErroNaoEncontradoError` lançado caso `buscar` retorne `null`.
 * @throws ErroNaoEncontradoError se `buscar` retornar `null`.
 */
export async function garantirExistencia<T>(
  buscar: () => Promise<T | null>,
  mensagemErro: string,
): Promise<T> {
  const entidade = await buscar();

  if (!entidade) {
    throw new ErroNaoEncontradoError(mensagemErro);
  }

  return entidade;
}
