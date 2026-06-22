import express, { Application, Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './shared/swagger';
import { errorHandler } from './http/middlewares/error-handler/error-handler.middleware';
import authRoutes from './http/routes/auth.routes';
import cursoRoutes from './http/routes/curso.routes';
import disciplinaRoutes from './http/routes/disciplina.routes';
import professorRoutes from './http/routes/professor.routes';

export function createApp(): Application {
  const app: Express = express()

  app.use(cors())
  app.use(express.json())

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/auth', authRoutes)
  app.use('/cursos', cursoRoutes)
  app.use('/disciplinas', disciplinaRoutes)
  app.use('/professores', professorRoutes)

  app.use(errorHandler)

  return app
}
