import { Prisma, PrismaClient } from '@prisma/client';
import { BuscarLecionamentoFiltros, ILecionamentoRepository } from '../../../domain/repositories/lecionamento.repository';
import { Lecionamento } from '../../../domain/entities/lecionamento/lecionamento.entity';
import { LecionamentoMapper } from './lecionamento.mapper';

/**
 * Implementação do ILecionamentoRepository utilizando Prisma/PostgreSQL.
 */
export class LecionamentoPgRepositoryImpl implements ILecionamentoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async buscar(filtros: BuscarLecionamentoFiltros): Promise<Lecionamento[]> {
    const where: Prisma.LecionamentoWhereInput = {};

    if (filtros.codigo) where.codigo = filtros.codigo

    if (filtros.codDisciplina) where.codDisciplina = filtros.codDisciplina

    if (filtros.matProfessor) where.matProfessor = filtros.matProfessor;

    if (filtros.codSemestre) where.codSemestre = filtros.codSemestre;

    if (filtros.turno) where.turno = filtros.turno;

    if (filtros.diaSemana) where.diaSemana = filtros.diaSemana;

    const registros = await this.prisma.lecionamento.findMany({
      where,
      orderBy: { codigo: 'asc' },
    })

    return registros.map(LecionamentoMapper.toDomain)
  }

  async buscarPorCodigo(codigo: string): Promise<Lecionamento | null> {
    const registro = await this.prisma.lecionamento.findUnique({ where: { codigo } })
    return registro ? LecionamentoMapper.toDomain(registro) : null
  }

  async buscarUltimoCodigoDoSemestreCurso(codSemestre: string, codCurso: string): Promise<string | null> {
    const prefixo = `${codSemestre}.${codCurso}.`
    const registro = await this.prisma.lecionamento.findFirst({
      where: { codigo: { startsWith: prefixo } },
      orderBy: { codigo: 'desc' },
      select: { codigo: true },
    })
    return registro?.codigo ?? null
  }

  async cadastrar(lecionamento: Lecionamento): Promise<void> {
    await this.prisma.lecionamento.create({ data: LecionamentoMapper.toPersistence(lecionamento) })
  }

  async editar(codigoAntigo: string, lecionamento: Lecionamento): Promise<void> {
    await this.prisma.lecionamento.update({
      where: { codigo: codigoAntigo },
      data: LecionamentoMapper.toPersistence(lecionamento),
    })
  }

  async excluir(codigo: string): Promise<void> {
    await this.prisma.lecionamento.delete({ where: { codigo } })
  }

  async existePorDisciplina(codDisciplina: string): Promise<boolean> {
    const count = await this.prisma.lecionamento.count({ where: { codDisciplina } })
    return count > 0
  }

  async existePorProfessor(matProfessor: string): Promise<boolean> {
    const count = await this.prisma.lecionamento.count({ where: { matProfessor } })
    return count > 0
  }
}
