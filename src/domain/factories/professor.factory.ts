import { Professor } from '../entities/professor/professor.entity';
import { TITULACAO, Titulacao } from '../entities/professor/professor.props';
import { Email } from '../value-objects/email/email.value-object';
import { Cpf } from '../value-objects/cpf/cpf.value-object';
import { Texto } from '../value-objects/texto/texto.value-object';
import { ErroValidacaoError } from '../errors/erro-validacao.error';
import { professorMensagens } from '../errors/mensagens/professor.mensagens';
import { usuarioMensagens } from '../errors/mensagens/usuario.mensagens';

const NOME_MIN = 5
const NOME_MAX = 60
const ESPECIALIDADE_MIN = 3
const ESPECIALIDADE_MAX = 100

/**
 * Dados crus necessarios para criar um `Professor`.
 *
 * `especialidade` e `titulacao` sao opcionais — podem ser informados
 * posteriormente via edicao.
 */
type ProfessorDados = {
  matricula: string
  emailUsuario: string
  nome: string
  cpf: string
  especialidade?: string | null
  titulacao?: string | null
}

/**
 * Fabrica da entidade `Professor`.
 *
 * Recebe os dados "crus" e monta os value objects (`Email`, `Cpf`, `Texto`)
 * que compoem `ProfessorProps`, validando as invariantes do dominio antes de
 * delegar a criacao da entidade para `Professor.criar`.
 *
 * @throws ErroValidacaoError se qualquer campo violar as regras do dominio.
 */
export class ProfessorFactory {
  /**
   * @param dados - Dados crus do professor a serem validados e transformados em VOs.
   * @returns Instancia de `Professor` valida.
   */
  static criar(dados: ProfessorDados): Professor {
    const titulacao = ProfessorFactory.validarTitulacao(dados.titulacao)

    return Professor.criar({
      matricula: dados.matricula,
      emailUsuario: new Email(dados.emailUsuario),
      nome: new Texto(dados.nome, usuarioMensagens.nomeInvalido(NOME_MIN, NOME_MAX), NOME_MIN, NOME_MAX),
      cpf: new Cpf(dados.cpf),
      especialidade: dados.especialidade
        ? new Texto(dados.especialidade, professorMensagens.especialidadeInvalida(ESPECIALIDADE_MIN, ESPECIALIDADE_MAX), ESPECIALIDADE_MIN, ESPECIALIDADE_MAX)
        : null,
      titulacao,
    })
  }

  private static validarTitulacao(valor?: string | null): Titulacao | null {
    if (!valor) return null
    const titulacoes = Object.keys(TITULACAO) as Titulacao[]
    if (!titulacoes.includes(valor as Titulacao)) {
      throw new ErroValidacaoError(professorMensagens.titulacaoInvalida())
    }
    return valor as Titulacao
  }
}
