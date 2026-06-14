import { ErroValidacaoError } from '../../errors/erro-validacao.error';
import { CursoProps } from './curso.props';

/**
 * Entidade Curso.
 *
 * Representa um curso oferecido pela universidade. O factory `criar`
 * garante que nenhuma instância exista em um estado inválido — usado
 * tanto para criar um curso novo quanto para reconstituir um curso
 * existente a partir dos dados do banco.
 */
export class Curso {
  private constructor(
    private readonly _codigo: string,
    private readonly _nome: string,
    private readonly _periodos: number,
  ) {}

  /**
   * Cria uma instância de Curso validando as invariantes do domínio.
   *
   * @throws ErroValidacaoError se `nome` não tiver entre 5 e 100 caracteres,
   * ou se `periodos` não estiver entre 3 e 12.
   */
  static criar(props: CursoProps): Curso {
    const nome = props.nome.trim();

    if (nome.length < 5 || nome.length > 100) {
      throw new ErroValidacaoError('O nome do curso deve ter entre 5 e 100 caracteres.');
    }

    if (props.periodos < 3 || props.periodos > 12) {
      throw new ErroValidacaoError('O curso deve ter entre 3 e 12 períodos.');
    }

    return new Curso(props.codigo, nome, props.periodos);
  }

  get codigo(): string {
    return this._codigo;
  }

  get nome(): string {
    return this._nome;
  }

  get periodos(): number {
    return this._periodos;
  }
}
