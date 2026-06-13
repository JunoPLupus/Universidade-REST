import swaggerJsdoc from 'swagger-jsdoc';

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
  },
  // Caminhos onde o swagger-jsdoc vai procurar pelos comentários @openapi
  // para gerar a documentação automaticamente.
  apis: ['./src/http/routes/*.ts', './src/http/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
