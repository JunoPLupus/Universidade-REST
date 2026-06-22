import { Professor } from '../../domain/entities/professor/professor.entity';
import { ProfessorRespostaDTO } from '../dto/professor-resposta.dto';

/**
 * Converte a entidade de domínio `Professor` para o formato de resposta da API.
 */
export class ProfessorRespostaMapper {
  static paraResposta(professor: Professor): ProfessorRespostaDTO {
    return {
      matricula: professor.matricula,
      email: professor.emailUsuario,
      nome: professor.nome,
      cpf: professor.cpf,
      especialidade: professor.especialidade,
      titulacao: professor.titulacao,
    }
  }
}
