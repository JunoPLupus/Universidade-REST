import { Lecionamento } from '../../entities/lecionamento/lecionamento.entity';
import { LecionamentoFactory } from '../../factories/lecionamento.factory';
import { SemestreFactory } from '../../factories/semestre.factory';
import { LecionamentoCadastroDTO } from '../../dto/lecionamento/lecionamento-cadastro.dto';
import { LecionamentoEdicaoDTO } from '../../dto/lecionamento/lecionamento-edicao.dto';
import { BuscarLecionamentoFiltros, ILecionamentoRepository } from '../../repositories/lecionamento.repository';
import { ISemestreRepository } from '../../repositories/semestre.repository';
import { IDisciplinaRepository } from '../../repositories/disciplina.repository';
import { IProfessorRepository } from '../../repositories/professor.repository';
import { lecionamentoMensagens } from '../../errors/mensagens/lecionamento.mensagens';
import { disciplinaMensagens } from '../../errors/mensagens/disciplina.mensagens';
import { professorMensagens } from '../../errors/mensagens/professor.mensagens';
import { semestreMensagens } from '../../errors/mensagens/semestre.mensagens';
import { garantirExistencia } from '../utils/garantir-existencia.util';
import { gerarProximoCodigo } from '../utils/gerar-proximo-codigo.util';
import { ErroValidacaoError } from '../../errors/erro-validacao.error';
import { ErroConflitoError } from '../../errors/erro-conflito.error';

/** Regex que valida o formato "AAAA.S" (ex: "2026.2") */
const REGEX_CODIGO_SEMESTRE = /^(\d{4})\.(1|2)$/

/**
 * Service responsável pelas regras de negócio relacionadas a Lecionamento.
 *
 * Ao cadastrar, verifica a existência de Disciplina, Professor e Semestre.
 * Se o Semestre ainda não existir, ele é criado automaticamente a partir do
 * código informado (formato "AAAA.S"). O código do Lecionamento é gerado
 * sequencialmente no formato `"<codSemestre>.<codCurso>.<NNN>"`.
 */
export class LecionamentoService {
  constructor(
    private readonly lecionamentoRepository: ILecionamentoRepository,
    private readonly semestreRepository: ISemestreRepository,
    private readonly disciplinaRepository: IDisciplinaRepository,
    private readonly professorRepository: IProfessorRepository,
  ) {}

  /**
   * Resolve o semestre pelo código: retorna o existente ou cria um novo.
   *
   * @throws ErroValidacaoError se o código não estiver no formato "AAAA.S".
   */
  private async resolverSemestre(codSemestre: string): Promise<void> {
    const semestresExistente = await this.semestreRepository.buscarPorCodigo(codSemestre)
    if (semestresExistente) return

    const match = REGEX_CODIGO_SEMESTRE.exec(codSemestre)
    if (!match) throw new ErroValidacaoError(semestreMensagens.codigoInvalido())

    const ano = parseInt(match[1], 10)
    const semestre = parseInt(match[2], 10)
    const novoSemestre = SemestreFactory.criar({ ano, semestre })
    await this.semestreRepository.cadastrar(novoSemestre)
  }

  /**
   * Cadastra um novo lecionamento.
   *
   * Valida a existência de Disciplina, Professor e Semestre (criando-o
   * automaticamente se não existir). O código é gerado sequencialmente
   * no formato `"<codSemestre>.<codCurso>.<NNN>"`.
   *
   * @throws ErroNaoEncontradoError se a Disciplina ou o Professor não existirem.
   * @throws ErroValidacaoError se o código do Semestre tiver formato inválido
   * ou se `turno`/`diaSemana` não forem valores permitidos.
   */
  async cadastrar(dto: LecionamentoCadastroDTO): Promise<Lecionamento> {
    const disciplina = await garantirExistencia(
      () => this.disciplinaRepository.buscarPorCodigo(dto.codDisciplina),
      disciplinaMensagens.naoEncontrada(dto.codDisciplina),
    )

    await garantirExistencia(
      () => this.professorRepository.buscarPorMatricula(dto.matProfessor),
      professorMensagens.naoEncontrado(dto.matProfessor),
    )

    await this.resolverSemestre(dto.codSemestre)

    const codCurso = disciplina.codCurso
    const ultimoCodigo = await this.lecionamentoRepository.buscarUltimoCodigoDoSemestreCurso(
      dto.codSemestre,
      codCurso,
    )
    const codigo = gerarProximoCodigo(ultimoCodigo, `${dto.codSemestre}.${codCurso}.`)

    const lecionamento = LecionamentoFactory.criar({
      codigo,
      codDisciplina: dto.codDisciplina,
      matProfessor: dto.matProfessor,
      codSemestre: dto.codSemestre,
      turno: dto.turno,
      diaSemana: dto.diaSemana,
    })

    const duplicatas = await this.lecionamentoRepository.buscar({
      codDisciplina: dto.codDisciplina,
      matProfessor: dto.matProfessor,
      codSemestre: dto.codSemestre,
      turno: dto.turno,
      diaSemana: dto.diaSemana,
    })
    if (duplicatas.length > 0) {
      throw new ErroConflitoError(lecionamentoMensagens.lecionamentoIdentico())
    }

    await this.lecionamentoRepository.cadastrar(lecionamento)
    return lecionamento
  }

