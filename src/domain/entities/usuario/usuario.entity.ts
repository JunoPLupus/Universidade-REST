import { UsuarioProps } from './usuario.props';

/**
 * Entidade Usuario.
 *
 * O construtor é privado: a única forma de obter uma instância é via
 * `Usuario.criar`, e a única forma de montar `UsuarioProps` válidas é via
 * `UsuarioFactory`. Assim, nenhuma instância de `Usuario` pode existir em
 * estado inválido.
 */
export class Usuario {
    private constructor(private readonly props: UsuarioProps) {}

    /**
     * Cria uma instância de `Usuario` a partir de props já validadas.
     * Deve ser chamado exclusivamente pela `UsuarioFactory`.
     *
     * @param props - Props com todos os value objects já construídos e validados.
     */
    static criar(props: UsuarioProps): Usuario {
        return new Usuario(props)
    }

    /** E-mail do usuário (chave primária). */
    get email(): string { return this.props.email.valor }

    /** CPF formatado como `000.000.000-00`. */
    get cpf(): string { return this.props.cpf.valor }

    /** Nome completo do usuário. */
    get nome(): string { return this.props.nome.valor }

    /** Hash BCrypt da senha. */
    get senha(): string { return this.props.senha.valor }

    /** Papel do usuário no sistema (`ADMIN` | `PROFESSOR`). */
    get role(): string { return this.props.role.toString() }
}
