import type { Card } from "./hand";

export function insertHexDigit(original: number, newDigit: number): number {
  // Shift the original number left by 4 bits
  let shiftedOriginal = original * 16;

  // Add the new digit to the shifted number
  let result = shiftedOriginal + newDigit;

  return result;
}

export function groupCardsByValue(cards: Array<Card>): Record<string, number> {
  const cardsValue = cards.map((card) => card.value);
  const grouped = cardsValue.reduce(
    (acc, value) => {
      if (!acc[value]) {
        acc[value] = 1;
      } else {
        acc[value]++;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return grouped;
}