  /**
   * Busca lecionamentos pelos filtros informados (todos opcionais; sem
   * filtros, retorna todos).
   */
  async buscar(filtros: BuscarLecionamentoFiltros): Promise<Lecionamento[]> {
    return this.lecionamentoRepository.buscar(filtros)
  }

  /**
   * Busca um lecionamento pelo código.
   *
   * @throws ErroNaoEncontradoError se não existir lecionamento com o código informado.
   */
  async buscarPorCodigo(codigo: string): Promise<Lecionamento> {
    return garantirExistencia(
      () => this.lecionamentoRepository.buscarPorCodigo(codigo),
      lecionamentoMensagens.naoEncontrado(codigo),
    )
  }

  /**
   * Edita os dados de um lecionamento existente.
   *
   * Campos não informados em `dto` mantêm o valor atual. Se `codDisciplina`,
   * `matProfessor` ou `codSemestre` forem alterados, verifica a existência
   * dos novos vínculos.
   *
   * @throws ErroNaoEncontradoError se o Lecionamento, a Disciplina ou o
   * Professor não existirem.
   * @throws ErroValidacaoError se o novo código de Semestre for inválido ou
   * se `turno`/`diaSemana` não forem valores permitidos.
   */
  async editar(codigo: string, dto: LecionamentoEdicaoDTO): Promise<Lecionamento> {
    const existente = await this.buscarPorCodigo(codigo)

    const codDisciplina = dto.codDisciplina ?? existente.codDisciplina
    const matProfessor = dto.matProfessor ?? existente.matProfessor
    const codSemestre = dto.codSemestre ?? existente.codSemestre
    const turno = dto.turno ?? existente.turno
    const diaSemana = dto.diaSemana ?? existente.diaSemana

    const disciplina = await garantirExistencia(
      () => this.disciplinaRepository.buscarPorCodigo(codDisciplina),
      disciplinaMensagens.naoEncontrada(codDisciplina),
    )

    if (dto.matProfessor && dto.matProfessor !== existente.matProfessor) {
      await garantirExistencia(
        () => this.professorRepository.buscarPorMatricula(matProfessor),
        professorMensagens.naoEncontrado(matProfessor),
      )
    }

    if (dto.codSemestre && dto.codSemestre !== existente.codSemestre) {
      await this.resolverSemestre(codSemestre)
    }

    const duplicatas = await this.lecionamentoRepository.buscar({
      codDisciplina, matProfessor, codSemestre, turno, diaSemana,
    })
    if (duplicatas.some(l => l.codigo !== codigo)) {
      throw new ErroConflitoError(lecionamentoMensagens.lecionamentoIdentico())
    }

    const novoPrefixo = `${codSemestre}.${disciplina.codCurso}.`
    let novoCodigo = codigo
    if (!codigo.startsWith(novoPrefixo)) {
      const ultimoCodigo = await this.lecionamentoRepository.buscarUltimoCodigoDoSemestreCurso(
        codSemestre,
        disciplina.codCurso,
      )
      novoCodigo = gerarProximoCodigo(ultimoCodigo, novoPrefixo)
    }

    const lecionamentoAtualizado = LecionamentoFactory.criar({
      codigo: novoCodigo,
      codDisciplina,
      matProfessor,
      codSemestre,
      turno,
      diaSemana,
    })

    await this.lecionamentoRepository.editar(codigo, lecionamentoAtualizado)
    return lecionamentoAtualizado
  }

  /**
   * Remove um lecionamento pelo código.
   *
   * @throws ErroNaoEncontradoError se não existir lecionamento com o código informado.
   */
  async excluir(codigo: string): Promise<void> {
    await this.buscarPorCodigo(codigo)
    await this.lecionamentoRepository.excluir(codigo)
  }
}
