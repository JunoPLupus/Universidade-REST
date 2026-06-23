import validator from 'validator';

import { ValorDominioBase } from '../value-object.base';
import { ErroValidacaoError } from '../../errors/erro-validacao.error';
import { usuarioMensagens } from '../../errors/mensagens/usuario.mensagens';

/**
 * Value Object que representa um endereço de e-mail validado do domínio.
 *
 * Verifica o formato RFC do e-mail via `validator.isEmail` antes de aceitar
 * o valor. A instância só existe se o e-mail for válido — caso contrário, o
 * construtor lança `ErroValidacaoError`.
 */
export class Email extends ValorDominioBase {
    /** Valor já validado. */
    readonly valor: string

    /**
     * @param valor - Endereço de e-mail a ser validado.
     * @throws ErroValidacaoError se o valor não for um e-mail com formato válido.
     */
    constructor(valor: string) {
        if (!validator.isEmail(valor)) throw new ErroValidacaoError(usuarioMensagens.emailInvalido(valor))
        super()

        this.valor = valor
    }
}
