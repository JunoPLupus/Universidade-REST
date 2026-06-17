import { Disciplina } from '../../entities/disciplina/disciplina.entity';
import { DisciplinaFactory } from '../../factories/disciplina.factory';
import { DisciplinaCadastroDTO } from '../../dto/disciplina/disciplina-cadastro.dto';
import { DisciplinaEdicaoDTO } from '../../dto/disciplina/disciplina-edicao.dto';
import { BuscarDisciplinaFiltros, IDisciplinaRepository } from '../../repositories/disciplina.repository';
import { disciplinaMensagens } from '../../errors/mensagens/disciplina.mensagens';
import { Curso } from "../../entities/curso/curso.entity";
import { ICursoRepository } from '../../repositories/curso.repository';
import { cursoMensagens } from '../../errors/mensagens/curso.mensagens';
import { gerarProximoCodigo } from '../utils/gerar-proximo-codigo.util';
import { garantirExistencia } from '../utils/garantir-existencia.util';
import { ErroConflitoError } from '../../errors/erro-conflito.error';
import { ErroValidacaoError } from '../../errors/erro-validacao.error';

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
   * @throws ErroNaoEncontrado se o curso não existir.
   * @throws ErroValidacaoError se `dto.periodo` exceder o total de períodos do
   * curso, ou se os demais campos violarem as invariantes da entidade
   * `Disciplina`.
   * @throws ErroConflitoError se já existir uma disciplina com o mesmo nome no curso.
   */
  async cadastrar(dto: DisciplinaCadastroDTO): Promise<Disciplina> {
    const curso : Curso = await garantirExistencia(
      () => this.cursoRepository.buscarPorCodigo(dto.codCurso),
      cursoMensagens.naoEncontrado(dto.codCurso),
    )

    if (dto.periodo > curso.periodos) {
      throw new ErroValidacaoError(disciplinaMensagens.periodoExcedeCurso(curso.periodos))
    }

    const nome = dto.nome.trim()
    const disciplinaExistente = await this.disciplinaRepository.buscarPorNomeECurso(nome, dto.codCurso)

    if (disciplinaExistente) {
      throw new ErroConflitoError(disciplinaMensagens.nomeDuplicado(nome))
    }

    const ultimoCodigo = await this.disciplinaRepository.buscarUltimoCodigoDoCurso(dto.codCurso)
    const codigo = gerarProximoCodigo(ultimoCodigo, `${dto.codCurso}.`)

    const disciplina : Disciplina = DisciplinaFactory.criar({
      codigo,
      codCurso: dto.codCurso,
      periodo: dto.periodo,
      nome: dto.nome,
      cargaHoraria: dto.cargaHoraria,
    })
    await this.disciplinaRepository.cadastrar(disciplina)

    return disciplina
  }

  /**
   * Busca disciplinas pelos filtros informados (todos opcionais; sem filtros, retorna todas).
   *
   * @throws ErroNaoEncontrado se não existir curso com o código 'idCurso' informado.
   */
  async buscar(filtros: BuscarDisciplinaFiltros): Promise<Disciplina[]> {
    if (filtros.codCurso != undefined) {
      await garantirExistencia(
          () => this.cursoRepository.buscarPorCodigo(filtros.codCurso as string),
          cursoMensagens.naoEncontrado(filtros.codCurso)
      )
    }
    return this.disciplinaRepository.buscar(filtros)
  }

  /**
   * Busca uma disciplina pelo código.
   *
   * @throws ErroNaoEncontrado se não existir disciplina com o código informado.
   */
  async buscarPorCodigo(codigo: string): Promise<Disciplina> {
    return garantirExistencia(
      () => this.disciplinaRepository.buscarPorCodigo(codigo),
      disciplinaMensagens.naoEncontrada(codigo),
    )
  }

  /**
   * Edita os dados de uma disciplina existente.
   *
   * O curso ao qual a disciplina pertence não é alterado. Campos não
   * informados em `dto` mantêm o valor atual da disciplina.
   *
   * @throws ErroNaoEncontrado se a disciplina não existir.
   * @throws ErroValidacaoError se `dto.periodo` exceder o total de períodos do
   * curso, ou se os demais campos violarem as invariantes da entidade
   * `Disciplina`.
   * @throws ErroConflitoError se o novo nome já estiver em uso por outra
   * disciplina do mesmo curso.
   */
  async editar(codigo: string, dto: DisciplinaEdicaoDTO): Promise<Disciplina> {
    const disciplinaExistente = await this.buscarPorCodigo(codigo)

    const curso : Curso = await garantirExistencia(
      () => this.cursoRepository.buscarPorCodigo(disciplinaExistente.codCurso),
      cursoMensagens.naoEncontrado(disciplinaExistente.codCurso),
    )

    const periodo = dto.periodo ?? disciplinaExistente.periodo
    const nome = (dto.nome ?? disciplinaExistente.nome).trim()
    const cargaHoraria = dto.cargaHoraria ?? disciplinaExistente.cargaHoraria

    if (periodo > curso.periodos) {
      throw new ErroValidacaoError(disciplinaMensagens.periodoExcedeCurso(curso.periodos))
    }

    const disciplinaComMesmoNome = await this.disciplinaRepository.buscarPorNomeECurso(
      nome,
      disciplinaExistente.codCurso,
    )

    if (disciplinaComMesmoNome && disciplinaComMesmoNome.codigo !== codigo) {
      throw new ErroConflitoError(disciplinaMensagens.nomeDuplicado(nome))
    }

    const disciplinaAtualizada : Disciplina = DisciplinaFactory.criar({
      codigo,
      codCurso: disciplinaExistente.codCurso,
      periodo,
      nome,
      cargaHoraria,
    })
    await this.disciplinaRepository.editar(disciplinaAtualizada)

    return disciplinaAtualizada
  }

  /**
   * Remove uma disciplina pelo código.
   *
   * @throws ErroNaoEncontrado se não existir disciplina com o código informado.
   */
  async excluir(codigo: string): Promise<void> {
    await this.buscarPorCodigo(codigo)
    await this.disciplinaRepository.excluir(codigo)
  }

  /**
   * Remove todas as disciplinas vinculadas ao curso informado.
   *
   * @throws ErroNaoEncontrado se não existir curso com o código informado.
   */
  async excluirPorCurso(codCurso: string): Promise<void> {
    await garantirExistencia(
      () => this.cursoRepository.buscarPorCodigo(codCurso),
      cursoMensagens.naoEncontrado(codCurso),
    )

    await this.disciplinaRepository.excluirPorCurso(codCurso)
  }
}
