import { Lecionamento } from '../../domain/entities/lecionamento/lecionamento.entity';
import { Disciplina } from '../../domain/entities/disciplina/disciplina.entity';
import { Professor } from '../../domain/entities/professor/professor.entity';
import { Curso } from '../../domain/entities/curso/curso.entity';
import { LecionamentoRespostaDTO } from '../dto/lecionamento-resposta.dto';

/** Mapeamento de abreviações de dia da semana para nomes completos. */
const DIA_SEMANA_NOMES: Record<string, string> = {
  Seg: 'Segunda',
  Ter: 'Terça',
  Qua: 'Quarta',
  Qui: 'Quinta',
  Sex: 'Sexta',
  Sab: 'Sábado',
}

/**
 * Converte a entidade `Lecionamento` e seus vínculos resolvidos (Disciplina,
 * Professor e Curso) para o formato de resposta da API.
 *
 * A resolução dos vínculos é responsabilidade do controller, não deste mapper.
 */
export class LecionamentoRespostaMapper {
  static paraResposta(
    lecionamento: Lecionamento,
    disciplina: Disciplina,
    professor: Professor,
    curso: Curso,
  ): LecionamentoRespostaDTO {
    return {
      codigo: lecionamento.codigo,
      disciplina: {
        codigo: disciplina.codigo,
        curso: curso.nome,
        nome: disciplina.nome,
        periodo: disciplina.periodo,
      },
      professor: {
        matricula: professor.matricula,
        nome: professor.nome,
      },
      semestre: lecionamento.codSemestre,
      turno: lecionamento.turno,
      diaSemana: DIA_SEMANA_NOMES[lecionamento.diaSemana] ?? lecionamento.diaSemana,
    }
  }
}
