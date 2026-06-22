import { Router } from 'express';
import { professorController } from '../../shared/container';
import { verificarAutenticacao } from '../middlewares/auth/auth.middleware';
import { exigirAdmin } from '../middlewares/auth/roles.middleware';

const professorRoutes: Router = Router()

//#region Documentacao: get '/professores'
/**
 * @openapi
 * /professores:
 *   get:
 *     tags:
 *       - Professores
 *     summary: Listar professores
 *     description: Retorna todos os professores cadastrados, com filtros opcionais.
 *     parameters:
 *       - in: query
 *         name: matricula
 *         schema:
 *           type: string
 *         example: "2026.001"
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         example: "prof@uni.edu"
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         example: "Ana"
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         example: "000.000.000-00"
 *       - in: query
 *         name: especialidade
 *         schema:
 *           type: string
 *         example: "Redes"
 *       - in: query
 *         name: titulacao
 *         schema:
 *           type: string
 *         example: "MESTRE"
 *     responses:
 *       200:
 *         description: Lista de professores.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professor'
 */
//#endregion
professorRoutes.get('/', professorController.buscar.bind(professorController))

//#region Documentacao: get '/professores/:mat'
/**
 * @openapi
 * /professores/{mat}:
 *   get:
 *     tags:
 *       - Professores
 *     summary: Buscar professor por matricula
 *     parameters:
 *       - in: path
 *         name: mat
 *         required: true
 *         schema:
 *           type: string
 *         example: "2026.001"
 *     responses:
 *       200:
 *         description: Professor encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       404:
 *         description: Professor nao encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
professorRoutes.get('/:mat', professorController.buscarPorMatricula.bind(professorController))

//#region Documentacao: post '/professores'
/**
 * @openapi
 * /professores:
 *   post:
 *     tags:
 *       - Professores
 *     summary: Cadastrar professor
 *     description: Cria um professor e o usuario vinculado. A matricula e gerada automaticamente. Requer perfil ADMIN.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfessorCadastroBody'
 *     responses:
 *       201:
 *         description: Professor criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       401:
 *         description: Nao autenticado.
 *       403:
 *         description: Sem permissao (requer ADMIN).
 *       409:
 *         description: E-mail ou CPF ja em uso.
 *       422:
 *         description: Campos obrigatorios ausentes ou com tipo invalido.
 */
//#endregion
professorRoutes.post('/', verificarAutenticacao, exigirAdmin, professorController.cadastrar.bind(professorController))

//#region Documentacao: patch '/professores/:mat'
/**
 * @openapi
 * /professores/{mat}:
 *   patch:
 *     tags:
 *       - Professores
 *     summary: Atualizar professor
 *     description: Admin pode editar qualquer professor; professor so pode editar a si mesmo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mat
 *         required: true
 *         schema:
 *           type: string
 *         example: "2026.001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfessorEdicaoBody'
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       401:
 *         description: Nao autenticado.
 *       403:
 *         description: Sem permissao.
 *       404:
 *         description: Professor nao encontrado.
 */
//#endregion
professorRoutes.patch('/:mat', verificarAutenticacao, professorController.atualizar.bind(professorController))

//#region Documentacao: delete '/professores/:mat'
/**
 * @openapi
 * /professores/{mat}:
 *   delete:
 *     tags:
 *       - Professores
 *     summary: Excluir professor
 *     description: Remove o professor e o usuario vinculado. Requer perfil ADMIN.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mat
 *         required: true
 *         schema:
 *           type: string
 *         example: "2026.001"
 *     responses:
 *       204:
 *         description: Professor removido com sucesso.
 *       401:
 *         description: Nao autenticado.
 *       403:
 *         description: Sem permissao (requer ADMIN).
 *       404:
 *         description: Professor nao encontrado.
 */
//#endregion
professorRoutes.delete('/:mat', verificarAutenticacao, exigirAdmin, professorController.excluir.bind(professorController))

export default professorRoutes
