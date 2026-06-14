import { Request, Response } from 'express';
import { DisciplinaService } from '../../../domain/services/disciplina.service';
import { CursoService } from '../../../domain/services/curso.service';
import { DisciplinaCadastroDTO } from '../../../domain/services/disciplina-cadastro.dto';
import { DisciplinaEdicaoDTO } from '../../../domain/services/disciplina-edicao.dto';
import { Curso } from "../../../domain/entities/curso/curso.entity";
import { Disciplina } from '../../../domain/entities/disciplina/disciplina.entity';
import { DisciplinaRespostaDTO } from '../../dto/disciplina-resposta.dto';
import { DisciplinaRespostaMapper } from '../../mappers/disciplina-resposta.mapper';

/**
 * Controller responsável pelas rotas HTTP de Disciplina.
 *
 * Além de traduzir requisições/respostas HTTP em chamadas ao
 * `DisciplinaService`, este controller também consulta o `CursoService` para
 * incluir o nome do curso (`curso`) no formato de resposta, no lugar do
 * código do curso (`codCurso`).
 *
 * Erros de domínio lançados pelos services (`ErroDominio` e subclasses) não
 * são tratados aqui: por serem `async`, qualquer rejeição é encaminhada
 * automaticamente pelo Express 5 ao middleware global de erros
 * (`errorHandler`).
 */
export class DisciplinaController {
  constructor(
    private readonly disciplinaService: DisciplinaService,
    private readonly cursoService: CursoService,
  ) {}

  /**
   * Converte uma `Disciplina` para o formato de resposta da API, buscando o
   * curso correspondente (via `codCurso`) para incluir o nome do curso
   * (`curso`) no lugar do código.
   *
   * @throws ErroNaoEncontrado (404) se o curso referenciado pela disciplina não existir.
   */
  private async paraResposta(disciplina: Disciplina): Promise<DisciplinaRespostaDTO> {
    const curso : Curso = await this.cursoService.buscarPorCodigo(disciplina.codCurso)

    return DisciplinaRespostaMapper.paraResposta(disciplina, curso)
  }

  /**
   * Lista disciplinas, opcionalmente filtrando por `nome` (busca parcial),
   * `codCurso` e/ou `codigo` (exatos), informados via query string.
   *
   * @param req.query.nome - Filtro opcional por parte do nome da disciplina.
   * @param req.query.codCurso - Filtro opcional pelo código do curso ao qual a disciplina pertence.
   * @param req.query.codigo - Filtro opcional pelo código exato da disciplina.
   * @returns 200 com a lista de disciplinas no formato `DisciplinaRespostaDTO[]`.
   */
  async buscar(req: Request, res: Response): Promise<void> {
    const { nome, codCurso, codigo } = req.query

    const disciplinas : Disciplina[] = await this.disciplinaService.buscar({
      nome: typeof nome === 'string' ? nome : undefined,
      codCurso: typeof codCurso === 'string' ? codCurso : undefined,
      codigo: typeof codigo === 'string' ? codigo : undefined,
    })

    const resposta = await Promise.all(disciplinas.map((disciplina) => this.paraResposta(disciplina)))

    res.status(200).json(resposta)
  }

  /**
   * @param req.params.codigo - Código da disciplina buscada.
   * @returns 200 com a disciplina no formato `DisciplinaRespostaDTO`.
   * @throws ErroNaoEncontrado (404) se não existir disciplina com o código informado.
   */
  async buscarPorCodigo(req: Request, res: Response): Promise<void> {
    const disciplina : Disciplina = await this.disciplinaService.buscarPorCodigo(req.params.codigo as string)

    res.status(200).json(await this.paraResposta(disciplina))
  }

  /**
   * @param req.body - Dados da disciplina a ser cadastrada, no formato `DisciplinaCadastroDTO`.
   * @returns 201 com a disciplina cadastrada no formato `DisciplinaRespostaDTO`.
   * @throws ErroValidacao (400) se os dados violarem as invariantes de Disciplina.
   * @throws ErroNaoEncontrado (404) se o curso (`codCurso`) informado não existir.
   * @throws ErroConflito (409) se já existir uma disciplina com o mesmo código.
   */
  async cadastrar(req: Request, res: Response): Promise<void> {
    const dto: DisciplinaCadastroDTO = req.body

    const disciplina : Disciplina = await this.disciplinaService.cadastrar(dto)

    res.status(201).json(await this.paraResposta(disciplina))
  }

  /**
   * @param req.params.codigo - Código da disciplina a ser editada.
   * @param req.body - Novos dados da disciplina, no formato `DisciplinaEdicaoDTO`.
   * @returns 200 com a disciplina atualizada no formato `DisciplinaRespostaDTO`.
   * @throws ErroNaoEncontrado (404) se a disciplina não existir.
   * @throws ErroValidacao (400) se os dados violarem as invariantes de Disciplina.
   */
  async editar(req: Request, res: Response): Promise<void> {
    const dto: DisciplinaEdicaoDTO = req.body

    const disciplina : Disciplina = await this.disciplinaService.editar(req.params.codigo as string, dto)

    res.status(200).json(await this.paraResposta(disciplina))
  }

  /**
   * @param req.params.codigo - Código da disciplina a ser removida.
   * @returns 204 sem corpo.
   * @throws ErroNaoEncontrado (404) se a disciplina não existir.
   */
  async excluir(req: Request, res: Response): Promise<void> {
    await this.disciplinaService.excluir(req.params.codigo as string)

    res.status(204).send()
  }
}
