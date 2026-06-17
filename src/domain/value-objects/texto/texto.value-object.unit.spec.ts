import { Texto } from './texto.value-object';
import { ErroValidacaoError } from '../../errors/erro-validacao.error';

describe('Texto Value Object - Testes unitários', () => {
  const mensagemInvalida = 'Texto inválido.'

  it('cria o Texto com o valor já aparado (trim) quando dentro dos limites', () => {
    const texto = new Texto('  Ciência da Computação  ', mensagemInvalida, 5, 100)

    expect(texto.valor).toBe('Ciência da Computação')
  })

  it('cria o Texto normalmente quando nenhum limite é informado', () => {
    const texto = new Texto('  qualquer coisa  ', mensagemInvalida)

    expect(texto.valor).toBe('qualquer coisa')
  })

  it.each([
    { cenario: 'menor que o mínimo', texto: '   abc   ', minimo: 5, maximo: undefined },
    { cenario: 'maior que o máximo', texto: 'abcdefghij', minimo: undefined, maximo: 5 }
  ])('lança ErroValidacaoError quando o texto é $cenario', ({ texto, minimo, maximo }) => {
    expect(() => new Texto(texto, mensagemInvalida, minimo, maximo)).toThrow(ErroValidacaoError)
    expect(() => new Texto(texto, mensagemInvalida, minimo, maximo)).toThrow(mensagemInvalida)
  })

  it('considera apenas os espaços nas extremidades ao validar o tamanho', () => {
    const texto = new Texto('  abcde  ', mensagemInvalida, 5)

    expect(texto.valor).toBe('abcde')
  })
})
