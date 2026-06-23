import { prisma } from "../infra/database/prisma-client";

import { CursoPgRepositoryImpl } from "../infra/repositories/curso/curso-pg.repository.impl";
import { CursoService } from "../domain/services/curso/curso.service";
import { CursoController } from "../http/controllers/curso/curso.controller";

import { DisciplinaPgRepositoryImpl } from "../infra/repositories/disciplina/disciplina-pg.repository.impl";
import { DisciplinaService } from "../domain/services/disciplina/disciplina.service";
import { DisciplinaController } from "../http/controllers/disciplina/disciplina.controller";

import { UsuarioPgRepositoryImpl } from "../infra/repositories/usuario/usuario-pg.repository.impl";
import { AuthService } from "../domain/services/auth/auth.service";
import { AuthController } from "../http/controllers/auth/auth.controller";

import { ProfessorPgRepositoryImpl } from "../infra/repositories/professor/professor-pg.repository.impl";
import { ProfessorService } from "../domain/services/professor/professor.service";
import { ProfessorController } from "../http/controllers/professor/professor.controller";

import { SemestrePgRepositoryImpl } from "../infra/repositories/semestre/semestre-pg.repository.impl";

import { LecionamentoPgRepositoryImpl } from "../infra/repositories/lecionamento/lecionamento-pg.repository.impl";
import { LecionamentoService } from "../domain/services/lecionamento/lecionamento.service";
import { LecionamentoController } from "../http/controllers/lecionamento/lecionamento.controller";

//#region repositories
const cursoRepository = new CursoPgRepositoryImpl(prisma)
const disciplinaRepository = new DisciplinaPgRepositoryImpl(prisma)
const usuarioRepository = new UsuarioPgRepositoryImpl(prisma)
const professorRepository = new ProfessorPgRepositoryImpl(prisma)
const semestreRepository = new SemestrePgRepositoryImpl(prisma)
const lecionamentoRepository = new LecionamentoPgRepositoryImpl(prisma)
//#endregion

//#region services
const cursoService = new CursoService(cursoRepository, disciplinaRepository)
const disciplinaService = new DisciplinaService(disciplinaRepository, cursoRepository)
const authService = new AuthService(usuarioRepository)
const professorService = new ProfessorService(professorRepository, usuarioRepository)
const lecionamentoService = new LecionamentoService(
  lecionamentoRepository,
  semestreRepository,
  disciplinaRepository,
  professorRepository,
)
//#endregion

//#region controllers
export const cursoController = new CursoController(cursoService)
export const disciplinaController = new DisciplinaController(disciplinaService, cursoService)
export const authController = new AuthController(authService)
export const professorController = new ProfessorController(professorService)
export const lecionamentoController = new LecionamentoController(
  lecionamentoService,
  disciplinaService,
  professorService,
  cursoService,
)
//#endregion
