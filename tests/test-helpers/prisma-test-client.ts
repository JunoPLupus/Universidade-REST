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
 * dependências de chave estrangeira (Disciplina depende de Curso).
 */
export async function limparTabelas(): Promise<void> {
  await prismaTest.disciplina.deleteMany()
  await prismaTest.curso.deleteMany()
}
