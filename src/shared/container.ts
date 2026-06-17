import { prisma } from "../infra/database/prisma-client";

import { CursoPgRepositoryImpl } from "../infra/repositories/curso/curso-pg.repository.impl";
import { CursoService } from "../domain/services/curso/curso.service";
import { CursoController } from "../http/controllers/curso/curso.controller";
import { DisciplinaPgRepositoryImpl } from "../infra/repositories/disciplina/disciplina-pg.repository.impl";
import { DisciplinaService } from "../domain/services/disciplina/disciplina.service";
import { DisciplinaController } from "../http/controllers/disciplina/disciplina.controller";

//#region repositories
const cursoRepository = new CursoPgRepositoryImpl(prisma)
const disciplinaRepository = new DisciplinaPgRepositoryImpl(prisma)
//#endregion

//#region services
const cursoService = new CursoService(cursoRepository, disciplinaRepository)
const disciplinaService = new DisciplinaService(disciplinaRepository, cursoRepository)
//#endregion

//#region controllers
export const cursoController = new CursoController(cursoService)
export const disciplinaController = new DisciplinaController(disciplinaService, cursoService)
//#endregion
