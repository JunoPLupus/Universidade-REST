import { Disciplina } from '../entities/disciplina/disciplina.entity';
import { Texto } from '../value-objects/texto/texto.value-object';
import { Numero } from '../value-objects/numero/numero.value-object';
import { disciplinaMensagens } from '../errors/mensagens/disciplina.mensagens';

const NOME_MIN = 3
const NOME_MAX = 100
const PERIODO_MIN = 1
const CARGA_HORARIA_MIN = 1

/**
 * Fábrica da entidade `Disciplina`.
 *
 * Recebe os dados "crus" (`codigo`, `codCurso`, `periodo`, `nome`,
 * `cargaHoraria`) e monta os value objects (`Texto`, `Numero`) que compõem
 * `DisciplinaProps`, validando as invariantes do domínio antes de delegar a
 * criação da entidade para `Disciplina.criarDisciplina`.
 *
 * @throws ErroValidacaoError se `nome` for vazio, `periodo` for menor que 1,
 * ou `cargaHoraria` for menor ou igual a zero.
 */
export class DisciplinaFactory {
  static criar(dados: Pick<Disciplina, 'codigo' | 'codCurso' | 'periodo' | 'nome' | 'cargaHoraria'>): Disciplina {
    return Disciplina.criarDisciplina({
      codigo: dados.codigo,
      codCurso: dados.codCurso,
      periodo: new Numero(dados.periodo, disciplinaMensagens.periodoInvalido(PERIODO_MIN), PERIODO_MIN),
      nome: new Texto(dados.nome, disciplinaMensagens.nomeInvalido(NOME_MIN, NOME_MAX), NOME_MIN, NOME_MAX),
      cargaHoraria: new Numero(dados.cargaHoraria, disciplinaMensagens.cargaHorariaInvalida(), CARGA_HORARIA_MIN),
    })
  }
}
