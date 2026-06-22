import { Request, Response } from 'express';
import { AuthService } from '../../../domain/services/auth/auth.service';
import { LoginDTO } from '../../../domain/dto/auth/login.dto';
import { Validador } from '../../validation/validador';

/**
 * Controller responsavel pelas rotas HTTP de autenticacao.
 *
 * Unica responsabilidade: traduzir a requisicao HTTP em uma chamada ao
 * `AuthService` e devolver o token JWT gerado. Toda a logica de autenticacao
 * fica no service; erros de dominio sao propagados ao middleware global de
 * erros automaticamente pelo Express 5.
 */
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Autentica um usuario e retorna um JWT.
   *
   * @param req.body.email - E-mail do usuario.
   * @param req.body.senha - Senha em texto plano.
   * @returns 200 com `{ token: string }`.
   * @throws ErroDadosInvalidosError (422) se `email` ou `senha` estiverem ausentes ou sem tipo string.
   * @throws ErroNaoAutenticadoError (401) se as credenciais forem invalidas.
   */
  async login(req: Request, res: Response): Promise<void> {
    Validador.para(req.body).texto('email').texto('senha').validar()

    const dto: LoginDTO = req.body

    const token = await this.authService.login(dto)

    res.status(200).json({ token })
  }
}
