import { Router } from 'express';
import { disciplinaController } from '../../shared/container';
import { verificarAutenticacao } from '../middlewares/auth/verifica-autenticacao/verifica-autenticacao.middleware';
import { exigirAdmin } from '../middlewares/auth/exige-admin/exige-admin.middleware';

const disciplinaRoutes : Router = Router()

//#region Schemas
/**
 * @openapi
 * components:
 *   schemas:
 *     Disciplina:
 *       type: object
 *       properties:
 *         codigo:
 *           type: string
 *           example: "001.001"
 *         curso:
 *           type: string
 *           description: Nome do curso ao qual a disciplina pertence.
 *           example: "Ciência da Computação"
 *         periodo:
 *           type: integer
 *           example: 3
 *         nome:
 *           type: string
 *           example: "Cálculo I"
 *         cargaHoraria:
 *           type: integer
 *           example: 60
 *
 *     DisciplinaCadastroBody:
 *       type: object
 *       required:
 *         - codCurso
 *         - periodo
 *         - nome
 *         - cargaHoraria
 *       properties:
 *         codCurso:
 *           type: string
 *           description: Código do curso ao qual a disciplina pertence.
 *           example: "001"
 *         periodo:
 *           type: integer
 *           description: Período em que a disciplina é ministrada. Não pode exceder o total de períodos do curso.
 *           minimum: 3
 *           example: 3
 *         nome:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *           example: "Cálculo I"
 *         cargaHoraria:
 *           type: integer
 *           description: Carga horária em horas. Deve ser maior que zero.
 *           minimum: 1
 *           example: 60
 *
 *     DisciplinaEdicaoBody:
 *       type: object
 *       minProperties: 1
 *       properties:
 *         periodo:
 *           type: integer
 *           minimum: 3
 *           example: 3
 *         nome:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *           example: "Cálculo II"
 *         cargaHoraria:
 *           type: integer
 *           minimum: 1
 *           example: 80
 */
//#endregion

//#region Documentação get '/disciplinas'
/**
 * @openapi
 * /disciplinas:
 *   get:
 *     tags:
 *       - Disciplinas
 *     summary: Listar disciplinas
 *     description: Retorna todas as disciplinas cadastradas, com filtros opcionais.
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtra por parte do nome da disciplina.
 *         example: "Cálculo"
 *       - in: query
 *         name: codCurso
 *         schema:
 *           type: string
 *         description: Filtra pelo código exato do curso.
 *         example: "001"
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         description: Filtra pelo código exato da disciplina.
 *         example: "001.001"
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: integer
 *         description: Filtra pelo período exato.
 *         example: 1
 *       - in: query
 *         name: cargaHoraria
 *         schema:
 *           type: integer
 *         description: Filtra pela carga horária exata.
 *         example: 60
 *     responses:
 *       200:
 *         description: Lista de disciplinas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Disciplina'
 *       404:
 *         description: Curso informado no filtro não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
disciplinaRoutes.get('/', disciplinaController.buscar.bind(disciplinaController))

//#region Documentação: post '/disciplinas'
/**
 * @openapi
 * /disciplinas:
 *   post:
 *     tags:
 *       - Disciplinas
 *     summary: Cadastrar disciplina
 *     description: Cria uma nova disciplina vinculada a um curso. O código é gerado automaticamente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisciplinaCadastroBody'
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disciplina'
 *       400:
 *         description: Dados violam as regras de negócio (ex. período excede o total do curso).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       404:
 *         description: Curso informado não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       409:
 *         description: Já existe uma disciplina com o mesmo nome nesse curso.
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
disciplinaRoutes.post('/', verificarAutenticacao, exigirAdmin, disciplinaController.cadastrar.bind(disciplinaController))

//#region Documentação: get '/disciplinas/{codigo}'
/**
 * @openapi
 * /disciplinas/{codigo}:
 *   get:
 *     tags:
 *       - Disciplinas
 *     summary: Buscar disciplina por código
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "001.001"
 *     responses:
 *       200:
 *         description: Disciplina encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disciplina'
 *       404:
 *         description: Disciplina não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
disciplinaRoutes.get('/:codigo', disciplinaController.buscarPorCodigo.bind(disciplinaController))

//#region Documentação: patch '/disciplinas/{codigo}'
/**
 * @openapi
 * /disciplinas/{codigo}:
 *   patch:
 *     tags:
 *       - Disciplinas
 *     summary: Editar disciplina
 *     description: Atualiza um ou mais campos da disciplina. Campos omitidos mantêm o valor atual.
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: "001.001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisciplinaEdicaoBody'
 *     responses:
 *       200:
 *         description: Disciplina atualizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Disciplina'
 *       400:
 *         description: Dados violam as regras de negócio.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       404:
 *         description: Disciplina não encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       409:
 *         description: Já existe outra disciplina com o novo nome nesse curso.
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
disciplinaRoutes.patch('/:codigo', verificarAutenticacao, exigirAdmin, disciplinaController.editar.bind(disciplinaController))

//#region Documentação: delete '/disciplinas/{codigo}'
/**
 * @openapi
 * /disciplinas/{codigo}:
 *   delete:
 *      tags:
 *        - Disciplinas
 *      summary: Excluir disciplina
 *      parameters:
 *        - in: path
 *          name: codigo
 *          required: true
 *          schema:
 *            type: string
 *          example: "001.001"
 *      responses:
 *        204:
 *          description: Disciplina removida com sucesso.
 *        404:
 *          description: Disciplina não encontrada.
 *          content:
 *            application/json:
 *          description: Disciplina nao encontrada.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
disciplinaRoutes.delete('/:codigo', verificarAutenticacao, exigirAdmin, disciplinaController.excluir.bind(disciplinaController))

export default disciplinaRoutes
