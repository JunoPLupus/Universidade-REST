import { Lecionamento } from '../entities/lecionamento/lecionamento.entity';
import { Texto } from '../value-objects/texto/texto.value-object';
import { lecionamentoMensagens } from '../errors/mensagens/lecionamento.mensagens';
import { ErroValidacaoError } from '../errors/erro-validacao.error';

const TURNOS_VALIDOS = ['Manhã', 'Tarde', 'Noite'] as const
const DIAS_VALIDOS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'] as const

/**
 * Fábrica da entidade `Lecionamento`.
 *
 * Valida `turno` e `diaSemana` contra os conjuntos de valores permitidos e
 * monta os value objects antes de delegar a criação à entidade.
 *
 * @throws ErroValidacaoError se `turno` ou `diaSemana` não pertencerem aos
 * valores permitidos.
 */
export class LecionamentoFactory {
  static criar(dados: Pick<Lecionamento, 'codigo' | 'codDisciplina' | 'matProfessor' | 'codSemestre' | 'turno' | 'diaSemana'>): Lecionamento {
    if (!TURNOS_VALIDOS.includes(dados.turno as typeof TURNOS_VALIDOS[number])) {
      throw new ErroValidacaoError(lecionamentoMensagens.turnoInvalido())
    }

    if (!DIAS_VALIDOS.includes(dados.diaSemana as typeof DIAS_VALIDOS[number])) {
      throw new ErroValidacaoError(lecionamentoMensagens.diaSemanaInvalido())
    }

    return Lecionamento.criarLecionamento({
      codigo: dados.codigo,
      codDisciplina: dados.codDisciplina,
      matProfessor: dados.matProfessor,
      codSemestre: dados.codSemestre,
      turno: new Texto(dados.turno, lecionamentoMensagens.turnoInvalido(), 1),
      diaSemana: new Texto(dados.diaSemana, lecionamentoMensagens.diaSemanaInvalido(), 1),
    })
  }
}
