import { PrismaClient } from '@prisma/client';

/**
 * Instância única do PrismaClient usada pela aplicação.
 *
 * Os repositories recebem essa instância via injeção de dependência no
 * construtor, evitando que cada um abra sua própria conexão com o banco.
 */
export const prisma = new PrismaClient();
