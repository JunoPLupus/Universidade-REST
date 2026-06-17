import { Curso } from "../../entities/curso/curso.entity";
import { CursoCadastroDTO } from "../../dto/curso/curso-cadastro.dto";
import { CursoEdicaoDTO } from "../../dto/curso/curso-edicao.dto";
import { CursoFactory } from "../../factories/curso.factory";
import { BuscarCursoFiltros, ICursoRepository } from "../../repositories/curso.repository";
import { cursoMensagens } from "../../errors/mensagens/curso.mensagens";
import { Disciplina } from "../../entities/disciplina/disciplina.entity";
import { IDisciplinaRepository } from "../../repositories/disciplina.repository";
import { gerarProximoCodigo } from "../utils/gerar-proximo-codigo.util";
import { garantirExistencia } from "../utils/garantir-existencia.util";
import { ErroConflitoError } from "../../errors/erro-conflito.error";

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
    constructor(
        private readonly cursoRepository: ICursoRepository,
        private readonly disciplinaRepository: IDisciplinaRepository,
    ) {
    }

    /**
     * Cadastra um novo curso.
     *
     * Gera o código sequencial automaticamente (`'001'`, `'002'`, ...) e
     * garante que não exista outro curso com o mesmo nome.
     *
     * @throws ErroConflitoError se já existir um curso com o mesmo nome.
     * @throws ErroValidacao se `dto.nome`/`dto.periodos` violarem as
     * invariantes da entidade `Curso`.
     */
    async cadastrar(dto: CursoCadastroDTO): Promise<Curso> {
        const nome = dto.nome.trim()
        const cursoExistente = await this.cursoRepository.buscarPorNome(nome)

        if (cursoExistente) {
            throw new ErroConflitoError(cursoMensagens.nomeDuplicado(nome))
        }

        const ultimoCodigo = await this.cursoRepository.buscarUltimoCodigo()
        const codigo = gerarProximoCodigo(ultimoCodigo)

        const curso: Curso = CursoFactory.criar({codigo, nome: dto.nome, periodos: dto.periodos})
        await this.cursoRepository.cadastrar(curso)

        return curso
    }

    /** Busca cursos pelos filtros informados (todos opcionais; sem filtros, retorna todos). */
    async buscar(filtros: BuscarCursoFiltros): Promise<Curso[]> {
        return this.cursoRepository.buscar(filtros)
    }

    /**
     * Busca um curso pelo código.
     *
     * @throws ErroNaoEncontrado se não existir curso com o código informado.
     */
    async buscarPorCodigo(codigo: string): Promise<Curso> {
        return garantirExistencia(
            () => this.cursoRepository.buscarPorCodigo(codigo),
            cursoMensagens.naoEncontrado(codigo),
        )
    }

    /**
     * Edita os dados de um curso existente.
     *
     * Campos não informados em `dto` mantêm o valor atual do curso.
     *
     * @throws ErroNaoEncontrado se o curso não existir.
     * @throws ErroConflitoError se o novo nome já estiver em uso por outro curso.
     * @throws ErroValidacao se `dto.nome`/`dto.periodos` violarem as
     * invariantes da entidade `Curso`.
     */
    async editar(codigo: string, dto: CursoEdicaoDTO): Promise<Curso> {
        const cursoExistente = await this.buscarPorCodigo(codigo)

        const nome = (dto.nome ?? cursoExistente.nome).trim()
        const periodos = dto.periodos ?? cursoExistente.periodos

        const cursoComMesmoNome = await this.cursoRepository.buscarPorNome(nome)

        if (cursoComMesmoNome && cursoComMesmoNome.codigo !== codigo) {
            throw new ErroConflitoError(cursoMensagens.nomeDuplicado(nome))
        }

        const cursoAtualizado: Curso = CursoFactory.criar({codigo, nome, periodos})
        await this.cursoRepository.editar(cursoAtualizado)

        return cursoAtualizado
    }

    /**
     * Remove um curso pelo código.
     *
     * @throws ErroNaoEncontrado se não existir curso com o código informado.
     * @throws ErroConflitoError se existirem disciplinas vinculadas ao curso.
     */
    async excluir(codigo: string): Promise<void> {
        await this.buscarPorCodigo(codigo)

        const disciplinasVinculadas: Disciplina[] = await this.disciplinaRepository.buscar({codCurso: codigo})

        if (disciplinasVinculadas.length > 0) {
            throw new ErroConflitoError(cursoMensagens.possuiDisciplinasVinculadas())
        }

        await this.cursoRepository.excluir(codigo)
    }
}