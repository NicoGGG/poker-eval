import type { Card, CardFigure, CardRaw, CardSuit, CardValue } from "./hand";

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

/** Converts a card from a string to a Card object
 * @param cardRaw - A string representing a card
 *
 * @returns A Card object
 *
 * @example
 * const card = convertCard("2H");
 * console.log(card); // { suit: "H", value: 0x2 }
 */
export function convertCard(cardRaw: CardRaw): Card {
  const suit = cardRaw[1].toUpperCase() as CardSuit;
  const value = cardRaw[0].toUpperCase() as CardFigure;

  if (!["H", "D", "C", "S"].includes(suit)) {
    throw new Error(`Invalid suit: ${suit}`);
  }
  if (
    !["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"].includes(
      value,
    )
  ) {
    throw new Error(`Invalid value: ${value}`);
  }

  const valueHex = convertCardValue(value);
  return { suit, value: valueHex };
}

export function shuffleArray(array: Array<any>) {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function convertCardValue(value: CardFigure): CardValue {
  switch (value) {
    case "2":
      return 0x2;
    case "3":
      return 0x3;
    case "4":
      return 0x4;
    case "5":
      return 0x5;
    case "6":
      return 0x6;
    case "7":
      return 0x7;
    case "8":
      return 0x8;
    case "9":
      return 0x9;
    case "T":
      return 0xa;
    case "J":
      return 0xb;
    case "Q":
      return 0xc;
    case "K":
      return 0xd;
    case "A":
      return 0xe;
  }
}
