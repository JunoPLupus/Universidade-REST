import { cpf } from 'cpf-cnpj-validator';

import { ValorDominioBase } from '../value-object.base';
import { ErroValidacaoError } from '../../errors/erro-validacao.error';
import { usuarioMensagens } from '../../errors/mensagens/usuario.mensagens';

/**
 * Value Object que representa um CPF validado do domínio.
 *
 * Aceita o CPF com ou sem pontuação (`000.000.000-00` ou `00000000000`) e
 * valida os dígitos verificadores antes de aceitar o valor. O valor
 * armazenado é sempre normalizado para o formato `000.000.000-00`.
 * A instância só existe se o CPF for válido — caso contrário, o construtor
 * lança `ErroValidacaoError`.
 */
export class Cpf extends ValorDominioBase {
    /** Valor já validado e formatado como `000.000.000-00`. */
    readonly valor: string

    /**
     * @param valor - CPF a ser validado, com ou sem pontuação.
     * @throws ErroValidacaoError se o CPF for inválido (formato ou dígitos verificadores).
     */
    constructor(valor: string) {
        if (!cpf.isValid(valor)) throw new ErroValidacaoError(usuarioMensagens.cpfInvalido())
        super()

        this.valor = cpf.format(valor)
    }
}
