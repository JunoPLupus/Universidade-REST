import { Disciplina } from '../entities/disciplina/disciplina.entity';
import { BuscarDisciplinaFiltros, IDisciplinaRepository } from '../repositories/disciplina.repository';
import { ICursoRepository } from '../repositories/curso.repository';
import { DomainError } from '../errors/domain-error';
import { DisciplinaCadastroDTO } from './disciplina-cadastro.dto';
import { DisciplinaEdicaoDTO } from './disciplina-edicao.dto';
import { gerarProximoCodigo } from './utils/gerar-proximo-codigo.util';
import { garantirExistencia } from './utils/garantir-existencia.util';

/**
 * Service responsável pelas regras de negócio relacionadas a Disciplina.
 *
 * Além das validações de unicidade e geração de código (análogas ao
 * `CursoService`), valida a regra "o período da disciplina não pode exceder
 * o total de períodos do curso" — por depender da entidade `Curso`, essa
 * regra não pode ser validada por `Disciplina.criar` e por isso é validada
 * aqui, usando o `ICursoRepository`.
 */
export class DisciplinaService {
  constructor(
    private readonly disciplinaRepository: IDisciplinaRepository,
    private readonly cursoRepository: ICursoRepository,
  ) {}

  /**
   * Cadastra uma nova disciplina vinculada a um curso.
   *
   * Gera o código sequencial automaticamente (`'<codCurso>.001'`,
   * `'<codCurso>.002'`, ...) e garante que o curso informado existe, que o
   * período não excede o total de períodos do curso, e que não existe outra
   * disciplina com o mesmo nome no mesmo curso.
   *
   * @throws DomainError se o curso não existir, se `dto.periodo` exceder o
   * total de períodos do curso, se já existir uma disciplina com o mesmo
   * nome no curso, ou se os demais campos violarem as invariantes da
   * entidade `Disciplina`.
   */
  async cadastrar(dto: DisciplinaCadastroDTO): Promise<Disciplina> {
    const curso = await garantirExistencia(
      () => this.cursoRepository.buscarPorCodigo(dto.codCurso),
      `Curso com código "${dto.codCurso}" não encontrado.`,
    );

    if (dto.periodo > curso.periodos) {
      throw new DomainError(
        `O período da disciplina não pode ser maior que o total de períodos do curso (${curso.periodos}).`,
      );
    }

    const nome = dto.nome.trim();
    const disciplinaExistente = await this.disciplinaRepository.buscarPorNomeECurso(nome, dto.codCurso);

    if (disciplinaExistente) {
      throw new DomainError(`Já existe uma disciplina chamada "${nome}" cadastrada nesse curso.`);
    }

    const ultimoCodigo = await this.disciplinaRepository.buscarUltimoCodigoDoCurso(dto.codCurso);
    const codigo = gerarProximoCodigo(ultimoCodigo, `${dto.codCurso}.`);

    const disciplina = Disciplina.criar({
      codigo,
      codCurso: dto.codCurso,
      periodo: dto.periodo,
      nome: dto.nome,
      cargaHoraria: dto.cargaHoraria,
    });
    await this.disciplinaRepository.cadastrar(disciplina);

    return disciplina;
  }

  /** Busca disciplinas pelos filtros informados (todos opcionais; sem filtros, retorna todas). */
  async buscar(filtros: BuscarDisciplinaFiltros): Promise<Disciplina[]> {
    return this.disciplinaRepository.buscar(filtros);
  }

  /**
   * Busca uma disciplina pelo código.
   *
   * @throws DomainError se não existir disciplina com o código informado.
   */
  async buscarPorCodigo(codigo: string): Promise<Disciplina> {
    return garantirExistencia(
      () => this.disciplinaRepository.buscarPorCodigo(codigo),
      `Disciplina com código "${codigo}" não encontrada.`,
    );
  }

  /**
   * Edita os dados de uma disciplina existente.
   *
   * O curso ao qual a disciplina pertence não é alterado.
   *
   * @throws DomainError se a disciplina não existir, se `dto.periodo`
   * exceder o total de períodos do curso, se o novo nome já estiver em uso
   * por outra disciplina do mesmo curso, ou se os demais campos violarem as
   * invariantes da entidade `Disciplina`.
   */
  async editar(codigo: string, dto: DisciplinaEdicaoDTO): Promise<Disciplina> {
    const disciplinaExistente = await this.buscarPorCodigo(codigo);

    const curso = await garantirExistencia(
      () => this.cursoRepository.buscarPorCodigo(disciplinaExistente.codCurso),
      `Curso com código "${disciplinaExistente.codCurso}" não encontrado.`,
    );

    if (dto.periodo > curso.periodos) {
      throw new DomainError(
        `O período da disciplina não pode ser maior que o total de períodos do curso (${curso.periodos}).`,
      );
    }

    const nome = dto.nome.trim();
    const disciplinaComMesmoNome = await this.disciplinaRepository.buscarPorNomeECurso(
      nome,
      disciplinaExistente.codCurso,
    );

    if (disciplinaComMesmoNome && disciplinaComMesmoNome.codigo !== codigo) {
      throw new DomainError(`Já existe uma disciplina chamada "${nome}" cadastrada nesse curso.`);
    }

    const disciplinaAtualizada = Disciplina.criar({
      codigo,
      codCurso: disciplinaExistente.codCurso,
      periodo: dto.periodo,
      nome: dto.nome,
      cargaHoraria: dto.cargaHoraria,
    });
    await this.disciplinaRepository.editar(disciplinaAtualizada);

    return disciplinaAtualizada;
  }

  /**
   * Remove uma disciplina pelo código.
   *
   * @throws DomainError se não existir disciplina com o código informado.
   */
  async excluir(codigo: string): Promise<void> {
    await this.buscarPorCodigo(codigo);
    await this.disciplinaRepository.excluir(codigo);
  }
}
