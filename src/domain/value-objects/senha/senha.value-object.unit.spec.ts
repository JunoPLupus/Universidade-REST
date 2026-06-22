import { Senha } from './senha.value-object';
import { ErroValidacaoError } from '../../errors/erro-validacao.error';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$hashMockado'),
}))

describe('Testes unitarios do Value Object: Senha', () => {
  it('cria a Senha com o valor hasheado quando a senha e valida', async () => {
    const senha = await Senha.criar('senha123')
    expect(senha.valor).toBe('$2b$10$hashMockado')
  })

  it('nao armazena a senha em texto plano', async () => {
    const senha = await Senha.criar('senha123')
    expect(senha.valor).not.toBe('senha123')
  })

  it('fromHash cria a Senha diretamente a partir de um hash existente', () => {
    const hash = '$2b$10$algumHashExistente'
    const senha = Senha.fromHash(hash)
    expect(senha.valor).toBe(hash)
  })

  it.each([
    { cenario: 'menor que o minimo (5 caracteres)', valor: 'abc12' },
    { cenario: 'string vazia', valor: '' },
    { cenario: 'maior que o maximo (65 caracteres)', valor: 'a'.repeat(65) },
  ])('lanca ErroValidacaoError quando a senha e $cenario', async ({ valor }) => {
    await expect(Senha.criar(valor)).rejects.toThrow(ErroValidacaoError)
  })
})
