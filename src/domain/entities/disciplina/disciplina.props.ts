import { Texto } from '../../value-objects/texto/texto.value-object';
import { Numero } from '../../value-objects/numero/numero.value-object';

/**
 * Props da entidade `Disciplina`.
 *
 * `periodo`, `nome` e `cargaHoraria` já chegam como value objects validados —
 * quem monta esse objeto (a `DisciplinaFactory`) é responsável por construir
 * os VOs e, com isso, garantir as invariantes do domínio antes mesmo de a
 * entidade existir.
 */
export type DisciplinaProps = {
  codigo: string,
  codCurso: string,
  periodo: Numero,
  nome: Texto,
  cargaHoraria: Numero
}
