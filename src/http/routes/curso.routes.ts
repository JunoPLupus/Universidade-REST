import { Router } from 'express';
import { cursoController, disciplinaController } from '../../shared/container';
import { verificarAutenticacao } from '../middlewares/auth/auth.middleware';
import { exigirAdmin } from '../middlewares/auth/roles.middleware';

const cursoRoutes : Router = Router()

//#region Schemas
/**
 * @openapi
 * components:
 *   schemas:
 *     ErroResposta:
 *       type: object
 *       properties:
 *         mensagem:
 *           type: string
 *           example: "Mensagem de erro."
 *
 *     Curso:
 *       type: object
 *       properties:
 *         codigo:
 *           type: string
 *           example: "001"
 *         nome:
 *           type: string
 *           example: "Ciência da Computação"
 *         periodos:
 *           type: integer
 *           example: 8
 *
 *     CursoCadastroBody:
 *       type: object
 *       required:
 *         - nome
 *         - periodos
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *           example: "Ciência da Computação"
 *         periodos:
 *           type: integer
 *           minimum: 3
 *           maximum: 12
 *           example: 8
 *
 *     CursoEdicaoBody:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *           example: "Engenharia de Software"
 *         periodos:
 *           type: integer
 *           minimum: 3
 *           maximum: 12
 *           example: 10
 */
//#endregion

//#region Documentação: get '/cursos'
/**
 * @openapi
 * /cursos:
 *   get:
 *     tags:
 *       - Cursos
 *     summary: Listar cursos
 *     description: Retorna todos os cursos cadastrados, com filtros opcionais por nome (parcial) e código (exato).
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtra por parte do nome do curso (sem diferenciar maiúsculas/minúsculas).
 *         example: "Ciência"
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         description: Filtra pelo código exato do curso.
 *         example: "001"
 *     responses:
 *       200:
 *         description: Lista de cursos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Curso'
 */
//#endregion
cursoRoutes.get('/', cursoController.buscar.bind(cursoController))

//#region Documentação: post '/cursos'
/**
 * @openapi
 * /cursos:
 *   post:
 *     tags:
 *       - Cursos
 *     summary: Cadastrar curso
 *     description: Cria um novo curso. O código é gerado automaticamente de forma sequencial.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CursoCadastroBody'
 *     responses:
 *       201:
 *         description: Curso criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Dados violam as regras de negócio (ex. nome fora do tamanho permitido).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       409:
 *         description: Já existe um curso com o mesmo nome.
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
cursoRoutes.post('/', verificarAutenticacao, exigirAdmin, cursoController.cadastrar.bind(cursoController))

//#region Documentação: get '/cursos/{codigo}'
/**
 * @openapi
 * /cursos/{codigo}:
 *   get:
 *     tags:
 *       - Cursos
 *     summary: Buscar curso por código
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "001"
 *     responses:
 *       200:
 *         description: Curso encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       404:
 *         description: Curso não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
cursoRoutes.get('/:codigo', cursoController.buscarPorCodigo.bind(cursoController))

//#region Documentação: patch '/cursos/{codigo}'
/**
 * @openapi
 * /cursos/{codigo}:
 *   patch:
 *     tags:
 *       - Cursos
 *     summary: Editar curso
 *     description: Atualiza um ou mais campos do curso. Campos omitidos mantêm o valor atual.
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CursoEdicaoBody'
 *     responses:
 *       200:
 *         description: Curso atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Curso'
 *       400:
 *         description: Dados violam as regras de negócio.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       404:
 *         description: Curso não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       409:
 *         description: Já existe outro curso com o novo nome informado.
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
cursoRoutes.patch('/:codigo', verificarAutenticacao, exigirAdmin, cursoController.editar.bind(cursoController))

//#region Documentação: delete '/cursos/{codigo}'
/**
 * @openapi
 * /cursos/{codigo}:
 *   delete:
 *     tags:
 *       - Cursos
 *     summary: Excluir curso
 *     description: Remove o curso. Falha se houver disciplinas vinculadas.
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "001"
 *     responses:
 *       204:
 *         description: Curso removido com sucesso.
 *       404:
 *         description: Curso não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       409:
 *         description: Curso possui disciplinas vinculadas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
cursoRoutes.delete('/:codigo', verificarAutenticacao, exigirAdmin, cursoController.excluir.bind(cursoController))

//#region Documentação: delete '/cursos/{codigo}/disciplinas'
/**
 * @openapi
 * /cursos/{codigo}/disciplinas:
 *   delete:
 *     tags:
 *       - Cursos
 *     summary: Excluir todas as disciplinas de um curso
 *     description: Remove todas as disciplinas vinculadas ao curso informado.
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *         description: Curso nao encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
cursoRoutes.delete('/:codigo/disciplinas', verificarAutenticacao, exigirAdmin, disciplinaController.excluirPorCurso.bind(disciplinaController))

export default cursoRoutes
