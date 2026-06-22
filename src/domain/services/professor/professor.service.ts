import { Professor } from '../../entities/professor/professor.entity';
import { ProfessorFactory } from '../../factories/professor.factory';
import { UsuarioFactory } from '../../factories/usuario.factory';
import { ProfessorCadastroDTO } from '../../dto/professor/professor-cadastro.dto';
import { ProfessorEdicaoDTO } from '../../dto/professor/professor-edicao.dto';
import { BuscarProfessorFiltros, IProfessorRepository } from '../../repositories/professor.repository';
import { IUsuarioRepository } from '../../repositories/usuario.repository';
import { professorMensagens } from '../../errors/mensagens/professor.mensagens';
import { usuarioMensagens } from '../../errors/mensagens/usuario.mensagens';
import { ErroConflitoError } from '../../errors/erro-conflito.error';
import { garantirExistencia } from '../utils/garantir-existencia.util';
import { gerarProximoCodigo } from '../utils/gerar-proximo-codigo.util';

/**
 * Service responsavel pelas regras de negocio relacionadas a Professor.
 *
 * Orquestra a criacao atomica de `Usuario` + `Professor` no cadastro,
 * a geracao automatica da matricula no formato `AnoAtual.000` e as
 * validacoes de unicidade (e-mail e CPF) que dependem de acesso ao banco.
 * Invariantes que nao dependem de estado externo sao validadas pelas
 * proprias entidades e value objects.
 */
export class ProfessorService {
  constructor(
    private readonly professorRepository: IProfessorRepository,
    private readonly usuarioRepository: IUsuarioRepository,
  ) {}

  /**
   * Cadastra um novo professor e o usuario vinculado.
   *
   * Gera a matricula sequencial no formato `AnoAtual.000` automaticamente.
   * Cria os registros de `usuario` e `professor` em uma unica transacao.
   *
   * @param dto - Dados do professor e do usuario vinculado.
   * @returns A entidade `Professor` criada.
   * @throws ErroConflitoError se o e-mail ou o CPF ja estiverem em uso.
   * @throws ErroValidacaoError se qualquer campo violar as invariantes do dominio.
   */
  async cadastrar(dto: ProfessorCadastroDTO): Promise<Professor> {
    const emailEmUso = await this.usuarioRepository.buscarPorEmail(dto.email)
    if (emailEmUso) throw new ErroConflitoError(usuarioMensagens.emailInvalido(dto.email))

    const cpfEmUso = await this.usuarioRepository.buscarPorCpf(dto.cpf)
    if (cpfEmUso) throw new ErroConflitoError(usuarioMensagens.cpfInvalido())

    const anoAtual = new Date().getFullYear()
    const ultimaMatricula = await this.professorRepository.buscarUltimaMatriculaDoAno(anoAtual)
    const matricula = gerarProximoCodigo(ultimaMatricula, `${anoAtual}.`)

    const usuario = await UsuarioFactory.criar({
      email: dto.email,
      cpf: dto.cpf,
      nome: dto.nome,
      senha: dto.senha,
      role: 'PROFESSOR',
    })

    const professor = ProfessorFactory.criar({
      matricula,
      emailUsuario: dto.email,
      nome: dto.nome,
      cpf: dto.cpf,
      especialidade: dto.especialidade,
      titulacao: dto.titulacao,
    })

    await this.professorRepository.cadastrar(professor, usuario)

    return professor
  }

  /**
   * Busca professores pelos filtros informados (todos opcionais; sem filtros, retorna todos).
   *
   * @param filtros - Campos opcionais para filtrar a listagem.
   */
  async buscar(filtros: BuscarProfessorFiltros): Promise<Professor[]> {
    return this.professorRepository.buscar(filtros)
  }

  /**
   * Busca um professor pela matricula.
   *
   * @param matricula - Matricula do professor (chave primaria).
   * @throws ErroNaoEncontradoError se nao existir professor com a matricula informada.
   */
  async buscarPorMatricula(matricula: string): Promise<Professor> {
    return garantirExistencia(
      () => this.professorRepository.buscarPorMatricula(matricula),
      professorMensagens.naoEncontrado(matricula),
    )
  }

  /**
   * Atualiza os dados de um professor existente.
   *
   * Atualiza `especialidade` e `titulacao` na tabela `professor`. Se
   * `senha` for informada, atualiza tambem o usuario vinculado na
   * tabela `usuario`. E-mail e CPF sao imutaveis apos o cadastro.
   * Campos nao informados mantem o valor atual.
   *
   * @param matricula - Matricula do professor a ser atualizado.
   * @param dto - Campos a atualizar.
   * @returns A entidade `Professor` atualizada.
   * @throws ErroNaoEncontradoError se o professor nao existir.
   * @throws ErroValidacaoError se os novos valores violarem as invariantes do dominio.
   */
  async atualizar(matricula: string, dto: ProfessorEdicaoDTO): Promise<Professor> {
    const existente = await this.buscarPorMatricula(matricula)

    if (dto.senha) {
      const usuarioAtual = await this.usuarioRepository.buscarPorEmail(existente.emailUsuario)
      if (usuarioAtual) {
        const usuarioAtualizado = await UsuarioFactory.criar({
          email: usuarioAtual.email,
          cpf: usuarioAtual.cpf,
          nome: usuarioAtual.nome,
          senha: dto.senha,
          role: usuarioAtual.role,
        })
        await this.usuarioRepository.atualizar(usuarioAtualizado)
      }
    }

    const professorAtualizado = ProfessorFactory.criar({
      matricula,
      emailUsuario: existente.emailUsuario,
      nome: existente.nome,
      cpf: existente.cpf,
      especialidade: dto.especialidade ?? existente.especialidade,
      titulacao: dto.titulacao ?? existente.titulacao,
    })

    await this.professorRepository.atualizar(professorAtualizado)

    return professorAtualizado
  }

  /**
   * Remove um professor e o usuario vinculado.
   *
   * A exclusao de ambos os registros (`professor` e `usuario`) e feita
   * atomicamente pelo repositorio em uma unica transacao.
   *
   * @param matricula - Matricula do professor a ser removido.
   * @throws ErroNaoEncontradoError se o professor nao existir.
   */
  async excluir(matricula: string): Promise<void> {
    await this.buscarPorMatricula(matricula)
    await this.professorRepository.excluir(matricula)
  }
}
