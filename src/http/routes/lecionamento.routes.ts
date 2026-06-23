import { Router } from 'express';
import { lecionamentoController } from '../../shared/container';
import { verificarAutenticacao } from '../middlewares/auth/verifica-autenticacao/verifica-autenticacao.middleware';
import { exigirAdmin } from '../middlewares/auth/exige-admin/exige-admin.middleware';

const lecionamentoRoutes: Router = Router()

//#region Schemas
/**
 * @openapi
 * components:
 *   schemas:
 *     Lecionamento:
 *       type: object
 *       properties:
 *         codigo:
 *           type: string
 *           example: "2026.2.001.001"
 *         disciplina:
 *           type: object
 *           properties:
 *             codigo:
 *               type: string
 *               example: "001.001"
 *             curso:
 *               type: string
 *               example: "Ciência da Computação"
 *             nome:
 *               type: string
 *               example: "Cálculo I"
 *             periodo:
 *               type: integer
 *               example: 1
 *         professor:
 *           type: object
 *           properties:
 *             matricula:
 *               type: string
 *               example: "2026.001"
 *             nome:
 *               type: string
 *               example: "João Silva"
 *         semestre:
 *           type: string
 *           example: "2026.2"
 *         turno:
 *           type: string
 *           enum: [Manhã, Tarde, Noite]
 *           example: "Manhã"
 *         diaSemana:
 *           type: string
 *           enum: [Segunda, Terça, Quarta, Quinta, Sexta, Sábado]
 *           example: "Segunda"
 *
 *     LecionamentoCadastroBody:
 *       type: object
 *       required:
 *         - codDisciplina
 *         - matProfessor
 *         - codSemestre
 *         - turno
 *         - diaSemana
 *       properties:
 *         codDisciplina:
 *           type: string
 *           example: "001.001"
 *         matProfessor:
 *           type: string
 *           example: "2026.001"
 *         codSemestre:
 *           type: string
 *           description: "Código do semestre no formato 'AAAA.S' (ex: '2026.2'). Criado automaticamente se não existir."
 *           example: "2026.2"
 *         turno:
 *           type: string
 *           enum: [Manhã, Tarde, Noite]
 *           example: "Manhã"
 *         diaSemana:
 *           type: string
 *           enum: [Seg, Ter, Qua, Qui, Sex, Sab]
 *           example: "Seg"
 *
 *     LecionamentoEdicaoBody:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         codDisciplina:
 *           type: string
 *           example: "001.002"
 *         matProfessor:
 *           type: string
 *           example: "2026.002"
 *         codSemestre:
 *           type: string
 *           example: "2026.2"
 *         turno:
 *           type: string
 *           enum: [Manhã, Tarde, Noite]
 *           example: "Tarde"
 *         diaSemana:
 *           type: string
 *           enum: [Seg, Ter, Qua, Qui, Sex, Sab]
 *           example: "Qua"
 */
//#endregion

//#region Documentação: get '/lecionamentos'
/**
 * @openapi
 * /lecionamentos:
 *   get:
 *     tags:
 *       - Lecionamentos
 *     summary: Listar lecionamentos
 *     description: Retorna todos os lecionamentos cadastrados, com filtros opcionais.
 *     parameters:
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         example: "2026.2.001.001"
 *       - in: query
 *         name: codDisciplina
 *         schema:
 *           type: string
 *         example: "001.001"
 *       - in: query
 *         name: matProfessor
 *         schema:
 *           type: string
 *         example: "2026.001"
 *       - in: query
 *         name: codSemestre
 *         schema:
 *           type: string
 *         example: "2026.2"
 *       - in: query
 *         name: turno
 *         schema:
 *           type: string
 *         example: "Manhã"
 *       - in: query
 *         name: diaSemana
 *         schema:
 *           type: string
 *         example: "Seg"
 *     responses:
 *       200:
 *         description: Lista de lecionamentos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lecionamento'
 */
//#endregion
lecionamentoRoutes.get('/', lecionamentoController.buscar.bind(lecionamentoController))

//#region Documentação: post '/lecionamentos'
/**
 * @openapi
 * /lecionamentos:
 *   post:
 *     tags:
 *       - Lecionamentos
 *     summary: Cadastrar lecionamento
 *     description: Cria um novo lecionamento. O código é gerado automaticamente. O semestre é criado automaticamente se não existir.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LecionamentoCadastroBody'
 *     responses:
 *       201:
 *         description: Lecionamento criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecionamento'
 *       400:
 *         description: Dados violam as regras de negócio.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       401:
 *         description: Não autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       403:
 *         description: Sem permissão de administrador.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       404:
 *         description: Disciplina ou Professor não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       422:
 *         description: Campos obrigatórios ausentes ou com tipo inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
lecionamentoRoutes.post(
  '/',
  verificarAutenticacao,
  exigirAdmin,
  lecionamentoController.cadastrar.bind(lecionamentoController),
)

//#region Documentação: get '/lecionamentos/{codigo}'
/**
 * @openapi
 * /lecionamentos/{codigo}:
 *   get:
 *     tags:
 *       - Lecionamentos
 *     summary: Buscar lecionamento por código
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "2026.2.001.001"
 *     responses:
 *       200:
 *         description: Lecionamento encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecionamento'
 *       404:
 *         description: Lecionamento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
lecionamentoRoutes.get('/:codigo', lecionamentoController.buscarPorCodigo.bind(lecionamentoController))

//#region Documentação: patch '/lecionamentos/{codigo}'
/**
 * @openapi
 * /lecionamentos/{codigo}:
 *   patch:
 *     tags:
 *       - Lecionamentos
 *     summary: Editar lecionamento
 *     description: Atualiza um ou mais campos do lecionamento. Campos omitidos mantêm o valor atual.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "2026.2.001.001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LecionamentoEdicaoBody'
 *     responses:
 *       200:
 *         description: Lecionamento atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lecionamento'
 *       400:
 *         description: Dados violam as regras de negócio.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       401:
 *         description: Não autenticado.
 *       403:
 *         description: Sem permissão de administrador.
 *       404:
 *         description: Lecionamento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       422:
 *         description: Campo informado com tipo inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
lecionamentoRoutes.patch(
  '/:codigo',
  verificarAutenticacao,
  exigirAdmin,
  lecionamentoController.editar.bind(lecionamentoController),
)

//#region Documentação: delete '/lecionamentos/{codigo}'
/**
 * @openapi
 * /lecionamentos/{codigo}:
 *   delete:
 *     tags:
 *       - Lecionamentos
 *     summary: Excluir lecionamento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "2026.2.001.001"
 *     responses:
 *       204:
 *         description: Lecionamento removido com sucesso.
 *       401:
 *         description: Não autenticado.
 *       403:
 *         description: Sem permissão de administrador.
 *       404:
 *         description: Lecionamento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
lecionamentoRoutes.delete(
  '/:codigo',
  verificarAutenticacao,
  exigirAdmin,
  lecionamentoController.excluir.bind(lecionamentoController),
)

export default lecionamentoRoutes
