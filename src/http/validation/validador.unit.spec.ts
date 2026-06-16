import { Validador } from './validador';
import { ErroDadosInvalidosError } from '../../domain/errors/erro-dados-invalidos.error';

describe('Validador - Testes unitários', () => {
  describe('texto', () => {
    it('não acumula erro quando o campo é uma string', () => {
      expect(() => Validador.para({ nome: 'Cálculo I' }).texto('nome').validar()).not.toThrow()
    })

    it('lança ErroDadosInvalidosError informando que o campo é obrigatório quando ausente', () => {
      expect(() => Validador.para({}).texto('nome').validar()).toThrow(ErroDadosInvalidosError)
      expect(() => Validador.para({}).texto('nome').validar()).toThrow("O campo 'nome' é obrigatório.")
    })

    it('lança ErroDadosInvalidosError informando que o campo é obrigatório quando nulo', () => {
      expect(() => Validador.para({ nome: null }).texto('nome').validar()).toThrow(
        "O campo 'nome' é obrigatório.",
      )
    })

    it('lança ErroDadosInvalidosError informando o tipo esperado quando o campo não é uma string', () => {
      expect(() => Validador.para({ nome: 123 }).texto('nome').validar()).toThrow(ErroDadosInvalidosError)
      expect(() => Validador.para({ nome: 123 }).texto('nome').validar()).toThrow(
        "O campo 'nome' deve ser um texto.",
      )
    })
  })

  describe('numero', () => {
    it('não acumula erro quando o campo é um número', () => {
      expect(() => Validador.para({ periodos: 8 }).numero('periodos').validar()).not.toThrow()
    })

    it('lança ErroDadosInvalidosError informando que o campo é obrigatório quando ausente', () => {
      expect(() => Validador.para({}).numero('periodos').validar()).toThrow(ErroDadosInvalidosError)
      expect(() => Validador.para({}).numero('periodos').validar()).toThrow(
        "O campo 'periodos' é obrigatório.",
      )
    })

    it('lança ErroDadosInvalidosError informando o tipo esperado quando o campo não é um número', () => {
      expect(() => Validador.para({ periodos: '8' }).numero('periodos').validar()).toThrow(
        "O campo 'periodos' deve ser um número.",
      )
    })

    it('lança ErroDadosInvalidosError informando o tipo esperado quando o campo é NaN', () => {
      expect(() => Validador.para({ periodos: NaN }).numero('periodos').validar()).toThrow(
        "O campo 'periodos' deve ser um número.",
      )
    })
  })

  describe('validar', () => {
    it('não lança erro quando o corpo da requisição é válido', () => {
      expect(() =>
          Validador.para({ nome: 'Cálculo I', periodos: 8 })
              .texto('nome')
              .numero('periodos')
              .validar()).not.toThrow()
    })

    it('acumula todos os erros encontrados em uma única mensagem', () => {
      expect(() => Validador.para({}).texto('nome').numero('periodos').validar()).toThrow(
        "O campo 'nome' é obrigatório. O campo 'periodos' é obrigatório.",
      )
    })

    it('trata um corpo de requisição que não é um objeto como se todos os campos estivessem ausentes', () => {
      expect(() => Validador.para(null).texto('nome').validar()).toThrow("O campo 'nome' é obrigatório.")
      expect(() => Validador.para('texto').numero('periodos').validar()).toThrow(
        "O campo 'periodos' é obrigatório.",
      )
    })
  })
})
