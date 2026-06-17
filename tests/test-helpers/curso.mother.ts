import { Curso } from '../../src/domain/entities/curso/curso.entity';
import { CursoFactory } from '../../src/domain/factories/curso.factory';
import { CursoService } from "../../src/domain/services/curso.service";

type CursoRawProps = Pick<Curso, 'codigo' | 'nome' | 'periodos'>

/**
 * Object Mother para a entidade Curso.
 *
 * Centraliza a criação de dados válidos de Curso para os testes,
 * permitindo sobrescrever apenas os campos relevantes para cada cenário.
 */
export class CursoMother {
  /**
   * @return Um conjunto de props válidas, com possibilidade de sobrescrita.
   */
  static props(override: Partial<CursoRawProps> = {}): CursoRawProps {
    return {
      codigo: '001',
      nome: 'Ciência da Computação',
      periodos: 8,
      ...override,
    }
  }

  /**
   * @return Uma instância de Curso válida, com possibilidade de sobrescrita.
   */
  static criar(override: Partial<CursoRawProps> = {}): Curso {
    return CursoFactory.criar(this.props(override))
  }

  /**
   * @return Um mock de CursoService.
   */
  static criarServiceMock(curso ?: Curso) : jest.Mocked<CursoService> {
    return {
      buscar: jest.fn(),
      buscarPorCodigo: curso == undefined ? jest.fn() : jest.fn().mockResolvedValue(curso),
      cadastrar: jest.fn(),
      editar: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<CursoService>
  }
}
