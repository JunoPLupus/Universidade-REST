import { Prisma, PrismaClient } from '@prisma/client';
import { BuscarProfessorFiltros, IProfessorRepository } from '../../../domain/repositories/professor.repository';
import { Professor } from '../../../domain/entities/professor/professor.entity';
import { Usuario } from '../../../domain/entities/usuario/usuario.entity';
import { ProfessorMapper } from './professor.mapper';
import { UsuarioMapper } from '../usuario/usuario.mapper';

const INCLUDE_USUARIO = { usuario: true } as const

/**
 * Implementacao do IProfessorRepository utilizando Prisma/PostgreSQL.
 */
export class ProfessorPgRepositoryImpl implements IProfessorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async buscar(filtros: BuscarProfessorFiltros): Promise<Professor[]> {
    const where: Prisma.ProfessorWhereInput = {}

    if (filtros.matricula) {
      where.matricula = filtros.matricula
    }

    if (filtros.email) {
      where.emailUsuario = filtros.email
    }

    if (filtros.especialidade) {
      where.especialidade = { contains: filtros.especialidade, mode: 'insensitive' }
    }

    if (filtros.titulacao) {
      where.titulacao = filtros.titulacao
    }

    if (filtros.nome) {
      where.usuario = { nome: { contains: filtros.nome, mode: 'insensitive' } }
    }

    if (filtros.cpf) {
      where.usuario = { ...where.usuario as Prisma.UsuarioWhereInput, cpf: filtros.cpf }
    }

    const registros = await this.prisma.professor.findMany({
      where,
      include: INCLUDE_USUARIO,
      orderBy: { matricula: 'asc' },
    })

    return registros.map(ProfessorMapper.toDomain)
  }

  async buscarPorMatricula(matricula: string): Promise<Professor | null> {
    const registro = await this.prisma.professor.findUnique({
      where: { matricula },
      include: INCLUDE_USUARIO,
    })
    return registro ? ProfessorMapper.toDomain(registro) : null
  }

  async buscarUltimaMatriculaDoAno(ano: number): Promise<string | null> {
    const registros = await this.prisma.professor.findMany({
      where: { matricula: { startsWith: `${ano}.` } },
      select: { matricula: true },
    })

    if (registros.length === 0) return null

    return registros.reduce((max, curr) => {
      const maxN = parseInt(max.split('.')[1])
      const currN = parseInt(curr.matricula.split('.')[1])
      return currN > maxN ? curr.matricula : max
    }, registros[0].matricula)
  }

  async cadastrar(professor: Professor, usuario: Usuario): Promise<void> {
    const dadosUsuario = UsuarioMapper.toPersistence(usuario)
    const dadosProfessor = ProfessorMapper.toPersistence(professor)

    await this.prisma.$transaction([
      this.prisma.usuario.create({ data: dadosUsuario }),
      this.prisma.professor.create({
        data: {
          matricula: dadosProfessor.matricula,
          especialidade: dadosProfessor.especialidade,
          titulacao: dadosProfessor.titulacao,
          usuario: { connect: { email: dadosProfessor.emailUsuario } },
        },
      }),
    ])
  }

  async atualizar(professor: Professor): Promise<void> {
    await this.prisma.professor.update({
      where: { matricula: professor.matricula },
      data: {
        especialidade: professor.especialidade,
        titulacao: professor.titulacao,
      },
    })
  }

  async excluir(matricula: string): Promise<void> {
    const registro = await this.prisma.professor.findUnique({
      where: { matricula },
      select: { emailUsuario: true },
    })

    if (!registro) return

    await this.prisma.$transaction([
      this.prisma.professor.delete({ where: { matricula } }),
      this.prisma.usuario.delete({ where: { email: registro.emailUsuario } }),
    ])
  }
}
