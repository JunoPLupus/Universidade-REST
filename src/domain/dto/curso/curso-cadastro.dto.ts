import { Curso } from '../../entities/curso/curso.entity';

/**
 * Dados necessários para cadastrar um novo curso.
 *
 * O `codigo` não faz parte do DTO: é gerado internamente pelo
 * `CursoService` a partir do último código cadastrado.
 */
export type CursoCadastroDTO = Pick<Curso, 'nome' | 'periodos'>
