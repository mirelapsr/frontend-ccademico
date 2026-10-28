/** Props de animação compartilhadas pelos gráficos; desliga se o usuário pediu menos movimento. */
const reduzirMovimento =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const ANIMACAO_GRAFICO = {
  isAnimationActive: !reduzirMovimento,
  animationDuration: 700,
  animationEasing: "ease-out",
} as const;
