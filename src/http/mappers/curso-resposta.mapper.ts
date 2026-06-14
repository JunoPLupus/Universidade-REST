import { Curso } from '../../domain/entities/curso/curso.entity';
import { CursoRespostaDTO } from '../dto/curso-resposta.dto';

/**
 * Converte a entidade de domínio `Curso` para o formato de resposta da API.
 */
export class CursoRespostaMapper {
  static paraResposta(curso: Curso): CursoRespostaDTO {
    return {
      codigo: curso.codigo,
      nome: curso.nome,
      periodos: curso.periodos,
    }
  }
}
