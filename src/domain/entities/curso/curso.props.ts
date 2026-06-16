import { Texto } from '../../value-objects/texto/texto.value-object';
import { Numero } from '../../value-objects/numero/numero.value-object';

/**
 * Props da entidade `Curso`.
 *
 * `nome` e `periodos` já chegam como value objects validados — quem monta
 * esse objeto (a `CursoFactory`) é responsável por construir os VOs e, com
 * isso, garantir as invariantes do domínio antes mesmo de a entidade existir.
 */
export type CursoProps = {
  codigo: string,
  nome: Texto,
  periodos: Numero
}
