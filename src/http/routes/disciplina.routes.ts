import { Router } from 'express';
import { disciplinaController } from '../../shared/container';

const disciplinaRoutes : Router = Router()

disciplinaRoutes.get('/', disciplinaController.buscar.bind(disciplinaController))
disciplinaRoutes.get('/:codigo', disciplinaController.buscarPorCodigo.bind(disciplinaController))
disciplinaRoutes.post('/', disciplinaController.cadastrar.bind(disciplinaController))
disciplinaRoutes.patch('/:codigo', disciplinaController.editar.bind(disciplinaController))
disciplinaRoutes.delete('/:codigo', disciplinaController.excluir.bind(disciplinaController))

export default disciplinaRoutes