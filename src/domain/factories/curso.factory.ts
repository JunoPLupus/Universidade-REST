import { Curso } from '../entities/curso/curso.entity';
import { Texto } from '../value-objects/texto/texto.value-object';
import { Numero } from '../value-objects/numero/numero.value-object';
import { cursoMensagens } from '../errors/mensagens/curso.mensagens';

const NOME_MIN = 5
const NOME_MAX = 100
const PERIODOS_MIN = 3
const PERIODOS_MAX = 12

/**
 * Fábrica da entidade `Curso`.
 *
 * Recebe os dados "crus" (`codigo`, `nome`, `periodos`) e monta os value
 * objects (`Texto`, `Numero`) que compõem `CursoProps`, validando as
 * invariantes do domínio antes de delegar a criação da entidade para
 * `Curso.criarCurso`.
 *
 * @throws ErroValidacaoError se `nome` não tiver entre 5 e 100 caracteres,
 * ou se `periodos` não estiver entre 3 e 12.
 */
export class CursoFactory {
  static criar(dados: Pick<Curso, 'codigo' | 'nome' | 'periodos'>): Curso {
    return Curso.criarCurso({
      codigo: dados.codigo,
      nome: new Texto(dados.nome, cursoMensagens.nomeInvalido(NOME_MIN, NOME_MAX), NOME_MIN, NOME_MAX),
      periodos: new Numero(dados.periodos, cursoMensagens.periodosInvalido(PERIODOS_MIN, PERIODOS_MAX), PERIODOS_MIN, PERIODOS_MAX),
    })
  }
}
