import { Usuario } from '../entities/usuario/usuario.entity';

/**
 * Contrato do repositorio de `Usuario`.
 *
 * Expoe apenas as operacoes que o dominio precisa — auth e suporte ao CRUD
 * de Professor (que cria/atualiza/remove o usuario associado em conjunto).
 */
export interface IUsuarioRepository {
  /**
   * Busca um usuario pelo e-mail (chave primaria).
   * Retorna `null` se nao existir.
   */
  buscarPorEmail(email: string): Promise<Usuario | null>

  /**
   * Busca um usuario pelo CPF.
   * Usado para validar unicidade antes de cadastrar um novo professor.
   * Retorna `null` se nao existir.
   */
  buscarPorCpf(cpf: string): Promise<Usuario | null>

  /**
   * Verifica se ja existe um usuario com o e-mail informado.
   * Nao reconstitui a entidade de dominio — retorna apenas `boolean`.
   */
  existePorEmail(email: string): Promise<boolean>

  /**
   * Verifica se ja existe um usuario com o CPF informado.
   * Nao reconstitui a entidade de dominio — retorna apenas `boolean`.
   */
  existePorCpf(cpf: string): Promise<boolean>

  /** Persiste um novo usuario. */
  cadastrar(usuario: Usuario): Promise<void>

  /** Atualiza os dados de um usuario existente, identificado pelo seu e-mail. */
  atualizar(usuario: Usuario): Promise<void>

  /**
   * Remove um usuario pelo e-mail.
   * Usado em conjunto com a exclusao do professor associado.
   */
  excluir(email: string): Promise<void>
}
