import { Email } from './email.value-object';
import { ErroValidacaoError } from '../../errors/erro-validacao.error';

describe('Testes unitarios do Value Object: Email', () => {
  it('cria o Email normalmente quando o valor e um e-mail valido', () => {
    const email = new Email('usuario@email.com')
    expect(email.valor).toBe('usuario@email.com')
  })

  it('preserva o valor original sem alteracoes', () => {
    const email = new Email('ADMIN@Universidade.EDU.BR')
    expect(email.valor).toBe('ADMIN@Universidade.EDU.BR')
  })

  it.each([
    { cenario: 'sem arroba', valor: 'usuarioemail.com' },
    { cenario: 'sem dominio', valor: 'usuario@' },
    { cenario: 'sem usuario', valor: '@email.com' },
    { cenario: 'string vazia', valor: '' },
  ])('lanca ErroValidacaoError quando o e-mail e $cenario', ({ valor }) => {
    expect(() => new Email(valor)).toThrow(ErroValidacaoError)
  })
})
