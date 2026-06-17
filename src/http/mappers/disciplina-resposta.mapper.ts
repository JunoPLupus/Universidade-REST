import { Curso } from '../../domain/entities/curso/curso.entity';
import { Disciplina } from '../../domain/entities/disciplina/disciplina.entity';
import { DisciplinaRespostaDTO } from '../dto/disciplina-resposta.dto';

/**
 * Converte a entidade de domínio `Disciplina`, combinada com o `Curso` ao
 * qual ela pertence, para o formato de resposta da API.
 *
 * O `curso` informado deve ser aquele cujo `codigo` é igual a
 * `disciplina.codCurso` — essa busca é responsabilidade de quem chama o
 * mapper (o controller), não dele.
 */
export class DisciplinaRespostaMapper {
  static paraResposta(disciplina: Disciplina, curso: Curso): DisciplinaRespostaDTO {
    return {
      codigo: disciplina.codigo,
      curso: curso.nome,
      periodo: disciplina.periodo,
      nome: disciplina.nome,
      cargaHoraria: disciplina.cargaHoraria,
    }
  }
}
