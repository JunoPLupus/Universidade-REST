import { Cpf } from './cpf.value-object';
import { ErroValidacaoError } from '../../errors/erro-validacao.error';

describe('Testes unitarios do Value Object: Cpf', () => {
  it('cria o Cpf e normaliza para o formato 000.000.000-00 quando recebe CPF sem pontuacao', () => {
    const cpf = new Cpf('52998224725')
    expect(cpf.valor).toBe('529.982.247-25')
  })

  it('cria o Cpf normalmente quando ja recebe CPF no formato 000.000.000-00', () => {
    const cpf = new Cpf('529.982.247-25')
    expect(cpf.valor).toBe('529.982.247-25')
  })

  it.each([
    { cenario: 'todos os digitos iguais', valor: '111.111.111-11' },
    { cenario: 'digitos verificadores incorretos', valor: '123.456.789-00' },
    { cenario: 'string vazia', valor: '' },
    { cenario: 'formato invalido', valor: 'abc.def.ghi-jk' },
  ])('lanca ErroValidacaoError quando o CPF tem $cenario', ({ valor }) => {
    expect(() => new Cpf(valor)).toThrow(ErroValidacaoError)
  })
})
