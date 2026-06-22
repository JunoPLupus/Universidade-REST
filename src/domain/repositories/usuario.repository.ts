import { Usuario } from '../entities/usuario/usuario.entity';

/**
 * Contrato do repositório de `Usuario`.
 *
 * Expõe apenas as operações que o domínio precisa — auth e suporte ao CRUD
 * de Professor (que cria/atualiza/remove o usuário associado em conjunto).
 */
export interface IUsuarioRepository {
  /**
   * Busca um usuário pelo e-mail (chave primária).
   * Retorna `null` se não existir.
   */
  buscarPorEmail(email: string): Promise<Usuario | null>

  /**
   * Busca um usuário pelo CPF.
   * Usado para validar unicidade antes de cadastrar um novo professor.
   * Retorna `null` se não existir.
   */
  buscarPorCpf(cpf: string): Promise<Usuario | null>

  /** Persiste um novo usuário. */
  cadastrar(usuario: Usuario): Promise<void>

  /** Atualiza os dados de um usuário existente, identificado pelo seu e-mail. */
  atualizar(usuario: Usuario): Promise<void>

  /**
   * Remove um usuário pelo e-mail.
   * Usado em conjunto com a exclusão do professor associado.
   */
  excluir(email: string): Promise<void>
}
