import { LecionamentoService } from './lecionamento.service';
import { ILecionamentoRepository } from '../../repositories/lecionamento.repository';
import { ISemestreRepository } from '../../repositories/semestre.repository';
import { IDisciplinaRepository } from '../../repositories/disciplina.repository';
import { IProfessorRepository } from '../../repositories/professor.repository';
import { LecionamentoMother } from '../../../../tests/test-helpers/lecionamento.mother';
import { SemestreMother } from '../../../../tests/test-helpers/semestre.mother';
import { DisciplinaMother } from '../../../../tests/test-helpers/disciplina.mother';
import { ProfessorMother } from '../../../../tests/test-helpers/professor.mother';
import { ErroNaoEncontradoError } from '../../errors/erro-nao-encontrado.error';
import { ErroValidacaoError } from '../../errors/erro-validacao.error';
import { ErroConflitoError } from '../../errors/erro-conflito.error';

describe('Lecionamento Service - Testes unitários', () => {
  let lecionamentoRepository: jest.Mocked<ILecionamentoRepository>
  let semestreRepository: jest.Mocked<ISemestreRepository>
  let disciplinaRepository: jest.Mocked<IDisciplinaRepository>
  let professorRepository: jest.Mocked<IProfessorRepository>
  let service: LecionamentoService

  const disciplina = DisciplinaMother.criar()
  const professor = ProfessorMother.criar()
  const semestre = SemestreMother.criar()
  const lecionamento = LecionamentoMother.criar()

  beforeEach(() => {
    lecionamentoRepository = LecionamentoMother.criarRepositoryMock()
    semestreRepository = SemestreMother.criarRepositoryMock()
    disciplinaRepository = DisciplinaMother.criarRepositoryMock()
    professorRepository = ProfessorMother.criarRepositoryMock()

    service = new LecionamentoService(
      lecionamentoRepository,
      semestreRepository,
      disciplinaRepository,
      professorRepository,
    )
  })

  describe('cadastrar', () => {
    it('cadastra um lecionamento com código sequencial gerado automaticamente', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      semestreRepository.buscarPorCodigo.mockResolvedValue(semestre)
      lecionamentoRepository.buscarUltimoCodigoDoSemestreCurso.mockResolvedValue(null)
      lecionamentoRepository.buscar.mockResolvedValue([])
      // Act
      const criado = await service.cadastrar({
        codDisciplina: disciplina.codigo,
        matProfessor: professor.matricula,
        codSemestre: semestre.codigo,
        turno: 'Manhã',
        diaSemana: 'Seg',
      })
      // Assert
      expect(criado.codigo).toBe(`${semestre.codigo}.${disciplina.codCurso}.001`)
      expect(lecionamentoRepository.cadastrar).toHaveBeenCalledWith(criado)
    })

    it('gera código sequencial a partir do último lecionamento do semestre/curso', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      semestreRepository.buscarPorCodigo.mockResolvedValue(semestre)
      const ultimoCodigo = `${semestre.codigo}.${disciplina.codCurso}.002`
      lecionamentoRepository.buscarUltimoCodigoDoSemestreCurso.mockResolvedValue(ultimoCodigo)
      lecionamentoRepository.buscar.mockResolvedValue([])
      // Act
      const criado = await service.cadastrar({
        codDisciplina: disciplina.codigo,
        matProfessor: professor.matricula,
        codSemestre: semestre.codigo,
        turno: 'Tarde',
        diaSemana: 'Qua',
      })
      // Assert
      expect(criado.codigo).toBe(`${semestre.codigo}.${disciplina.codCurso}.003`)
    })

    it('cria o semestre automaticamente quando ele não existe', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      semestreRepository.buscarPorCodigo.mockResolvedValue(null)
      lecionamentoRepository.buscarUltimoCodigoDoSemestreCurso.mockResolvedValue(null)
      lecionamentoRepository.buscar.mockResolvedValue([])
      // Act
      await service.cadastrar({
        codDisciplina: disciplina.codigo,
        matProfessor: professor.matricula,
        codSemestre: '2026.2',
        turno: 'Noite',
        diaSemana: 'Sex',
      })
      // Assert
      expect(semestreRepository.cadastrar).toHaveBeenCalled()
    })

    it('lança ErroConflitoError quando já existe um lecionamento idêntico', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      semestreRepository.buscarPorCodigo.mockResolvedValue(semestre)
      lecionamentoRepository.buscarUltimoCodigoDoSemestreCurso.mockResolvedValue(null)
      lecionamentoRepository.buscar.mockResolvedValue([lecionamento])
      // Act & Assert
      await expect(
        service.cadastrar({
          codDisciplina: disciplina.codigo,
          matProfessor: professor.matricula,
          codSemestre: semestre.codigo,
          turno: 'Manhã',
          diaSemana: 'Seg',
        }),
      ).rejects.toThrow(ErroConflitoError)
      expect(lecionamentoRepository.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroValidacaoError quando o código do semestre tem formato inválido', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      semestreRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(
        service.cadastrar({
          codDisciplina: disciplina.codigo,
          matProfessor: professor.matricula,
          codSemestre: 'invalido',
          turno: 'Manhã',
          diaSemana: 'Seg',
        }),
      ).rejects.toThrow(ErroValidacaoError)
      expect(lecionamentoRepository.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroNaoEncontradoError quando a disciplina não existe', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(
        service.cadastrar({
          codDisciplina: '999.999',
          matProfessor: professor.matricula,
          codSemestre: semestre.codigo,
          turno: 'Manhã',
          diaSemana: 'Seg',
        }),
      ).rejects.toThrow(ErroNaoEncontradoError)
      expect(lecionamentoRepository.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroNaoEncontradoError quando o professor não existe', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      professorRepository.buscarPorMatricula.mockResolvedValue(null)
      // Act & Assert
      await expect(
        service.cadastrar({
          codDisciplina: disciplina.codigo,
          matProfessor: '9999.999',
          codSemestre: semestre.codigo,
          turno: 'Manhã',
          diaSemana: 'Seg',
        }),
      ).rejects.toThrow(ErroNaoEncontradoError)
      expect(lecionamentoRepository.cadastrar).not.toHaveBeenCalled()
    })

    it('lança ErroValidacaoError quando o turno é inválido', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      semestreRepository.buscarPorCodigo.mockResolvedValue(semestre)
      lecionamentoRepository.buscarUltimoCodigoDoSemestreCurso.mockResolvedValue(null)
      // Act & Assert
      await expect(
        service.cadastrar({
          codDisciplina: disciplina.codigo,
          matProfessor: professor.matricula,
          codSemestre: semestre.codigo,
          turno: 'Vespertino',
          diaSemana: 'Seg',
        }),
      ).rejects.toThrow(ErroValidacaoError)
    })

    it('lança ErroValidacaoError quando o dia da semana é inválido', async () => {
      // Arrange
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      professorRepository.buscarPorMatricula.mockResolvedValue(professor)
      semestreRepository.buscarPorCodigo.mockResolvedValue(semestre)
      lecionamentoRepository.buscarUltimoCodigoDoSemestreCurso.mockResolvedValue(null)
      // Act & Assert
      await expect(
        service.cadastrar({
          codDisciplina: disciplina.codigo,
          matProfessor: professor.matricula,
          codSemestre: semestre.codigo,
          turno: 'Manhã',
          diaSemana: 'Dom',
        }),
      ).rejects.toThrow(ErroValidacaoError)
    })
  })

  describe('buscar', () => {
    it('delega a busca para o repositório', async () => {
      // Arrange
      const lecionamentos = [lecionamento]
      lecionamentoRepository.buscar.mockResolvedValue(lecionamentos)
      // Act
      const resultado = await service.buscar({ turno: 'Manhã' })
      // Assert
      expect(resultado).toBe(lecionamentos)
      expect(lecionamentoRepository.buscar).toHaveBeenCalledWith({ turno: 'Manhã' })
    })
  })

  describe('buscarPorCodigo', () => {
    it('retorna o lecionamento quando ele existe', async () => {
      // Arrange
      lecionamentoRepository.buscarPorCodigo.mockResolvedValue(lecionamento)
      // Act
      const resultado = await service.buscarPorCodigo(lecionamento.codigo)
      // Assert
      expect(resultado).toBe(lecionamento)
    })

    it('lança ErroNaoEncontradoError quando o lecionamento não existe', async () => {
      // Arrange
      lecionamentoRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(service.buscarPorCodigo('9999.9.999.999')).rejects.toThrow(ErroNaoEncontradoError)
    })
  })

  describe('editar', () => {
    it('atualiza os dados de um lecionamento existente sem alterar o código', async () => {
      // Arrange
      lecionamentoRepository.buscarPorCodigo.mockResolvedValue(lecionamento)
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      lecionamentoRepository.buscar.mockResolvedValue([])
      // Act
      const atualizado = await service.editar(lecionamento.codigo, { turno: 'Noite' })
      // Assert
      expect(atualizado.turno).toBe('Noite')
      expect(atualizado.codigo).toBe(lecionamento.codigo)
      expect(lecionamentoRepository.editar).toHaveBeenCalledWith(lecionamento.codigo, atualizado)
    })

    it('recalcula o código quando o codSemestre é alterado', async () => {
      // Arrange
      const novoSemestre = SemestreMother.criar({ ano: 2025, semestre: 2 })
      lecionamentoRepository.buscarPorCodigo.mockResolvedValue(lecionamento)
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      semestreRepository.buscarPorCodigo.mockResolvedValue(novoSemestre)
      lecionamentoRepository.buscar.mockResolvedValue([])
      lecionamentoRepository.buscarUltimoCodigoDoSemestreCurso.mockResolvedValue(null)
      // Act
      const atualizado = await service.editar(lecionamento.codigo, { codSemestre: novoSemestre.codigo })
      // Assert
      expect(atualizado.codigo).toBe(`${novoSemestre.codigo}.${disciplina.codCurso}.001`)
      expect(lecionamentoRepository.editar).toHaveBeenCalledWith(lecionamento.codigo, atualizado)
    })

    it('recalcula o código quando codDisciplina pertence a outro curso', async () => {
      // Arrange
      const outroCurso = '002'
      const outraDisciplina = DisciplinaMother.criar({ codigo: '002.001', codCurso: outroCurso })
      lecionamentoRepository.buscarPorCodigo.mockResolvedValue(lecionamento)
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(outraDisciplina)
      lecionamentoRepository.buscar.mockResolvedValue([])
      lecionamentoRepository.buscarUltimoCodigoDoSemestreCurso.mockResolvedValue(null)
      // Act
      const atualizado = await service.editar(lecionamento.codigo, { codDisciplina: outraDisciplina.codigo })
      // Assert
      expect(atualizado.codigo).toBe(`${semestre.codigo}.${outroCurso}.001`)
      expect(lecionamentoRepository.editar).toHaveBeenCalledWith(lecionamento.codigo, atualizado)
    })

    it('lança ErroConflitoError quando a edição resultaria em lecionamento idêntico a outro', async () => {
      // Arrange
      const outro = LecionamentoMother.criar({ codigo: 'outro-codigo', turno: 'Noite' })
      lecionamentoRepository.buscarPorCodigo.mockResolvedValue(lecionamento)
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina)
      lecionamentoRepository.buscar.mockResolvedValue([outro])
      // Act & Assert
      await expect(
        service.editar(lecionamento.codigo, { turno: 'Noite' }),
      ).rejects.toThrow(ErroConflitoError)
      expect(lecionamentoRepository.editar).not.toHaveBeenCalled()
    })

    it('valida existência da nova disciplina quando codDisciplina é alterado', async () => {
      // Arrange
      lecionamentoRepository.buscarPorCodigo.mockResolvedValue(lecionamento)
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(
        service.editar(lecionamento.codigo, { codDisciplina: '999.999' }),
      ).rejects.toThrow(ErroNaoEncontradoError)
    })

    it('lança ErroNaoEncontradoError ao editar um lecionamento que não existe', async () => {
      // Arrange
      lecionamentoRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(
        service.editar('9999.9.999.999', { turno: 'Tarde' }),
      ).rejects.toThrow(ErroNaoEncontradoError)
    })
  })

  describe('excluir', () => {
    it('remove um lecionamento existente', async () => {
      // Arrange
      lecionamentoRepository.buscarPorCodigo.mockResolvedValue(lecionamento)
      // Act
      await service.excluir(lecionamento.codigo)
      // Assert
      expect(lecionamentoRepository.excluir).toHaveBeenCalledWith(lecionamento.codigo)
    });

    it('lança ErroNaoEncontradoError ao excluir um lecionamento que não existe', async () => {
      // Arrange
      lecionamentoRepository.buscarPorCodigo.mockResolvedValue(null)
      // Act & Assert
      await expect(service.excluir('9999.9.999.999')).rejects.toThrow(ErroNaoEncontradoError)
      expect(lecionamentoRepository.excluir).not.toHaveBeenCalled()
    })
  })
})
