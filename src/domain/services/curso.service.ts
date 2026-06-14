import { Curso } from '../entities/curso/curso.entity';
import { BuscarCursoFiltros, ICursoRepository } from '../repositories/curso.repository';
import { ErroConflito } from '../errors/erro-conflito';
import { CursoCadastroDTO } from './curso-cadastro.dto';
import { CursoEdicaoDTO } from './curso-edicao.dto';
import { gerarProximoCodigo } from './utils/gerar-proximo-codigo.util';
import { garantirExistencia } from './utils/garantir-existencia.util';

/**
 * Service responsável pelas regras de negócio relacionadas a Curso.
 *
 * Orquestra validações que dependem de acesso ao banco (unicidade de nome,
 * geração do código sequencial) e delega ao `ICursoRepository` a
 * persistência. Invariantes que não dependem de estado externo (ex: tamanho
 * do nome, faixa de períodos) são validadas pela própria entidade `Curso`
 * em `Curso.criar`.
 */
export class CursoService {
  constructor(private readonly cursoRepository: ICursoRepository) {}

  /**
   * Cadastra um novo curso.
   *
   * Gera o código sequencial automaticamente (`'001'`, `'002'`, ...) e
   * garante que não exista outro curso com o mesmo nome.
   *
   * @throws ErroConflito se já existir um curso com o mesmo nome.
   * @throws ErroValidacao se `dto.nome`/`dto.periodos` violarem as
   * invariantes da entidade `Curso`.
   */
  async cadastrar(dto: CursoCadastroDTO): Promise<Curso> {
    const nome = dto.nome.trim();
    const cursoExistente = await this.cursoRepository.buscarPorNome(nome);

    if (cursoExistente) {
      throw new ErroConflito(`Já existe um curso cadastrado com o nome "${nome}".`);
    }

    const ultimoCodigo = await this.cursoRepository.buscarUltimoCodigo();
    const codigo = gerarProximoCodigo(ultimoCodigo);

    const curso = Curso.criar({ codigo, nome: dto.nome, periodos: dto.periodos });
    await this.cursoRepository.cadastrar(curso);

    return curso;
  }

  /** Busca cursos pelos filtros informados (todos opcionais; sem filtros, retorna todos). */
  async buscar(filtros: BuscarCursoFiltros): Promise<Curso[]> {
    return this.cursoRepository.buscar(filtros);
  }

  /**
   * Busca um curso pelo código.
   *
   * @throws ErroNaoEncontrado se não existir curso com o código informado.
   */
  async buscarPorCodigo(codigo: string): Promise<Curso> {
    return garantirExistencia(
      () => this.cursoRepository.buscarPorCodigo(codigo),
      `Curso com código "${codigo}" não encontrado.`,
    );
  }

  /**
   * Edita os dados de um curso existente.
   *
   * @throws ErroNaoEncontrado se o curso não existir.
   * @throws ErroConflito se o novo nome já estiver em uso por outro curso.
   * @throws ErroValidacao se `dto.nome`/`dto.periodos` violarem as
   * invariantes da entidade `Curso`.
   */
  async editar(codigo: string, dto: CursoEdicaoDTO): Promise<Curso> {
    await this.buscarPorCodigo(codigo);

    const nome = dto.nome.trim();
    const cursoComMesmoNome = await this.cursoRepository.buscarPorNome(nome);

    if (cursoComMesmoNome && cursoComMesmoNome.codigo !== codigo) {
      throw new ErroConflito(`Já existe um curso cadastrado com o nome "${nome}".`);
    }

    const cursoAtualizado = Curso.criar({ codigo, nome: dto.nome, periodos: dto.periodos });
    await this.cursoRepository.editar(cursoAtualizado);

    return cursoAtualizado;
  }

  /**
   * Remove um curso pelo código.
   *
   * @throws ErroNaoEncontrado se não existir curso com o código informado.
   */
  async excluir(codigo: string): Promise<void> {
    await this.buscarPorCodigo(codigo);
    await this.cursoRepository.excluir(codigo);
  }
}
