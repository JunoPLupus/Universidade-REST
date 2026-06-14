import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './shared/swagger';
import { errorHandler } from './http/middlewares/error-handler/error-handler.middleware';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Documentação interativa (Swagger UI) em /docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // TODO: registrar aqui as rotas de cada módulo, ex:
  // app.use('/cursos', cursoRoutes);
  // app.use('/disciplinas', disciplinaRoutes);

  // Middleware global de tratamento de erros (deve ser o último a ser registrado)
  app.use(errorHandler);

  return app;
}
