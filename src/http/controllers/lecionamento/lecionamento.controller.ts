import { Request, Response } from 'express';
import { Lecionamento } from '../../../domain/entities/lecionamento/lecionamento.entity';
import { Disciplina } from '../../../domain/entities/disciplina/disciplina.entity';
import { Professor } from '../../../domain/entities/professor/professor.entity';
import { Curso } from '../../../domain/entities/curso/curso.entity';
import { LecionamentoRespostaDTO } from '../../dto/lecionamento-resposta.dto';
import { LecionamentoCadastroDTO } from '../../../domain/dto/lecionamento/lecionamento-cadastro.dto';
import { LecionamentoEdicaoDTO } from '../../../domain/dto/lecionamento/lecionamento-edicao.dto';
import { LecionamentoRespostaMapper } from '../../mappers/lecionamento-resposta.mapper';
import { LecionamentoService } from '../../../domain/services/lecionamento/lecionamento.service';
import { DisciplinaService } from '../../../domain/services/disciplina/disciplina.service';
import { ProfessorService } from '../../../domain/services/professor/professor.service';
import { CursoService } from '../../../domain/services/curso/curso.service';
import { Validador } from '../../validation/validador';
import { paraFiltroString } from '../utils/filtros.util';

/**
 * Controller responsável pelas rotas HTTP de Lecionamento.
 *
 * Para montar o formato de resposta, resolve os vínculos de Disciplina,
 * Professor e Curso a partir dos códigos armazenados na entidade Lecionamento.
 *
 * Erros de domínio lançados pelos services são encaminhados automaticamente
 * pelo Express 5 ao middleware global de erros (`errorHandler`).
 */
export class LecionamentoController {
  constructor(
    private readonly lecionamentoService: LecionamentoService,
    private readonly disciplinaService: DisciplinaService,
    private readonly professorService: ProfessorService,
    private readonly cursoService: CursoService,
  ) {}

  /**
   * Resolve todos os vínculos necessários para montar o DTO de resposta.
   */
  private async paraResposta(lecionamento: Lecionamento): Promise<LecionamentoRespostaDTO> {
    const disciplina: Disciplina = await this.disciplinaService.buscarPorCodigo(
      lecionamento.codDisciplina,
    )
    const professor: Professor = await this.professorService.buscarPorMatricula(
      lecionamento.matProfessor,
    )
    const curso: Curso = await this.cursoService.buscarPorCodigo(disciplina.codCurso)

    return LecionamentoRespostaMapper.paraResposta(lecionamento, disciplina, professor, curso)
  }

  /**
   * Lista lecionamentos, opcionalmente filtrando por `codigo`, `codDisciplina`,
   * `matProfessor`, `codSemestre`, `turno` e/ou `diaSemana`.
   *
   * @returns 200 com a lista de lecionamentos no formato `LecionamentoRespostaDTO[]`.
   */
  async buscar(req: Request, res: Response): Promise<void> {
    const { codigo, codDisciplina, matProfessor, codSemestre, turno, diaSemana } = req.query

    const lecionamentos: Lecionamento[] = await this.lecionamentoService.buscar({
      codigo: paraFiltroString(codigo),
      codDisciplina: paraFiltroString(codDisciplina),
      matProfessor: paraFiltroString(matProfessor),
      codSemestre: paraFiltroString(codSemestre),
      turno: paraFiltroString(turno),
      diaSemana: paraFiltroString(diaSemana),
    })

    const resposta = await Promise.all(
      lecionamentos.map((l) => this.paraResposta(l)),
    )

    res.status(200).json(resposta)
  }

  /**
   * @param req.params.codigo - Código do lecionamento buscado.
   * @returns 200 com o lecionamento no formato `LecionamentoRespostaDTO`.
   * @throws ErroNaoEncontrado (404) se não existir lecionamento com o código informado.
   */
  async buscarPorCodigo(req: Request, res: Response): Promise<void> {
    const codigo = (req.params.codigo as string).trim()
    const lecionamento: Lecionamento = await this.lecionamentoService.buscarPorCodigo(codigo)
    res.status(200).json(await this.paraResposta(lecionamento))
  }

  /**
   * @param req.body - Dados do lecionamento a ser cadastrado, no formato `LecionamentoCadastroDTO`.
   * @returns 201 com o lecionamento cadastrado no formato `LecionamentoRespostaDTO`.
   * @throws ErroDadosInvalidos (422) se algum campo obrigatório estiver ausente ou com tipo inválido.
   * @throws ErroValidacao (400) se os dados violarem as invariantes do domínio.
   * @throws ErroNaoEncontrado (404) se Disciplina ou Professor não existirem.
   */
  async cadastrar(req: Request, res: Response): Promise<void> {
    Validador.para(req.body)
      .texto('codDisciplina')
      .texto('matProfessor')
      .texto('codSemestre')
      .texto('turno')
      .texto('diaSemana')
      .validar()

    const dto: LecionamentoCadastroDTO = req.body
    const lecionamento: Lecionamento = await this.lecionamentoService.cadastrar(dto)
    res.status(201).json(await this.paraResposta(lecionamento))
  }

  /**
   * @param req.params.codigo - Código do lecionamento a ser editado.
   * @param req.body - Novos dados, no formato `LecionamentoEdicaoDTO`. Campos omitidos mantêm o valor atual.
   * @returns 200 com o lecionamento atualizado no formato `LecionamentoRespostaDTO`.
   * @throws ErroDadosInvalidos (422) se algum campo informado tiver tipo inválido.
   * @throws ErroNaoEncontrado (404) se o lecionamento não existir.
   * @throws ErroValidacao (400) se os dados violarem as invariantes do domínio.
   */
  async editar(req: Request, res: Response): Promise<void> {
    Validador.para(req.body)
      .textoOpcional('codDisciplina')
      .textoOpcional('matProfessor')
      .textoOpcional('codSemestre')
      .textoOpcional('turno')
      .textoOpcional('diaSemana')
      .validar()

    const codigo = (req.params.codigo as string).trim()
    const dto: LecionamentoEdicaoDTO = req.body
    const lecionamento: Lecionamento = await this.lecionamentoService.editar(codigo, dto)
    res.status(200).json(await this.paraResposta(lecionamento))
  }

  /**
   * @param req.params.codigo - Código do lecionamento a ser removido.
   * @returns 204 sem corpo.
   * @throws ErroNaoEncontrado (404) se o lecionamento não existir.
   */
  async excluir(req: Request, res: Response): Promise<void> {
    const codigo = (req.params.codigo as string).trim()
    await this.lecionamentoService.excluir(codigo)
    res.status(204).send()
  }
}
