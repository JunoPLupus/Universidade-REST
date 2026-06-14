import { gerarProximoCodigo } from './gerar-proximo-codigo.util';

describe('gerarProximoCodigo - Testes unitários', () => {
  it('retorna "001" quando não há código anterior e nenhum prefixo é informado', () => {
    expect(gerarProximoCodigo(null)).toBe('001');
  });

  it('incrementa o sequencial do código anterior', () => {
    expect(gerarProximoCodigo('001')).toBe('002');
    expect(gerarProximoCodigo('009')).toBe('010');
    expect(gerarProximoCodigo('099')).toBe('100');
  });

  it('retorna "<prefixo>001" quando não há código anterior e um prefixo é informado', () => {
    expect(gerarProximoCodigo(null, '001.')).toBe('001.001');
  });

  it('incrementa apenas o sequencial após o prefixo', () => {
    expect(gerarProximoCodigo('001.001', '001.')).toBe('001.002');
    expect(gerarProximoCodigo('001.009', '001.')).toBe('001.010');
  });

  it('respeita a quantidade de dígitos informada', () => {
    expect(gerarProximoCodigo(null, '', 2)).toBe('01');
    expect(gerarProximoCodigo('01', '', 2)).toBe('02');
  });
});
