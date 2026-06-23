import { Disciplina } from '../entities/disciplina/disciplina.entity';

export interface BuscarDisciplinaFiltros {
  nome?: string
  codCurso?: string
  codigo?: string
  cargaHoraria?: number
  periodo?: number
}

export interface IDisciplinaRepository {
  /** Busca disciplinas pelos filtros informados (todos opcionais; sem filtros, retorna todas). */
  buscar(filtros: BuscarDisciplinaFiltros): Promise<Disciplina[]>

  /** Busca uma disciplina pelo codigo (chave primaria). Retorna `null` se nao existir. */
  buscarPorCodigo(codigo: string): Promise<Disciplina | null>

  /** Busca uma disciplina pelo nome dentro de um curso. Usado para validar unicidade antes de cadastrar. */
  buscarPorNomeECurso(nome: string, codCurso: string): Promise<Disciplina | null>

  /** Retorna o codigo da ultima disciplina cadastrada no curso informado, usado para gerar o proximo codigo sequencial. */
  buscarUltimoCodigoDoCurso(codCurso: string): Promise<string | null>

  /** Persiste uma nova disciplina. */
  cadastrar(disciplina: Disciplina): Promise<void>

  /** Atualiza os dados de uma disciplina existente, identificada pelo seu codigo. */
  editar(disciplina: Disciplina): Promise<void>

  /** Remove uma disciplina pelo codigo. */
  excluir(codigo: string): Promise<void>

  /** Remove todas as disciplinas vinculadas ao curso informado. */
  excluirPorCurso(codCurso: string): Promise<void>

  /** Verifica se existe algum lecionamento vinculado a disciplina informada. */
  existeLecionamentoVinculado(codigo: string): Promise<boolean>
}
