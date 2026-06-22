import { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { UsuarioMother } from '../../../../tests/test-helpers/usuario.mother';
import { ErroDadosInvalidosError } from '../../../domain/errors/erro-dados-invalidos.error';

describe('Auth Controller - Testes unitarios', () => {
  let authService: ReturnType<typeof UsuarioMother.criarAuthServiceMock>
  let controller: AuthController
  let res: Response

  beforeEach(() => {
    authService = UsuarioMother.criarAuthServiceMock()
    controller = new AuthController(authService)
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response
  })

  describe('login', () => {
    it('deve retornar 200 com o token JWT', async () => {
      // Arrange
      const token = 'jwt.token.aqui'
      authService.login.mockResolvedValue(token)
      const req = { body: { email: 'prof@uni.edu', senha: 'Senha@123' } } as unknown as Request
      // Act
      await controller.login(req, res)
      // Assert
      expect(authService.login).toHaveBeenCalledWith({ email: 'prof@uni.edu', senha: 'Senha@123' })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ token })
    })

    it('lanca ErroDadosInvalidosError quando "email" esta ausente', async () => {
      // Arrange
      const req = { body: { senha: 'Senha@123' } } as unknown as Request
      // Act & Assert
      await expect(controller.login(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(authService.login).not.toHaveBeenCalled()
    })

    it('lanca ErroDadosInvalidosError quando "senha" esta ausente', async () => {
      // Arrange
      const req = { body: { email: 'prof@uni.edu' } } as unknown as Request
      // Act & Assert
      await expect(controller.login(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(authService.login).not.toHaveBeenCalled()
    })

    it('lanca ErroDadosInvalidosError quando "email" nao e uma string', async () => {
      // Arrange
      const req = { body: { email: 123, senha: 'Senha@123' } } as unknown as Request
      // Act & Assert
      await expect(controller.login(req, res)).rejects.toThrow(ErroDadosInvalidosError)
      expect(authService.login).not.toHaveBeenCalled()
    })
  })
})
