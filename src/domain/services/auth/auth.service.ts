import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { IUsuarioRepository } from '../../repositories/usuario.repository';
import { ErroNaoAutenticadoError } from '../../errors/erro-nao-autenticado.error';
import { authMensagens } from '../../errors/mensagens/auth.mensagens';
import { env } from '../../../shared/config';
import { LoginDTO } from '../../dto/auth/login.dto';

/**
 * Service responsavel pela autenticacao de usuarios.
 *
 * Unica responsabilidade: validar credenciais e emitir um JWT assinado.
 * Nao conhece detalhes de sessao, cookies ou transporte HTTP.
 */
export class AuthService {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  /**
   * Autentica um usuario pelas credenciais informadas e retorna um JWT assinado.
   *
   * Intencionalmente lanca a mesma mensagem generica tanto para e-mail
   * inexistente quanto para senha incorreta, prevenindo enumeracao de usuarios.
   *
   * @param dto - Credenciais de login (`email` e `senha` em texto plano).
   * @returns Token JWT com payload `{ sub: email, role }`.
   * @throws ErroNaoAutenticadoError se o e-mail nao existir ou a senha nao conferir.
   */
  async login(dto: LoginDTO): Promise<string> {
    const usuario = await this.usuarioRepository.buscarPorEmail(dto.email)
    if (!usuario) throw new ErroNaoAutenticadoError(authMensagens.credenciaisInvalidas())

    const senhaCorreta = await bcrypt.compare(dto.senha, usuario.senha)

    if (!senhaCorreta) throw new ErroNaoAutenticadoError(authMensagens.credenciaisInvalidas())

    const options: jwt.SignOptions = { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] }

    return jwt.sign({ sub: usuario.email, role: usuario.role }, env.jwtSecret, options)
  }
}
