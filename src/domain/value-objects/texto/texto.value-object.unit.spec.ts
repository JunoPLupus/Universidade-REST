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

  it('lança ErroValidacaoError quando o texto (após trim) é menor que o mínimo', () => {
    expect(() => new Texto('   abc   ', mensagemInvalida, 5)).toThrow(ErroValidacaoError)
    expect(() => new Texto('   abc   ', mensagemInvalida, 5)).toThrow(mensagemInvalida)
  })

  it('lança ErroValidacaoError quando o texto (após trim) é maior que o máximo', () => {
    expect(() => new Texto('abcdefghij', mensagemInvalida, undefined, 5)).toThrow(ErroValidacaoError)
    expect(() => new Texto('abcdefghij', mensagemInvalida, undefined, 5)).toThrow(mensagemInvalida)
  })

  it('considera apenas os espaços nas extremidades ao validar o tamanho', () => {
    const texto = new Texto('  abcde  ', mensagemInvalida, 5)

    expect(texto.valor).toBe('abcde')
  })
})
