import { Professor } from '../../src/domain/entities/professor/professor.entity';
import { ProfessorFactory } from '../../src/domain/factories/professor.factory';
import { IProfessorRepository } from '../../src/domain/repositories/professor.repository';
import { ProfessorService } from '../../src/domain/services/professor/professor.service';
import { UsuarioMother } from './usuario.mother';

type ProfessorRawProps = {
  matricula: string
  emailUsuario: string
  nome: string
  cpf: string
  especialidade?: string | null
  titulacao?: string | null
}

/**
 * Object Mother para a entidade Professor.
 *
 * Centraliza a criacao de dados validos de Professor para os testes,
 * permitindo sobrescrever apenas os campos relevantes para cada cenario.
 * Os campos de usuario (nome, cpf, emailUsuario) sao derivados de
 * `UsuarioMother` por padrao para manter consistencia entre os mothers.
 */
export class ProfessorMother {
  /**
   * @returns Um conjunto de props crus validos, com possibilidade de sobrescrita.
   */
  static props(override: Partial<ProfessorRawProps> = {}): ProfessorRawProps {
    const usuarioProps = UsuarioMother.props()
    return {
      matricula: '2026.1',
      emailUsuario: usuarioProps.email,
      nome: usuarioProps.nome,
      cpf: usuarioProps.cpf,
      especialidade: 'Engenharia de Software',
      titulacao: 'MESTRE',
      ...override,
    }
  }

  /**
   * @returns Uma instancia de Professor valida, com possibilidade de sobrescrita.
   */
  static criar(override: Partial<ProfessorRawProps> = {}): Professor {
    return ProfessorFactory.criar(this.props(override))
  }

  /**
   * @returns Um mock de IProfessorRepository.
   */
  static criarRepositoryMock(): jest.Mocked<IProfessorRepository> {
    return {
      buscar: jest.fn(),
      buscarPorMatricula: jest.fn(),
      buscarUltimaMatriculaDoAno: jest.fn(),
      cadastrar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<IProfessorRepository>
  }

  /**
   * @param professor - Professor opcional a ser retornado por `buscarPorMatricula`.
   * @returns Um mock de ProfessorService.
   */
  static criarServiceMock(professor?: Professor): jest.Mocked<ProfessorService> {
    return {
      buscar: jest.fn(),
      buscarPorMatricula: professor === undefined
        ? jest.fn()
        : jest.fn().mockResolvedValue(professor),
      cadastrar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<ProfessorService>
  }
}
