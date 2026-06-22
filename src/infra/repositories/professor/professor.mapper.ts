import { Prisma } from '@prisma/client';
import { Professor } from '../../../domain/entities/professor/professor.entity';
import { ProfessorFactory } from '../../../domain/factories/professor.factory';

/** Tipo do registro Prisma com o usuario vinculado incluido. */
type ProfessorComUsuario = Prisma.ProfessorGetPayload<{ include: { usuario: true } }>

/**
 * Converte entre o registro do Prisma (tabela `professor` com join de `usuario`)
 * e a entidade de dominio `Professor`.
 */
export class ProfessorMapper {
  /**
   * Reconstitui a entidade de dominio a partir de um registro do banco.
   * Exige que o `usuario` vinculado esteja incluido na query (`include: { usuario: true }`).
   */
  static toDomain(raw: ProfessorComUsuario): Professor {
    return ProfessorFactory.criar({
      matricula: raw.matricula,
      emailUsuario: raw.emailUsuario,
      nome: raw.usuario.nome,
      cpf: raw.usuario.cpf,
      especialidade: raw.especialidade,
      titulacao: raw.titulacao,
    })
  }

  /** Converte apenas os campos proprios do professor para o formato aceito pelo Prisma. */
  static toPersistence(professor: Professor): Pick<Prisma.ProfessorCreateInput, 'matricula' | 'especialidade' | 'titulacao'> & { emailUsuario: string } {
    return {
      matricula: professor.matricula,
      emailUsuario: professor.emailUsuario,
      especialidade: professor.especialidade,
      titulacao: professor.titulacao,
    }
  }
}
