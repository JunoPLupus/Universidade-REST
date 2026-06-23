import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

// Em produção (node dist/), __dirname aponta para dist/shared/.
// Em desenvolvimento (ts-node), aponta para src/shared/.
// O padrão de busca se ajusta para encontrar os comentários @openapi nos arquivos corretos em cada ambiente.
const isProduction = __dirname.includes(`${path.sep}dist${path.sep}`)
// glob não suporta barras invertidas (Windows) — normaliza para forward slashes
const routesGlob = (isProduction
  ? path.join(__dirname, '../http/routes/*.js')
  : path.join(__dirname, '../http/routes/*.ts')
).replace(/\\/g, '/')

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Universidade REST API',
      version: '1.0.0',
      description:
        'API REST para gestão de cursos, disciplinas, professores e lecionamentos.',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [routesGlob],
}

export const swaggerSpec = swaggerJsdoc(options)
