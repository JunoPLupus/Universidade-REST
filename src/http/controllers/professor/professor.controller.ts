import { Request, Response } from 'express';
import { ProfessorService } from '../../../domain/services/professor/professor.service';
import { ProfessorCadastroDTO } from '../../../domain/dto/professor/professor-cadastro.dto';
import { ProfessorEdicaoDTO } from '../../../domain/dto/professor/professor-edicao.dto';
import { ProfessorRespostaMapper } from '../../mappers/professor-resposta.mapper';
import { Validador } from '../../validation/validador';
import { ErroNaoAutorizadoError } from '../../../domain/errors/erro-nao-autorizado.error';
import { authMensagens } from '../../../domain/errors/mensagens/auth.mensagens';
import { paraFiltroString } from '../utils/filtros.util';

/**
 * Controller responsavel pelas rotas HTTP de Professor.
 *
 * Apenas traduz requisicoes/respostas HTTP em chamadas ao `ProfessorService`.
 * A logica de autorizacao refinada para PATCH (professor so edita a si mesmo)
 * e feita aqui, apos buscar a entidade, pois depende do `emailUsuario` dela.
 */
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  /**
   * Lista professores, com filtros opcionais via query string.
   *
   * @returns 200 com a lista de professores no formato `ProfessorRespostaDTO[]`.
   */
  async buscar(req: Request, res: Response): Promise<void> {
    const { matricula, email, nome, cpf, especialidade, titulacao } = req.query

    const professores = await this.professorService.buscar({
      matricula: paraFiltroString(matricula),
      email: paraFiltroString(email),
      nome: paraFiltroString(nome),
      cpf: paraFiltroString(cpf),
      especialidade: paraFiltroString(especialidade),
      titulacao: paraFiltroString(titulacao),
    })

    res.status(200).json(professores.map(ProfessorRespostaMapper.paraResposta))
  }

  /**
   * @param req.params.mat - Matricula do professor buscado.
   * @returns 200 com o professor no formato `ProfessorRespostaDTO`.
   * @throws ErroNaoEncontradoError (404) se nao existir professor com a matricula informada.
   */
  async buscarPorMatricula(req: Request, res: Response): Promise<void> {
    const matricula = (req.params.mat as string).trim()

    const professor = await this.professorService.buscarPorMatricula(matricula)

    res.status(200).json(ProfessorRespostaMapper.paraResposta(professor))
  }

  /**
   * @param req.body - Dados do professor, no formato `ProfessorCadastroDTO`.
   * @returns 201 com o professor cadastrado no formato `ProfessorRespostaDTO`.
   * @throws ErroDadosInvalidosError (422) se campos obrigatorios estiverem ausentes ou invalidos.
   * @throws ErroConflitoError (409) se o e-mail ou CPF ja estiverem em uso.
   */
  async cadastrar(req: Request, res: Response): Promise<void> {
    Validador.para(req.body)
      .texto('email')
      .texto('cpf')
      .texto('nome')
      .texto('senha')
      .textoOpcional('especialidade')
      .textoOpcional('titulacao')
      .validar()

    const dto: ProfessorCadastroDTO = req.body

    const professor = await this.professorService.cadastrar(dto)

    res.status(201).json(ProfessorRespostaMapper.paraResposta(professor))
  }

  /**
   * Atualiza dados editaveis de um professor.
   *
   * Regra de autorizacao: admin pode editar qualquer professor; professor
   * so pode editar a si mesmo. A verificacao e feita apos buscar a entidade,
   * pois precisa do `emailUsuario` para comparar com `req.user.email`.
   *
   * @param req.params.mat - Matricula do professor a ser editado.
   * @param req.body - Campos a atualizar, no formato `ProfessorEdicaoDTO`.
   * @returns 200 com o professor atualizado no formato `ProfessorRespostaDTO`.
   * @throws ErroNaoAutorizadoError (403) se o professor tentar editar outro professor.
   * @throws ErroNaoEncontradoError (404) se a matricula nao existir.
   */
  async atualizar(req: Request, res: Response): Promise<void> {
    Validador.para(req.body)
      .textoOpcional('nome')
      .textoOpcional('especialidade')
      .textoOpcional('titulacao')
      .textoOpcional('senha')
      .validar()

    const matricula = (req.params.mat as string).trim()

    const professor = await this.professorService.buscarPorMatricula(matricula)

    const ehAdmin = req.user?.role === 'ADMIN'
    const ehOProprioUsuario = professor.emailUsuario === req.user?.email

    if (!ehAdmin && !ehOProprioUsuario) {
      throw new ErroNaoAutorizadoError(authMensagens.semPermissao())
    }

    const dto: ProfessorEdicaoDTO = req.body ?? {}

    const professorAtualizado = await this.professorService.atualizar(matricula, dto)

    res.status(200).json(ProfessorRespostaMapper.paraResposta(professorAtualizado))
  }

  /**
   * @param req.params.mat - Matricula do professor a ser removido.
   * @returns 204 sem corpo.
   * @throws ErroNaoEncontradoError (404) se a matricula nao existir.
   */
  async excluir(req: Request, res: Response): Promise<void> {
    const matricula = (req.params.mat as string).trim()

    await this.professorService.excluir(matricula)

    res.status(204).send()
  }
}
