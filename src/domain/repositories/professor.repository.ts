import { Professor } from '../entities/professor/professor.entity';
import { Usuario } from '../entities/usuario/usuario.entity';

/** Filtros opcionais para a listagem de professores. */
export interface BuscarProfessorFiltros {
  matricula?: string
  /** Filtra pelo e-mail do usuario vinculado. */
  email?: string
  /** Filtra pelo nome do usuario vinculado (parcial, sem distincao de maiusculas). */
  nome?: string
  /** Filtra pelo CPF do usuario vinculado. */
  cpf?: string
  especialidade?: string
  titulacao?: string
}

export interface IProfessorRepository {
  /** Busca professores pelos filtros informados (todos opcionais; sem filtros, retorna todos). */
  buscar(filtros: BuscarProfessorFiltros): Promise<Professor[]>

  /** Busca um professor pela matricula (chave primaria). Retorna `null` se nao existir. */
  buscarPorMatricula(matricula: string): Promise<Professor | null>

  /**
   * Retorna a ultima matricula cadastrada para o ano informado.
   * Usado pelo service para gerar o proximo numero sequencial.
   * Retorna `null` se nenhum professor foi cadastrado no ano.
   */
  buscarUltimaMatriculaDoAno(ano: number): Promise<string | null>

  /**
   * Persiste um novo professor e o seu usuario vinculado em uma unica transacao.
   * Como professor depende de usuario (FK), ambos sao criados atomicamente.
   */
  cadastrar(professor: Professor, usuario: Usuario): Promise<void>

  /** Atualiza os campos proprios do professor (`especialidade`, `titulacao`). */
  atualizar(professor: Professor): Promise<void>

  /**
   * Remove o professor e o seu usuario vinculado em uma unica transacao.
   * A ordem de exclusao (professor antes de usuario) respeita a FK.
   */
  excluir(matricula: string): Promise<void>

  /** Verifica se existe algum lecionamento vinculado ao professor informado. */
  existeLecionamentoVinculado(matricula: string): Promise<boolean>
}
