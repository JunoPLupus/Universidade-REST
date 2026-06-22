import { AuthService } from './auth.service';
import { IUsuarioRepository } from '../../repositories/usuario.repository';
import { UsuarioMother } from '../../../../tests/test-helpers/usuario.mother';
import { ErroNaoAutenticadoError } from '../../errors/erro-nao-autenticado.error';
import { LoginDTO } from '../../dto/auth/login.dto';

jest.mock('bcrypt', () => ({ compare: jest.fn() }))
jest.mock('jsonwebtoken', () => ({ sign: jest.fn().mockReturnValue('token.jwt.mockado') }))
jest.mock('../../../shared/config', () => ({ env: { jwtSecret: 'segredo-teste', jwtExpiresIn: '1d' } }))

import bcrypt from 'bcrypt';
import {Usuario} from "../../entities/usuario/usuario.entity";

describe('Auth Service - Testes unitarios', () => {
  let usuarioRepository: jest.Mocked<IUsuarioRepository>
  let service: AuthService
  let usuario: Usuario

  beforeEach(() => {
    usuarioRepository = UsuarioMother.criarRepositoryMock()
    service = new AuthService(usuarioRepository)

    usuario = UsuarioMother.criar()
  })

  describe('login', () => {
    it('retorna um token JWT quando as credenciais sao validas', async () => {
      const dto: LoginDTO = { email: usuario.email, senha: 'senha123' }
      usuarioRepository.buscarPorEmail.mockResolvedValue(usuario)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const token = await service.login(dto)

      expect(token).toBe('token.jwt.mockado')
      expect(usuarioRepository.buscarPorEmail).toHaveBeenCalledWith(dto.email)
    })

    it('lanca ErroNaoAutenticadoError quando o email nao existe', async () => {
      const dto: LoginDTO = { email: 'inexistente@email.com', senha: 'senha123' }
      usuarioRepository.buscarPorEmail.mockResolvedValue(null)

      await expect(service.login(dto)).rejects.toThrow(ErroNaoAutenticadoError)
      expect(bcrypt.compare).not.toHaveBeenCalled()
    })

    it('lanca ErroNaoAutenticadoError quando a senha esta incorreta', async () => {
      const dto: LoginDTO = { email: usuario.email, senha: 'senhaErrada' }
      usuarioRepository.buscarPorEmail.mockResolvedValue(usuario)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(service.login(dto)).rejects.toThrow(ErroNaoAutenticadoError)
    })

    it('retorna a mesma mensagem de erro para email invalido e para senha incorreta', async () => {
      usuarioRepository.buscarPorEmail
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(usuario)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      let mensagemA = ''
      let mensagemB = ''

      await service.login({ email: 'nao@existe.com', senha: 'qualquer' }).catch((e: unknown) => {
        if (e instanceof ErroNaoAutenticadoError) mensagemA = e.message
      })
      await service.login({ email: usuario.email, senha: 'senhaErrada' }).catch((e: unknown) => {
        if (e instanceof ErroNaoAutenticadoError) mensagemB = e.message
      })

      expect(mensagemA).toBe(mensagemB)
      expect(mensagemA).not.toBe('')
    })
  })
})
