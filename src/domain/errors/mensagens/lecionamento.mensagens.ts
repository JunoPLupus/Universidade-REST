/**
 * Mensagens de erro relacionadas a Lecionamento.
 */
export const lecionamentoMensagens = {
  naoEncontrado: (codigo: string): string =>
    `Lecionamento com código '${codigo}' não encontrado.`,

  turnoInvalido: (): string =>
    `O turno deve ser 'Manhã', 'Tarde' ou 'Noite'.`,

  diaSemanaInvalido: (): string =>
    `O dia da semana deve ser 'Seg', 'Ter', 'Qua', 'Qui', 'Sex' ou 'Sab'.`,

  disciplinaComLecionamento: (codigo: string): string =>
    `Não é possível excluir a disciplina '${codigo}' pois ela possui lecionamentos vinculados.`,

  professorComLecionamento: (matricula: string): string =>
    `Não é possível excluir o professor '${matricula}' pois ele possui lecionamentos vinculados.`,
}
