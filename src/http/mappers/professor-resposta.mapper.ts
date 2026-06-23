import { Professor } from '../../domain/entities/professor/professor.entity';
import { ProfessorRespostaDTO } from '../dto/professor-resposta.dto';
import { ProfessorRespostaPublicaDTO } from '../dto/professor-resposta-publica.dto';

/**
 * Converte a entidade de domínio `Professor` para os formatos de resposta da API.
 *
 * `paraResposta` retorna a visão completa (admin ou dono do registro).
 * `paraRespostaPublica` retorna a visão reduzida (não autenticado ou outro professor).
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

  static paraRespostaPublica(professor: Professor): ProfessorRespostaPublicaDTO {
    return {
      matricula: professor.matricula,
      nome: professor.nome,
    }
  }
}
