import { Request, Response } from 'express';
import { Curso } from "../../../domain/entities/curso/curso.entity";
import { CursoService } from '../../../domain/services/curso.service';
import { CursoCadastroDTO } from '../../../domain/dto/curso/curso-cadastro.dto';
import { CursoEdicaoDTO } from '../../../domain/dto/curso/curso-edicao.dto';
import { CursoRespostaMapper } from '../../mappers/curso-resposta.mapper';
import { Validador } from '../../validation/validador';
import { paraFiltroString } from '../utils/filtros.util';

/**
 * Controller responsável pelas rotas HTTP de Curso.
 *
 * Apenas traduz requisições/respostas HTTP em chamadas ao `CursoService` —
 * toda a lógica de negócio (validações, geração de código, etc.) fica no
 * service. Erros de domínio lançados pelo service (`ErroDominioError` e
 * subclasses) não são tratados aqui: por serem `async`, qualquer rejeição é
 * encaminhada automaticamente pelo Express 5 ao middleware global de erros
 * (`errorHandler`).
 */
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  /**
   * Lista cursos, opcionalmente filtrando por `nome` (busca parcial, sem
   * diferenciar maiúsculas/minúsculas) e/ou `codigo` (exato), informados via
   * query string.
   *
   * @param req.query.nome - Filtro opcional por parte do nome do curso.
   * @param req.query.codigo - Filtro opcional pelo código exato do curso.
   * @returns 200 com a lista de cursos no formato `CursoRespostaDTO[]`.
   */
  async buscar(req: Request, res: Response): Promise<void> {
    const { nome, codigo } = req.query

    const cursos : Curso[] = await this.cursoService.buscar({
      nome: paraFiltroString(nome),
      codigo: paraFiltroString(codigo),
    })

    res.status(200).json(cursos.map(CursoRespostaMapper.paraResposta))
  }

  /**
   * @param req.params.codigo - Código do curso buscado.
   * @returns 200 com o curso no formato `CursoRespostaDTO`.
   * @throws ErroNaoEncontrado (404) se não existir curso com o código informado.
   */
  async buscarPorCodigo(req: Request, res: Response): Promise<void> {
    const codigo = (req.params.codigo as string).trim()

    const curso : Curso = await this.cursoService.buscarPorCodigo(codigo)

    res.status(200).json(CursoRespostaMapper.paraResposta(curso))
  }

  /**
   * @param req.body - Dados do curso a ser cadastrado, no formato `CursoCadastroDTO`.
   * @returns 201 com o curso cadastrado no formato `CursoRespostaDTO`.
   * @throws ErroDadosInvalidos (422) se `nome`/`periodos` estiverem ausentes ou com tipo inválido.
   * @throws ErroValidacao (400) se `nome`/`periodos` violarem as invariantes de Curso.
   * @throws ErroConflito (409) se já existir um curso com o mesmo nome.
   */
  async cadastrar(req: Request, res: Response): Promise<void> {
    Validador.para(req.body).texto('nome').numero('periodos').validar()

    const dto: CursoCadastroDTO = req.body

    const curso : Curso = await this.cursoService.cadastrar(dto)

    res.status(201).json(CursoRespostaMapper.paraResposta(curso))
  }

  /**
   * @param req.params.codigo - Código do curso a ser editado.
   * @param req.body - Novos dados do curso, no formato `CursoEdicaoDTO`. Campos
   * omitidos mantêm o valor atual.
   * @returns 200 com o curso atualizado no formato `CursoRespostaDTO`.
   * @throws ErroDadosInvalidos (422) se `nome`/`periodos`, quando informados, tiverem tipo inválido.
   * @throws ErroNaoEncontrado (404) se o curso não existir.
   * @throws ErroConflito (409) se o novo nome já estiver em uso por outro curso.
   * @throws ErroValidacao (400) se `nome`/`periodos` violarem as invariantes de Curso.
   */
  async editar(req: Request, res: Response): Promise<void> {
    Validador.para(req.body).textoOpcional('nome').numeroOpcional('periodos').validar()

    const dto: CursoEdicaoDTO = req.body
    const codigo = (req.params.codigo as string).trim()

    const curso : Curso = await this.cursoService.editar(codigo, dto)

    res.status(200).json(CursoRespostaMapper.paraResposta(curso))
  }

  /**
   * @param req.params.codigo - Código do curso a ser removido.
   * @returns 204 sem corpo.
   * @throws ErroNaoEncontrado (404) se o curso não existir.
   * @throws ErroConflito (409) se existirem disciplinas vinculadas ao curso.
   */
  async excluir(req: Request, res: Response): Promise<void> {
    const codigo = (req.params.codigo as string).trim()

    await this.cursoService.excluir(codigo)

    res.status(204).send()
  }
}
