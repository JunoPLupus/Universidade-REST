import { Professor } from '../../entities/professor/professor.entity';
import { Usuario } from '../../entities/usuario/usuario.entity';
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
import { Email } from '../../value-objects/email/email.value-object';
import { Cpf } from '../../value-objects/cpf/cpf.value-object';
import { Texto } from '../../value-objects/texto/texto.value-object';
import { Senha } from '../../value-objects/senha/senha.value-object';
import { Role } from '../../entities/usuario/usuario.props';

const NOME_MIN = 5
const NOME_MAX = 60

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
   * Valida os formatos de e-mail e CPF antes de consultar o banco,
   * garantindo que erros de formato aparecem antes de erros de unicidade.
   * Gera a matricula sequencial no formato `AnoAtual.000` automaticamente.
   *
   * @param dto - Dados do professor e do usuario vinculado.
   * @returns A entidade `Professor` criada.
   * @throws ErroValidacaoError se e-mail ou CPF tiverem formato invalido.
   * @throws ErroConflitoError se o e-mail ou o CPF ja estiverem em uso.
   */
  async cadastrar(dto: ProfessorCadastroDTO): Promise<Professor> {
    new Email(dto.email)
    new Cpf(dto.cpf)

    const emailEmUso = await this.usuarioRepository.existePorEmail(dto.email)
    if (emailEmUso) throw new ErroConflitoError(usuarioMensagens.emailJaEmUso())

    const cpfEmUso = await this.usuarioRepository.existePorCpf(dto.cpf)
    if (cpfEmUso) throw new ErroConflitoError(usuarioMensagens.cpfJaEmUso())

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
   * Campos editaveis: `nome`, `especialidade`, `titulacao` e `senha`.
   * Matricula, e-mail, CPF e role sao imutaveis apos o cadastro.
   *
   * Quando `senha` e informada, o usuario vinculado e recriado via
   * `UsuarioFactory.criar` para que a nova senha seja hasheada.
   * Quando apenas `nome` muda (sem nova senha), o usuario e atualizado
   * via `Usuario.criar` com `Senha.fromHash` para evitar duplo hash.
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

    const novoNome = dto.nome ?? existente.nome

    if (dto.senha || dto.nome) {
      const usuarioAtual = await this.usuarioRepository.buscarPorEmail(existente.emailUsuario)
      if (usuarioAtual) {
        let usuarioAtualizado: Usuario

        if (dto.senha) {
          // Nova senha informada: recria via factory para hashear a senha
          usuarioAtualizado = await UsuarioFactory.criar({
            email: usuarioAtual.email,
            cpf: usuarioAtual.cpf,
            nome: novoNome,
            senha: dto.senha,
            role: usuarioAtual.role,
          })
        } else {
          // Apenas nome alterado: preserva o hash atual sem re-hashear
          usuarioAtualizado = Usuario.criar({
            email: new Email(usuarioAtual.email),
            cpf: new Cpf(usuarioAtual.cpf),
            nome: new Texto(novoNome, usuarioMensagens.nomeInvalido(NOME_MIN, NOME_MAX), NOME_MIN, NOME_MAX),
            senha: Senha.fromHash(usuarioAtual.senha),
            role: usuarioAtual.role as Role,
          })
        }

        await this.usuarioRepository.atualizar(usuarioAtualizado)
      }
    }

    const professorAtualizado = ProfessorFactory.criar({
      matricula,
      emailUsuario: existente.emailUsuario,
      nome: novoNome,
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
