import { ErroValidacaoError } from '../../errors/erro-validacao.error';
import { DisciplinaProps } from './disciplina.props';

/**
 * Entidade Disciplina.
 *
 * Representa uma disciplina vinculada a um curso. O factory `criar`
 * garante as invariantes que dependem apenas dos próprios dados da
 * disciplina. A regra "periodo não pode exceder o total de períodos
 * do curso" depende de outra entidade (Curso) e por isso é validada
 * no service, não aqui.
 */
export class Disciplina {
  private constructor(
    private readonly _codigo: string,
    private readonly _codCurso: string,
    private readonly _periodo: number,
    private readonly _nome: string,
    private readonly _cargaHoraria: number,
  ) {}

  /**
   * Cria uma instância de Disciplina validando as invariantes do domínio.
   *
   * @throws ErroValidacaoError se `nome` for vazio, `periodo` for menor que 3,
   * ou `cargaHoraria` for menor ou igual a zero.
   */
  static criar(props: DisciplinaProps): Disciplina {
    const nome = props.nome.trim();

    if (nome.length === 0) {
      throw new ErroValidacaoError('O nome da disciplina é obrigatório.');
    }

    if (props.periodo < 3) {
      throw new ErroValidacaoError('O período da disciplina deve ser no mínimo 3.');
    }

    if (props.cargaHoraria <= 0) {
      throw new ErroValidacaoError('A carga horária deve ser maior que zero.');
    }

    return new Disciplina(props.codigo, props.codCurso, props.periodo, nome, props.cargaHoraria);
  }

  get codigo(): string {
    return this._codigo;
  }

  get codCurso(): string {
    return this._codCurso;
  }

  get periodo(): number {
    return this._periodo;
  }

  get nome(): string {
    return this._nome;
  }

  get cargaHoraria(): number {
    return this._cargaHoraria;
  }
}
