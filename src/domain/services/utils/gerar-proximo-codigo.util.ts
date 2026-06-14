/**
 * Gera o próximo código sequencial a partir do último código cadastrado.
 *
 * Usado para gerar códigos como `'001'`, `'002'`, ... (cursos) ou, com um
 * prefixo, códigos compostos como `'001.001'`, `'001.002'`, ... (disciplinas
 * dentro do curso `'001'`).
 *
 * @param ultimoCodigo Código do último registro cadastrado, ou `null` se
 * ainda não houver nenhum registro.
 * @param prefixo Prefixo fixo do código (ex: `'001.'` para disciplinas do
 * curso `'001'`). Padrão: string vazia.
 * @param digitos Quantidade de dígitos do número sequencial, preenchidos
 * com zeros à esquerda. Padrão: `3`.
 */
export function gerarProximoCodigo(ultimoCodigo: string | null, prefixo = '', digitos = 3): string {
  if (!ultimoCodigo) {
    return `${prefixo}${'1'.padStart(digitos, '0')}`;
  }

  const sequencialAtual = Number(ultimoCodigo.slice(prefixo.length));
  const proximoSequencial = sequencialAtual + 1;

  return `${prefixo}${String(proximoSequencial).padStart(digitos, '0')}`;
}
