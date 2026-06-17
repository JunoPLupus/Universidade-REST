import { Curso } from '../entities/curso/curso.entity';

export interface BuscarCursoFiltros {
  nome?: string;
  codigo?: string;
}

export interface ICursoRepository {
  /** Busca cursos pelos filtros informados (todos opcionais; sem filtros, retorna todos). */
  buscar(filtros: BuscarCursoFiltros): Promise<Curso[]>;

  /** Busca um curso pelo código (chave primária). Retorna `null` se não existir. */
  buscarPorCodigo(codigo: string): Promise<Curso | null>;

  /** Busca um curso pelo nome exato. Usado para validar unicidade antes de cadastrar. */
  buscarPorNome(nome: string): Promise<Curso | null>;

  /** Retorna o código do último curso cadastrado, usado para gerar o próximo código sequencial. */
  buscarUltimoCodigo(): Promise<string | null>;

  /** Persiste um novo curso. */
  cadastrar(curso: Curso): Promise<void>;

  /** Atualiza os dados de um curso existente, identificado pelo seu código. */
  editar(curso: Curso): Promise<void>;

  /** Remove um curso pelo código. */
  excluir(codigo: string): Promise<void>;
}
