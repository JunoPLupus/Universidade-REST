import { Prisma, PrismaClient } from "@prisma/client";
import { BuscarCursoFiltros, ICursoRepository } from "../../../domain/repositories/curso.repository";
import { Curso } from "../../../domain/entities/curso/curso.entity";
import { CursoMapper } from "./curso.mapper";

/**
 * Implementação do ICursoRepository utilizando Prisma/PostgreSQL.
 */
export class CursoPgRepositoryImpl implements ICursoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async buscar(filtros: BuscarCursoFiltros): Promise<Curso[]> {
    const where: Prisma.CursoWhereInput = {}

    if (filtros.nome) {
      where.nome = { contains: filtros.nome, mode: "insensitive" }
    }

    if (filtros.codigo) {
      where.codigo = filtros.codigo
    }

    const registros = await this.prisma.curso.findMany({
      where,
      orderBy: { codigo: "asc" },
    })

    return registros.map(CursoMapper.toDomain)
  }

  async buscarPorCodigo(codigo: string): Promise<Curso | null> {
    const registro = await this.prisma.curso.findUnique({ where: { codigo } })
    return registro ? CursoMapper.toDomain(registro) : null
  }

  async buscarPorNome(nome: string): Promise<Curso | null> {
    const registro = await this.prisma.curso.findUnique({ where: { nome } })
    return registro ? CursoMapper.toDomain(registro) : null
  }

  async buscarUltimoCodigo(): Promise<string | null> {
    const registro = await this.prisma.curso.findFirst({
      orderBy: { codigo: "desc" },
      select: { codigo: true },
    })

    return registro?.codigo ?? null
  }

  async cadastrar(curso: Curso): Promise<void> {
    await this.prisma.curso.create({ data: CursoMapper.toPersistence(curso) })
  }

  async editar(curso: Curso): Promise<void> {
    await this.prisma.curso.update({
      where: { codigo: curso.codigo },
      data: CursoMapper.toPersistence(curso),
    })
  }

  async excluir(codigo: string): Promise<void> {
    await this.prisma.curso.delete({ where: { codigo } })
  }
}
