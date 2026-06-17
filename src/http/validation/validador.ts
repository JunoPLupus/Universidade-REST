import { ErroDadosInvalidosError } from '../../domain/errors/erro-dados-invalidos.error';
import { validacaoMensagens } from './validacao.mensagens';

/**
 * Valida o formato do corpo (`req.body`) de uma requisição antes de qualquer
 * regra de negócio ser avaliada.
 *
 * Diferente das entidades e Value Objects do domínio (que validam
 * invariantes de negócio e lançam `ErroValidacaoError`/400), o `Validador`
 * checa apenas se os campos esperados estão presentes e têm o tipo correto —
 * é a primeira barreira da borda HTTP. Problemas encontrados aqui são
 * acumulados e reportados de uma vez via `ErroDadosInvalidosError` (422).
 *
 * @example
 * Validador.para(req.body).texto('nome').numero('periodos').validar();
 * const dto = req.body as CursoCadastroDTO;
 */
export class Validador {
  private readonly erros: string[] = []

  private constructor(private readonly dados: Record<string, unknown>) {}

  /** Inicia a validação a partir do corpo da requisição. */
  static para(dados: unknown): Validador {
    const objeto = typeof dados === 'object' && dados !== null ? (dados as Record<string, unknown>) : {}
    return new Validador(objeto)
  }

  /** Verifica se `campo` está presente e é uma string. */
  texto(campo: string): this {
    const valor = this.dados[campo]

    if (valor === undefined || valor === null) {
      this.erros.push(validacaoMensagens.campoObrigatorio(campo))
    } else if (typeof valor !== 'string') {
      this.erros.push(validacaoMensagens.campoDeveSerTexto(campo))
    }

    return this
  }

  /** Verifica se `campo` está presente e é um número (rejeita `NaN`). */
  numero(campo: string): this {
    const valor = this.dados[campo]

    if (valor === undefined || valor === null) {
      this.erros.push(validacaoMensagens.campoObrigatorio(campo))
    } else if (typeof valor !== 'number' || Number.isNaN(valor)) {
      this.erros.push(validacaoMensagens.campoDeveSerNumero(campo))
    }

    return this
  }

  /**
   * Verifica o tipo de `campo` apenas se ele estiver presente no corpo —
   * usado em edições parciais, onde o campo pode ser omitido.
   */
  textoOpcional(campo: string): this {
    const valor = this.dados[campo]

    if (valor === undefined || valor === null) {
      return this
    }

    if (typeof valor !== 'string') {
      this.erros.push(validacaoMensagens.campoDeveSerTexto(campo))
    }

    return this
  }

  /**
   * Verifica o tipo de `campo` apenas se ele estiver presente no corpo —
   * usado em edições parciais, onde o campo pode ser omitido.
   */
  numeroOpcional(campo: string): this {
    const valor = this.dados[campo]

    if (valor === undefined || valor === null) {
      return this
    }

    if (typeof valor !== 'number' || Number.isNaN(valor)) {
      this.erros.push(validacaoMensagens.campoDeveSerNumero(campo))
    }

    return this
  }

  /**
   * Lança `ErroDadosInvalidosError` (422) com todos os problemas encontrados,
   * caso existam. Não faz nada se o corpo for válido.
   */
  validar(): void {
    if (this.erros.length > 0) {
      throw new ErroDadosInvalidosError(this.erros.join(' '))
    }
  }
}
