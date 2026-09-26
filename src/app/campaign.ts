// Visual countdown only; registration stays open throughout every cycle.
export const COUNTDOWN_SECONDS = 15 * 60;

export function getCountdownRemaining(startedAt: number, now: number): number {
  const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));
  return COUNTDOWN_SECONDS - (elapsed % COUNTDOWN_SECONDS);
}
