import express, { Application, Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './shared/swagger';
import { errorHandler } from './http/middlewares/error-handler/error-handler.middleware';
import cursoRoutes from "./http/routes/curso.routes";
import disciplinaRoutes from "./http/routes/disciplina.routes";

export function createApp(): Application {
  const app : Express = express()

  app.use(cors())
  app.use(express.json())

  // Documentação interativa (Swagger UI) em /docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/cursos', cursoRoutes)
  app.use('/disciplinas', disciplinaRoutes)

  // Middleware global de tratamento de erros (deve ser o último a ser registrado)
  app.use(errorHandler)

  return app
}
