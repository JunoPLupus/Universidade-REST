import { Numero } from '../../value-objects/numero/numero.value-object';

/**
 * Props da entidade `Semestre`.
 *
 * `ano` e `semestre` chegam como value objects validados; quem os monta é a
 * `SemestreFactory`, que garante as invariantes antes de a entidade existir.
 */
export type SemestreProps = {
  codigo: string,
  ano: Numero,
  semestre: Numero
}
