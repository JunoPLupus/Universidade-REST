import { Lecionamento } from '../../src/domain/entities/lecionamento/lecionamento.entity';
import { LecionamentoFactory } from '../../src/domain/factories/lecionamento.factory';
import { ILecionamentoRepository } from '../../src/domain/repositories/lecionamento.repository';
import { LecionamentoService } from '../../src/domain/services/lecionamento/lecionamento.service';
import { DisciplinaMother } from './disciplina.mother';
import { ProfessorMother } from './professor.mother';
import { SemestreMother } from './semestre.mother';

type LecionamentoRawProps = Pick<
  Lecionamento,
  'codigo' | 'codDisciplina' | 'matProfessor' | 'codSemestre' | 'turno' | 'diaSemana'
>;

/**
 * Object Mother para a entidade Lecionamento.
 *
 * Centraliza a criação de dados válidos de Lecionamento para os testes.
 * Por padrão, os vínculos apontam para os dados gerados pelos outros mothers.
 */
export class LecionamentoMother {
  /**
   * @returns Um conjunto de props crus válidos, com possibilidade de sobrescrita.
   */
  static props(override: Partial<LecionamentoRawProps> = {}): LecionamentoRawProps {
    const semestre = SemestreMother.props();
    const disciplina = DisciplinaMother.props();
    const professor = ProfessorMother.props();

    return {
      codigo: `${semestre.codigo}.${disciplina.codCurso}.001`,
      codDisciplina: disciplina.codigo,
      matProfessor: professor.matricula,
      codSemestre: semestre.codigo,
      turno: 'Manhã',
      diaSemana: 'Seg',
      ...override,
    };
  }

  /**
   * @returns Uma instância de Lecionamento válida, com possibilidade de sobrescrita.
   */
  static criar(override: Partial<LecionamentoRawProps> = {}): Lecionamento {
    return LecionamentoFactory.criar(this.props(override));
  }

  /**
   * @returns Um mock de ILecionamentoRepository.
   */
  static criarRepositoryMock(): jest.Mocked<ILecionamentoRepository> {
    return {
      buscar: jest.fn(),
      buscarPorCodigo: jest.fn(),
      buscarUltimoCodigoDoSemestreCurso: jest.fn(),
      cadastrar: jest.fn(),
      editar: jest.fn(),
      excluir: jest.fn(),
      existePorDisciplina: jest.fn(),
      existePorProfessor: jest.fn(),
    } as unknown as jest.Mocked<ILecionamentoRepository>;
  }

  /**
   * @returns Um mock de LecionamentoService.
   */
  static criarServiceMock(): jest.Mocked<LecionamentoService> {
    return {
      buscar: jest.fn(),
      buscarPorCodigo: jest.fn(),
      cadastrar: jest.fn(),
      editar: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<LecionamentoService>;
  }
}
