import { Semestre } from '../entities/semestre/semestre.entity';
import { Numero } from '../value-objects/numero/numero.value-object';
import { semestreMensagens } from '../errors/mensagens/semestre.mensagens';
import { ErroValidacaoError } from '../errors/erro-validacao.error';

const ANO_MIN = 2001
const SEMESTRE_MIN = 1
const SEMESTRE_MAX = 2

/**
 * Fábrica da entidade `Semestre`.
 *
 * Recebe os dados crus (`ano`, `semestre`) e monta os value objects,
 * validando as invariantes do domínio antes de delegar a criação à entidade.
 *
 * @throws ErroValidacaoError se `ano` for menor que 2001 ou `semestre` não
 * for 1 ou 2.
 */
export class SemestreFactory {
  static criar(dados: { ano: number; semestre: number }): Semestre {
    const ano = new Numero(dados.ano, semestreMensagens.anoInvalido(), ANO_MIN)

    if (dados.semestre !== SEMESTRE_MIN && dados.semestre !== SEMESTRE_MAX) {
      throw new ErroValidacaoError(semestreMensagens.semestreInvalido())
    }

    const semestre = new Numero(
      dados.semestre,
      semestreMensagens.semestreInvalido(),
      SEMESTRE_MIN,
      SEMESTRE_MAX,
    )

    const codigo = `${ano.valor}.${semestre.valor}`

    return Semestre.criarSemestre({ codigo, ano, semestre })
  }
}
