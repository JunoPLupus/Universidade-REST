import { CursoProps } from '../entities/curso/curso.props';

/**
 * Dados necessários para cadastrar um novo curso.
 *
 * O `codigo` não faz parte do DTO: é gerado internamente pelo
 * `CursoService` a partir do último código cadastrado.
 */
export type CursoCadastroDTO = Pick<CursoProps, 'nome' | 'periodos'>
