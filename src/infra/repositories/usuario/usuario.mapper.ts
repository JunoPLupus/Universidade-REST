import { Usuario as UsuarioModel } from '@prisma/client';
import { Usuario } from '../../../domain/entities/usuario/usuario.entity';
import { Email } from '../../../domain/value-objects/email/email.value-object';
import { Cpf } from '../../../domain/value-objects/cpf/cpf.value-object';
import { Texto } from '../../../domain/value-objects/texto/texto.value-object';
import { Senha } from '../../../domain/value-objects/senha/senha.value-object';
import { Role } from '../../../domain/entities/usuario/usuario.props';
import { usuarioMensagens } from '../../../domain/errors/mensagens/usuario.mensagens';

const NOME_MIN = 5
const NOME_MAX = 60

/**
 * Converte entre o registro do Prisma (tabela `usuario`) e a entidade de
 * dominio `Usuario`.
 *
 * Usa `Usuario.criar` diretamente (nao a factory) para evitar operacoes
 * assincronas no mapper — a senha ja vem como hash do banco e e reconstituida
 * via `Senha.fromHash`.
 */
export class UsuarioMapper {
  /** Reconstitui a entidade de dominio a partir de um registro do banco. */
  static toDomain(raw: UsuarioModel): Usuario {
    return Usuario.criar({
      email: new Email(raw.email),
      cpf: new Cpf(raw.cpf),
      nome: new Texto(raw.nome, usuarioMensagens.nomeInvalido(NOME_MIN, NOME_MAX), NOME_MIN, NOME_MAX),
      senha: Senha.fromHash(raw.senha),
      role: raw.role as Role,
    })
  }

  /** Converte a entidade de dominio para o formato aceito pelo Prisma. */
  static toPersistence(usuario: Usuario): Pick<UsuarioModel, 'email' | 'cpf' | 'nome' | 'senha' | 'role'> {
    return {
      email: usuario.email,
      cpf: usuario.cpf,
      nome: usuario.nome,
      senha: usuario.senha,
      role: usuario.role,
    }
  }
}
