import { Semestre } from '../entities/semestre/semestre.entity';

export interface ISemestreRepository {
  /** Busca um semestre pelo código (chave primária).
   * @param codigo do semestre, exemplo `2026.1`
   * @return `null` se não existir , caso contrário retorna o `Semestre` encontrado. */
  buscarPorCodigo(codigo: string): Promise<Semestre | null>

  /** Persiste um novo semestre.
   * @param semestre que será cadastrado.*/
  cadastrar(semestre: Semestre): Promise<void>
}
