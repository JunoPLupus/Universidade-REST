import { DisciplinaService } from './disciplina.service';
import { IDisciplinaRepository } from '../repositories/disciplina.repository';
import { ICursoRepository } from '../repositories/curso.repository';
import { ErroNaoEncontrado } from '../errors/erro-nao-encontrado';
import { ErroConflito } from '../errors/erro-conflito';
import { ErroValidacao } from '../errors/erro-validacao';
import { CursoMother } from '../../../tests/test-helpers/curso.mother';
import { DisciplinaMother } from '../../../tests/test-helpers/disciplina.mother';

describe('Disciplina Service - Testes unitários', () => {
  let disciplinaRepository: jest.Mocked<IDisciplinaRepository>;
  let cursoRepository: jest.Mocked<ICursoRepository>;
  let service: DisciplinaService;

  beforeEach(() => {
    disciplinaRepository = {
      buscar: jest.fn(),
      buscarPorCodigo: jest.fn(),
      buscarPorNomeECurso: jest.fn(),
      buscarUltimoCodigoDoCurso: jest.fn(),
      cadastrar: jest.fn(),
      editar: jest.fn(),
      excluir: jest.fn(),
    };

    cursoRepository = {
      buscar: jest.fn(),
      buscarPorCodigo: jest.fn(),
      buscarPorNome: jest.fn(),
      buscarUltimoCodigo: jest.fn(),
      cadastrar: jest.fn(),
      editar: jest.fn(),
      excluir: jest.fn(),
    };

    service = new DisciplinaService(disciplinaRepository, cursoRepository);
  });

  describe('cadastrar', () => {
    it('cadastra uma disciplina com o código "<codCurso>.001" quando o curso não tem disciplinas', async () => {
      const curso = CursoMother.criar({ codigo: '001', periodos: 8 });
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso);
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(null);
      disciplinaRepository.buscarUltimoCodigoDoCurso.mockResolvedValue(null);

      const disciplina = await service.cadastrar({
        codCurso: '001',
        periodo: 3,
        nome: 'Cálculo I',
        cargaHoraria: 60,
      });

      expect(disciplina.codigo).toBe('001.001');
      expect(disciplinaRepository.cadastrar).toHaveBeenCalledWith(disciplina);
    });

    it('gera o próximo código sequencial a partir do último código cadastrado no curso', async () => {
      const curso = CursoMother.criar({ codigo: '001', periodos: 8 });
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso);
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(null);
      disciplinaRepository.buscarUltimoCodigoDoCurso.mockResolvedValue('001.002');

      const disciplina = await service.cadastrar({
        codCurso: '001',
        periodo: 3,
        nome: 'Álgebra Linear',
        cargaHoraria: 60,
      });

      expect(disciplina.codigo).toBe('001.003');
    });

    it('lança ErroNaoEncontrado quando o curso informado não existe', async () => {
      cursoRepository.buscarPorCodigo.mockResolvedValue(null);

      await expect(
        service.cadastrar({ codCurso: '999', periodo: 3, nome: 'Cálculo I', cargaHoraria: 60 }),
      ).rejects.toThrow(ErroNaoEncontrado);

      expect(disciplinaRepository.cadastrar).not.toHaveBeenCalled();
    });

    it('lança ErroValidacao quando o período excede o total de períodos do curso', async () => {
      const curso = CursoMother.criar({ codigo: '001', periodos: 4 });
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso);

      await expect(
        service.cadastrar({ codCurso: '001', periodo: 5, nome: 'Cálculo I', cargaHoraria: 60 }),
      ).rejects.toThrow(ErroValidacao);

      expect(disciplinaRepository.cadastrar).not.toHaveBeenCalled();
    });

    it('lança ErroConflito ao cadastrar uma disciplina com nome já usado no mesmo curso', async () => {
      const curso = CursoMother.criar({ codigo: '001', periodos: 8 });
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso);
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(DisciplinaMother.criar());

      await expect(
        service.cadastrar({ codCurso: '001', periodo: 3, nome: 'Cálculo I', cargaHoraria: 60 }),
      ).rejects.toThrow(ErroConflito);

      expect(disciplinaRepository.cadastrar).not.toHaveBeenCalled();
    });
  });

  describe('buscar', () => {
    it('delega a busca para o repositório', async () => {
      const disciplinas = [DisciplinaMother.criar()];
      disciplinaRepository.buscar.mockResolvedValue(disciplinas);

      const resultado = await service.buscar({ codCurso: '001' });

      expect(resultado).toBe(disciplinas);
      expect(disciplinaRepository.buscar).toHaveBeenCalledWith({ codCurso: '001' });
    });

    it('delega a busca para o repositório incluindo os filtros de cargaHoraria e periodo', async () => {
      const disciplinas = [DisciplinaMother.criar()];
      disciplinaRepository.buscar.mockResolvedValue(disciplinas);

      const resultado = await service.buscar({ cargaHoraria: 60, periodo: 3 });

      expect(resultado).toBe(disciplinas);
      expect(disciplinaRepository.buscar).toHaveBeenCalledWith({ cargaHoraria: 60, periodo: 3 });
    });
  });

  describe('buscarPorCodigo', () => {
    it('retorna a disciplina quando ela existe', async () => {
      const disciplina = DisciplinaMother.criar();
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina);

      const resultado = await service.buscarPorCodigo(disciplina.codigo);

      expect(resultado).toBe(disciplina);
    });

    it('lança ErroNaoEncontrado quando a disciplina não existe', async () => {
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(null);

      await expect(service.buscarPorCodigo('999.999')).rejects.toThrow(ErroNaoEncontrado);
    });
  });

  describe('editar', () => {
    it('atualiza os dados de uma disciplina existente', async () => {
      const disciplina = DisciplinaMother.criar();
      const curso = CursoMother.criar({ codigo: disciplina.codCurso, periodos: 8 });

      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina);
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso);
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(null);

      const atualizada = await service.editar(disciplina.codigo, {
        periodo: 4,
        nome: 'Cálculo I - Atualizado',
        cargaHoraria: 80,
      });

      expect(atualizada.nome).toBe('Cálculo I - Atualizado');
      expect(atualizada.cargaHoraria).toBe(80);
      expect(atualizada.codCurso).toBe(disciplina.codCurso);
      expect(disciplinaRepository.editar).toHaveBeenCalledWith(atualizada);
    });

    it('lança ErroNaoEncontrado ao editar uma disciplina que não existe', async () => {
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(null);

      await expect(
        service.editar('999.999', { periodo: 3, nome: 'Inexistente', cargaHoraria: 60 }),
      ).rejects.toThrow(ErroNaoEncontrado);
    });

    it('lança ErroValidacao quando o novo período excede o total de períodos do curso', async () => {
      const disciplina = DisciplinaMother.criar();
      const curso = CursoMother.criar({ codigo: disciplina.codCurso, periodos: 4 });

      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina);
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso);

      await expect(
        service.editar(disciplina.codigo, { periodo: 5, nome: disciplina.nome, cargaHoraria: 60 }),
      ).rejects.toThrow(ErroValidacao);

      expect(disciplinaRepository.editar).not.toHaveBeenCalled();
    });

    it('lança ErroConflito ao renomear para um nome já usado por outra disciplina do mesmo curso', async () => {
      const disciplina = DisciplinaMother.criar({ codigo: '001.001', nome: 'Cálculo I' });
      const outraDisciplina = DisciplinaMother.criar({ codigo: '001.002', nome: 'Álgebra Linear' });
      const curso = CursoMother.criar({ codigo: disciplina.codCurso, periodos: 8 });

      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina);
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso);
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(outraDisciplina);

      await expect(
        service.editar(disciplina.codigo, { periodo: 3, nome: 'Álgebra Linear', cargaHoraria: 60 }),
      ).rejects.toThrow(ErroConflito);

      expect(disciplinaRepository.editar).not.toHaveBeenCalled();
    });

    it('permite manter o nome atual da própria disciplina', async () => {
      const disciplina = DisciplinaMother.criar();
      const curso = CursoMother.criar({ codigo: disciplina.codCurso, periodos: 8 });

      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina);
      cursoRepository.buscarPorCodigo.mockResolvedValue(curso);
      disciplinaRepository.buscarPorNomeECurso.mockResolvedValue(disciplina);

      const atualizada = await service.editar(disciplina.codigo, {
        periodo: disciplina.periodo,
        nome: disciplina.nome,
        cargaHoraria: 80,
      });

      expect(atualizada.cargaHoraria).toBe(80);
    });
  });

  describe('excluir', () => {
    it('remove uma disciplina existente', async () => {
      const disciplina = DisciplinaMother.criar();
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(disciplina);

      await service.excluir(disciplina.codigo);

      expect(disciplinaRepository.excluir).toHaveBeenCalledWith(disciplina.codigo);
    });

    it('lança ErroNaoEncontrado ao excluir uma disciplina que não existe', async () => {
      disciplinaRepository.buscarPorCodigo.mockResolvedValue(null);

      await expect(service.excluir('999.999')).rejects.toThrow(ErroNaoEncontrado);

      expect(disciplinaRepository.excluir).not.toHaveBeenCalled();
    });
  });
});
