import { Texto } from '../../value-objects/texto/texto.value-object';
import { Email } from '../../value-objects/email/email.value-object';
import { Cpf } from '../../value-objects/cpf/cpf.value-object';
import { Senha } from '../../value-objects/senha/senha.value-object';

/**
 * Props da entidade `Usuario`.
 *
 * Todos os campos já chegam como value objects validados — quem monta esse
 * objeto (a `UsuarioFactory`) é responsável por construir os VOs e, com isso,
 * garantir as invariantes do domínio antes mesmo de a entidade existir.
 */
export type UsuarioProps = {
    email: Email
    cpf: Cpf
    nome: Texto
    senha: Senha
    role: Role
}

export type Role = keyof typeof ROLE

const ROLE = {
    ADMIN: 'ADMIN',
    PROFESSOR: 'PROFESSOR',
}
