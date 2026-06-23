import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

/**
 * Instância do PrismaClient usada pelos testes de integração, conectada ao
 * banco de dados dedicado a testes (`DATABASE_URL_TEST`), separado do banco
 * principal da aplicação.
 */
export const prismaTest = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL_TEST },
  },
})

/**
 * Remove todos os registros das tabelas usadas nos testes de integração.
 *
 * Deve ser chamada antes de cada teste (`beforeEach`) para garantir que os
 * testes não interfiram entre si. A ordem de exclusão respeita as
 * dependências de chave estrangeira:
 * - lecionamento depende de disciplina, professor e semestre
 * - professor depende de usuario
 * - disciplina depende de curso
 */
export async function limparTabelas(): Promise<void> {
  await prismaTest.lecionamento.deleteMany()
  await prismaTest.semestre.deleteMany()
  await prismaTest.professor.deleteMany()
  await prismaTest.usuario.deleteMany()
  await prismaTest.disciplina.deleteMany()
  await prismaTest.curso.deleteMany()
}
