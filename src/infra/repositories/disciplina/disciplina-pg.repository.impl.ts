import { Prisma, PrismaClient } from "@prisma/client";
import { BuscarDisciplinaFiltros, IDisciplinaRepository } from "../../../domain/repositories/disciplina.repository";
import { Disciplina } from "../../../domain/entities/disciplina/disciplina.entity";
import { DisciplinaMapper } from "./disciplina.mapper";

/**
 * Implementação do IDisciplinaRepository utilizando Prisma/PostgreSQL.
 */
export class DisciplinaPgRepositoryImpl implements IDisciplinaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async buscar(filtros: BuscarDisciplinaFiltros): Promise<Disciplina[]> {
    const where: Prisma.DisciplinaWhereInput = {}

    if (filtros.nome) {
      where.nome = { contains: filtros.nome, mode: "insensitive" }
    }

    if (filtros.codCurso) {
      where.codCurso = filtros.codCurso
    }

    if (filtros.codigo) {
      where.codigo = filtros.codigo
    }

    const registros = await this.prisma.disciplina.findMany({
      where,
      orderBy: { codigo: "asc" },
    })

    return registros.map(DisciplinaMapper.toDomain)
  }

  async buscarPorCodigo(codigo: string): Promise<Disciplina | null> {
    const registro = await this.prisma.disciplina.findUnique({ where: { codigo } })
    return registro ? DisciplinaMapper.toDomain(registro) : null
  }

  async buscarPorNomeECurso(nome: string, codCurso: string): Promise<Disciplina | null> {
    const registro = await this.prisma.disciplina.findUnique({
      where: { codCurso_nome: { codCurso, nome } },
    })

    return registro ? DisciplinaMapper.toDomain(registro) : null
  }

  async buscarUltimoCodigoDoCurso(codCurso: string): Promise<string | null> {
    const registro = await this.prisma.disciplina.findFirst({
      where: { codCurso },
      orderBy: { codigo: "desc" },
      select: { codigo: true },
    })

    return registro?.codigo ?? null
  }

  async cadastrar(disciplina: Disciplina): Promise<void> {
    await this.prisma.disciplina.create({ data: DisciplinaMapper.toPersistence(disciplina) })
  }

  async editar(disciplina: Disciplina): Promise<void> {
    await this.prisma.disciplina.update({
      where: { codigo: disciplina.codigo },
      data: DisciplinaMapper.toPersistence(disciplina),
    })
  }

  async excluir(codigo: string): Promise<void> {
    await this.prisma.disciplina.delete({ where: { codigo } })
  }
}
