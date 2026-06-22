import bcrypt from 'bcrypt';

import { ValorDominioBase } from '../value-object.base';
import { validarTexto } from '../utils/value-objects.utils';
import { env } from '../../../shared/config';
import { usuarioMensagens } from '../../errors/mensagens/usuario.mensagens';

const SENHA_MIN = 6
const SENHA_MAX = 64

export class Senha extends ValorDominioBase {
    readonly valor: string

    private constructor(senhaEncriptada: string) {
        super()
        this.valor = senhaEncriptada
    }

    static async criar(senhaPlana: string): Promise<Senha> {
        validarTexto(senhaPlana, usuarioMensagens.senhaInvalida(SENHA_MIN, SENHA_MAX), SENHA_MIN, SENHA_MAX)
        const hashGerado = await bcrypt.hash(senhaPlana, env.bcryptSaltRounds)
        return new Senha(hashGerado)
    }

    static fromHash(hash: string): Senha {
        return new Senha(hash)
    }
}
