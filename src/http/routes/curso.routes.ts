import { Router } from 'express';
import { cursoController, disciplinaController } from '../../shared/container';

const cursoRoutes : Router = Router()

cursoRoutes.get('/', cursoController.buscar.bind(cursoController))
cursoRoutes.get('/:codigo', cursoController.buscarPorCodigo.bind(cursoController))
cursoRoutes.post('/', cursoController.cadastrar.bind(cursoController))
cursoRoutes.patch('/:codigo', cursoController.editar.bind(cursoController))
cursoRoutes.delete('/:codigo', cursoController.excluir.bind(cursoController))
cursoRoutes.delete('/:codigo/disciplinas', disciplinaController.excluirPorCurso.bind(disciplinaController))

export default cursoRoutes
