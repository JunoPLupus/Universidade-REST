export const usuarioMensagens = {
  emailInvalido: (email: string): string =>
    `Email '${email}' invalido! Verifique o formato e tente novamente.`,

  emailJaEmUso: (): string => 'Este e-mail ja esta em uso.',

  nomeInvalido: (min: number, max: number): string =>
    `O nome deve ter entre ${min} e ${max} caracteres.`,

  cpfInvalido: (): string => 'Este CPF e invalido.',

  cpfJaEmUso: (): string => 'Este CPF ja esta em uso.',

  senhaInvalida: (min: number, max: number): string =>
    `A senha deve ter entre ${min} e ${max} caracteres.`,
}
