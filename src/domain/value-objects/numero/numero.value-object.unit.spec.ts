import { Numero } from './numero.value-object';
import { ErroValidacaoError } from '../../errors/erro-validacao.error';

describe('Numero Value Object - Testes unitários', () => {
  const mensagemInvalida = 'Número inválido.'

  it('cria o Numero normalmente quando o valor está dentro do intervalo', () => {
    const numero = new Numero(8, mensagemInvalida, 3, 12)

    expect(numero.valor).toBe(8)
  })

  it('cria o Numero normalmente quando nenhum limite é informado', () => {
    const numero = new Numero(-5, mensagemInvalida)

    expect(numero.valor).toBe(-5)
  })

  it('cria o Numero quando o valor é exatamente igual ao mínimo ou ao máximo', () => {
    expect(new Numero(3, mensagemInvalida, 3, 12).valor).toBe(3)
    expect(new Numero(12, mensagemInvalida, 3, 12).valor).toBe(12)
  })

  it.each([
    { cenario: 'menor que o mínimo', valor: 2, minimo: 3, maximo: undefined },
    { cenario: 'maior que o máximo', valor: 13, minimo: undefined, maximo: 12 }
  ])('lança ErroValidacaoError quando o valor é $cenario', ({ valor, minimo, maximo }) => {
    expect(() => new Numero(valor, mensagemInvalida, minimo, maximo)).toThrow(ErroValidacaoError)
    expect(() => new Numero(valor, mensagemInvalida,  minimo, maximo)).toThrow(mensagemInvalida)
  })
})
