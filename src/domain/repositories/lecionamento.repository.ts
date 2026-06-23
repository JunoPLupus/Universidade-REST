import { Lecionamento } from '../entities/lecionamento/lecionamento.entity';

export interface BuscarLecionamentoFiltros {
  codigo?: string
  codDisciplina?: string
  matProfessor?: string
  codSemestre?: string
  turno?: string
  diaSemana?: string
}

export interface ILecionamentoRepository {
  /** Busca lecionamentos pelos filtros informados (todos opcionais; sem filtros, retorna todos). */
  buscar(filtros: BuscarLecionamentoFiltros): Promise<Lecionamento[]>

  /** Busca um lecionamento pelo código (chave primária). Retorna `null` se não existir. */
  buscarPorCodigo(codigo: string): Promise<Lecionamento | null>

  /**
   * Retorna o código do último lecionamento cadastrado para o semestre e curso informados.
   * Usado para gerar o próximo código sequencial.
   * Retorna `null` se não houver nenhum lecionamento nesse semestre/curso.
   */
  buscarUltimoCodigoDoSemestreCurso(codSemestre: string, codCurso: string): Promise<string | null>

  /** Persiste um novo lecionamento. */
  cadastrar(lecionamento: Lecionamento): Promise<void>

  /** Atualiza os dados de um lecionamento existente, identificado pelo seu código. */
  editar(lecionamento: Lecionamento): Promise<void>

  /** Remove um lecionamento pelo código. */
  excluir(codigo: string): Promise<void>

  /** Verifica se existe algum lecionamento vinculado à disciplina informada. */
  existePorDisciplina(codDisciplina: string): Promise<boolean>

  /** Verifica se existe algum lecionamento vinculado ao professor informado. */
  existePorProfessor(matProfessor: string): Promise<boolean>
}
