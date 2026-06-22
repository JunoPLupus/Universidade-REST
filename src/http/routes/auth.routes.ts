import { Router } from 'express';
import { authController } from '../../shared/container';

const authRoutes: Router = Router()

//#region Documentacao: post '/auth/login'
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Autenticar usuario
 *     description: Valida as credenciais e retorna um JWT Bearer para uso nas rotas protegidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "prof@uni.edu"
 *               senha:
 *                 type: string
 *                 example: "Senha@123"
 *     responses:
 *       200:
 *         description: Autenticado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciais invalidas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 *       422:
 *         description: Campos obrigatorios ausentes ou com tipo invalido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroResposta'
 */
//#endregion
authRoutes.post('/login', authController.login.bind(authController))

export default authRoutes
