import { Cpf } from '../../value-objects/cpf/cpf.value-object';
import { Email } from '../../value-objects/email/email.value-object';
import { Texto } from '../../value-objects/texto/texto.value-object';

/**
 * Props da entidade `Professor`.
 *
 * Todos os campos já chegam como value objects validados — quem monta esse
 * objeto (a `ProfessorFactory`) é responsável por construir os VOs e, com isso,
 * garantir as invariantes do domínio antes mesmo de a entidade existir.
 *
 * `especialidade` e `titulacao` são opcionais pois podem não ter sido
 * informadas no cadastro.
 */
export type ProfessorProps = {
  matricula: string
  emailUsuario: Email
  nome: Texto
  cpf: Cpf
  especialidade: Texto | null
  titulacao: Titulacao | null
}

/** Titulações acadêmicas aceitas pelo domínio. */
export type Titulacao = keyof typeof TITULACAO

export const TITULACAO = {
  LICENCIADO: 'LICENCIADO',
  ESPECIALISTA: 'ESPECIALISTA',
  MESTRE: 'MESTRE',
  DOUTOR: 'DOUTOR',
} as const
