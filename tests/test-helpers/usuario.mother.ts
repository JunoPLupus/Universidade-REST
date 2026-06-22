import { Usuario } from '../../src/domain/entities/usuario/usuario.entity';
import { IUsuarioRepository } from '../../src/domain/repositories/usuario.repository';
import { AuthService } from '../../src/domain/services/auth/auth.service';
import { Email } from '../../src/domain/value-objects/email/email.value-object';
import { Cpf } from '../../src/domain/value-objects/cpf/cpf.value-object';
import { Texto } from '../../src/domain/value-objects/texto/texto.value-object';
import { Senha } from '../../src/domain/value-objects/senha/senha.value-object';
import { usuarioMensagens } from '../../src/domain/errors/mensagens/usuario.mensagens';

const NOME_MIN = 5
const NOME_MAX = 60

type UsuarioRawProps = {
  email: string
  cpf: string
  nome: string
  senhaHash: string
  role: 'ADMIN' | 'PROFESSOR'
}

/**
 * Object Mother para a entidade Usuario.
 *
 * Centraliza a criação de dados válidos de Usuario para os testes,
 * permitindo sobrescrever apenas os campos relevantes para cada cenário.
 * Usa `Usuario.criar` diretamente com `Senha.fromHash` para evitar o hash
 * assíncrono do BCrypt nos testes unitários.
 */
export class UsuarioMother {
  /**
   * @returns Um conjunto de props válidas, com possibilidade de sobrescrita.
   */
  static props(override: Partial<UsuarioRawProps> = {}): UsuarioRawProps {
    return {
      email: 'professor@universidade.edu.br',
      cpf: '529.982.247-25',
      nome: 'João Silva',
      senhaHash: '$2b$10$hashMockadoParaTestes',
      role: 'PROFESSOR',
      ...override,
    }
  }

  /**
   * @returns Uma instância de Usuario válida, com possibilidade de sobrescrita.
   */
  static criar(override: Partial<UsuarioRawProps> = {}): Usuario {
    const p = this.props(override)

    return Usuario.criar({
      email: new Email(p.email),
      cpf: new Cpf(p.cpf),
      nome: new Texto(p.nome, usuarioMensagens.nomeInvalido(NOME_MIN, NOME_MAX), NOME_MIN, NOME_MAX),
      senha: Senha.fromHash(p.senhaHash),
      role: p.role,
    })
  }

  /**
   * @returns Um mock de IUsuarioRepository.
   */
  static criarRepositoryMock(): jest.Mocked<IUsuarioRepository> {
    return {
      buscarPorEmail: jest.fn(),
      buscarPorCpf: jest.fn(),
      cadastrar: jest.fn(),
      atualizar: jest.fn(),
      excluir: jest.fn(),
    } as unknown as jest.Mocked<IUsuarioRepository>
  }

  /**
   * @returns Um mock de AuthService.
   */
  static criarAuthServiceMock(): jest.Mocked<AuthService> {
    return {
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthService>
  }
}
