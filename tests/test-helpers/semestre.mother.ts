import { Semestre } from '../../src/domain/entities/semestre/semestre.entity';
import { SemestreFactory } from '../../src/domain/factories/semestre.factory';
import { ISemestreRepository } from '../../src/domain/repositories/semestre.repository';

type SemestreRawProps = {
  ano: number;
  semestre: number;
}

/**
 * Object Mother para a entidade Semestre.
 *
 * Centraliza a criação de dados válidos de Semestre para os testes,
 * permitindo sobrescrever apenas os campos relevantes para cada cenário.
 */
export class SemestreMother {
  /**
   * @returns Um conjunto de props crus válidos, com possibilidade de sobrescrita.
   */
  static props(override: Partial<SemestreRawProps> = {}): SemestreRawProps & { codigo: string } {
    const props = {
      ano: 2026,
      semestre: 1,
      ...override,
    };
    return { ...props, codigo: `${props.ano}.${props.semestre}` };
  }

  /**
   * @returns Uma instância de Semestre válida, com possibilidade de sobrescrita.
   */
  static criar(override: Partial<SemestreRawProps> = {}): Semestre {
    const { ano, semestre } = this.props(override);
    return SemestreFactory.criar({ ano, semestre });
  }

  /**
   * @returns Um mock de ISemestreRepository.
   */
  static criarRepositoryMock(): jest.Mocked<ISemestreRepository> {
    return {
      buscarPorCodigo: jest.fn(),
      cadastrar: jest.fn(),
    } as unknown as jest.Mocked<ISemestreRepository>;
  }
}
