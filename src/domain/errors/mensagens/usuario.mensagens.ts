export const usuarioMensagens = {
    emailInvalido : (email : string): string => `Email '${email}' inválido! Verifique o formato e tente novamente.`,

    nomeInvalido: (min: number, max: number): string =>
        `O nome deve ter entre ${min} e ${max} caracteres.`,

    cpfInvalido: (): string =>
        `Este CPF é inválido.`,

    senhaInvalida: (min: number, max: number): string =>
        `A senha deve ter entre ${min} e ${max} caracteres.`,
}