import { Usuario } from '../entities/usuario/usuario.entity';
import { Role } from '../entities/usuario/usuario.props';
import { Email } from '../value-objects/email/email.value-object';
import { Cpf } from '../value-objects/cpf/cpf.value-object';
import { Senha } from '../value-objects/senha/senha.value-object';
import { Texto } from '../value-objects/texto/texto.value-object';
import { usuarioMensagens } from '../errors/mensagens/usuario.mensagens';

const NOME_MIN = 5
const NOME_MAX = 60

/**
 * Fábrica da entidade `Usuario`.
 *
 * Recebe os dados "crus" e monta os value objects (`Email`, `Cpf`, `Texto`,
 * `Senha`) que compõem `UsuarioProps`, validando as invariantes do domínio
 * antes de delegar a criação da entidade para `Usuario.criar`.
 *
 * O método é assíncrono pois a criação do VO `Senha` envolve o hash BCrypt.
 *
 * @throws ErroValidacaoError se qualquer campo violar as regras do domínio.
 */
export class UsuarioFactory {
    /**
     * @param dados - Dados crus do usuário a serem validados e transformados em VOs.
     * @returns Promise que resolve com a instância de `Usuario` válida.
     */
    static async criar(dados: Pick<Usuario, 'email' | 'cpf' | 'nome' | 'senha' | 'role'>): Promise<Usuario> {
        return Usuario.criar({
            email: new Email(dados.email),
            cpf: new Cpf(dados.cpf),
            nome: new Texto(dados.nome, usuarioMensagens.nomeInvalido(NOME_MIN, NOME_MAX), NOME_MIN, NOME_MAX),
            senha: await Senha.criar(dados.senha),
            role: dados.role as Role,
        })
    }
}
