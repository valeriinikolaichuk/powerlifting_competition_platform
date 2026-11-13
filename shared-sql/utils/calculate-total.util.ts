export function calculateTotal(
  squatValue: number | string | null,
  benchPressValue: number | string | null,
  deadLiftValue: number | string | null,
): number {

  const squat = Number(squatValue) || 0;
  const benchPress = Number(benchPressValue) || 0;
  const deadLift = Number(deadLiftValue) || 0;

  return squat + benchPress + deadLift;
}