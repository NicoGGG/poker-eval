import { groupCardsByValue, insertHexDigit } from "./utils";

export const deck: Array<CardRaw> = [
  "2H",
  "2D",
  "2C",
  "2S",
  "3H",
  "3D",
  "3C",
  "3S",
  "4H",
  "4D",
  "4C",
  "4S",
  "5H",
  "5D",
  "5C",
  "5S",
  "6H",
  "6D",
  "6C",
  "6S",
  "7H",
  "7D",
  "7C",
  "7S",
  "8H",
  "8D",
  "8C",
  "8S",
  "9H",
  "9D",
  "9C",
  "9S",
  "TH",
  "TD",
  "TC",
  "TS",
  "JH",
  "JD",
  "JC",
  "JS",
  "QH",
  "QD",
  "QC",
  "QS",
  "KH",
  "KD",
  "KC",
  "KS",
  "AH",
  "AD",
  "AC",
  "AS",
];

export type HandStrength = number;
type HandValue =
  | 0x0 // High card
  | 0x1 // Pair
  | 0x2 // Double pair
  | 0x3 // Three of a kind
  | 0x4 // Straight
  | 0x5 // Flush
  | 0x6 // Full house
  | 0x7 // Four of a kind
  | 0x8; // Straight flush

/** Mapping of hand values to the number of high cards required to break a tie
 *
 *  For example, a double pair (0x2) only has 1 high card left to break a tie
 *  while a pair (0x1) has 3 high cards left to break a tie
 *  High card (0x0) however, has 5 high cards left to break a tie
 * */
const highCardsMapping: Record<HandValue, number> = {
  0x0: 5,
  0x1: 3,
  0x2: 1,
  0x3: 2,
  0x4: 5,
  0x5: 5,
  0x6: 0,
  0x7: 1,
  0x8: 5,
};
export type CardValue =
  | 0x0
  | 0x1
  | 0x2
  | 0x3
  | 0x4
  | 0x5
  | 0x6
  | 0x7
  | 0x8
  | 0x9
  | 0xa
  | 0xb
  | 0xc
  | 0xd
  | 0xe;
export type CardSuit = "H" | "D" | "C" | "S";
export type CardFigure =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "T"
  | "J"
  | "Q"
  | "K"
  | "A";

export type Card = {
  suit: CardSuit;
  value: CardValue;
};

export type CardRaw = string;
export type PocketHand = Array<CardRaw>;
export type Board = Array<CardRaw>;
type HandStrengthReturn = {
  handValue: HandValue;
  handCardsValue: Array<CardValue>; // The values of the cards that make up the hand (e.g. the pair, the trips, etc.) Always sorted in descending order and of length 2. If there is only one card, the second value is 0x0
  remainingCardsValue: Array<CardValue>; // The values of the cards that make up the remaining cards. Always sorted in descending order and of length 5. If there are less than 5 cards, the remaining values are 0x0
  allCards: Array<Card>;
};

/**
 * Find the best hand given a set of cards
 *
 * @param cards - An array of Card objects
 * @returns A HandStrengthHex representing the best hand: 8 hex digits representing in order the hand value, the value of the cards that make up the hand, and the high cards
 *
 * @example
 * const cards: Array<Card> = [
 *  { suit: "H", value: 0x2 },
 *  { suit: "D", value: 0x3 },
 *  { suit: "C", value: 0x4 },
 *  { suit: "S", value: 0x5 },
 *  { suit: "H", value: 0x6 },
 *  { suit: "S", value: 0x7 },
 *  { suit: "C", value: 0x8 },
 *  ];
 *  const result: HandStrengthHex = findBestHand(cards);
 *  console.log(result); // 0x40087654 - Explanation: Straight from 4 to 8
 *
 *  @example
 *  const cards: Array<Card> = [
 *  { suit: "H", value: 0x2 },
 *  { suit: "D", value: 0x2 },
 *  { suit: "C", value: 0x4 },
 *  { suit: "S", value: 0x4 },
 *  { suit: "H", value: 0xA },
 *  { suit: "S", value: 0xA },
 *  { suit: "C", value: 0xK },
 *  const result: HandStrengthHex = findBestHand(cards);
 *  console.log(result); // 0x2A4K0000 - Explanation: Two pairs with Aces over 4s with King kicker
 */
export function findBestHand(cards: Array<Card>): HandStrength {
  cards.sort((a, b) => b.value - a.value);
  const { handValue, handCardsValue, remainingCardsValue } =
    findBestHandStrength(cards);
  const highCards = findHighCards(remainingCardsValue, handValue);
  if (handCardsValue.length !== 2) {
    throw new Error("Hand cards value must be of length 2");
  }
  if (highCards.length !== 5) {
    throw new Error("Remaining cards value must be of length 5");
  }
  let result = handValue as number;
  for (let i = 0; i < 2; i++) {
    result = insertHexDigit(result, handCardsValue[i]);
  }
  for (let i = 0; i < 5; i++) {
    result = insertHexDigit(result, highCards[i]);
  }

  return result;
}

function findBestHandStrength(cards: Array<Card>): HandStrengthReturn {
  // 1. Check for flush/straight. Remaining cards are the five cards of the flush/straight
  // 2. Check for quads. Remaining cards are the highest card excluding the quads
  // 3. Check for trips => full house
  // 4. Check for pair => two pairs

  const cardsAceLow = cards.map((card) => {
    return card.value === 0xe
      ? ({ value: 0x1, suit: card.suit } as Card)
      : card;
  });
  const straight = findStraight(cards) || findStraight(cardsAceLow);
  if (straight) {
    const flush = straight.allCards[0].suit;
    if (straight.allCards.every((card) => card.suit === flush)) {
      return {
        handValue: 0x8,
        handCardsValue: [0x0, 0x0],
        remainingCardsValue: straight.allCards.map((card) => card.value),
        allCards: straight.allCards,
      };
    }
    return straight;
  }

  const flush = findFlush(cards);
  if (flush) {
    return flush;
  }

  const quads = findQuads(cards);
  if (quads) {
    return quads;
  }

  const trips = findTrips(cards);
  if (trips) {
    const remainingCards = cards.filter(
      (card) => card.value !== trips.handCardsValue[0],
    );
    const pair = findPair(remainingCards);
    if (pair) {
      return {
        handValue: 0x6,
        handCardsValue: [trips.handCardsValue[0], pair.handCardsValue[0]],
        remainingCardsValue: pair.remainingCardsValue,
        allCards: trips.allCards,
      };
    }
    return trips;
  }

  const pair = findPair(cards);
  if (pair) {
    const remainingCards = cards.filter(
      (card) => card.value !== pair.handCardsValue[0],
    );
    const secondPair = findPair(remainingCards);
    if (secondPair) {
      return {
        handValue: 0x2,
        handCardsValue: [pair.handCardsValue[0], secondPair.handCardsValue[0]],
        remainingCardsValue: secondPair.remainingCardsValue,
        allCards: [...secondPair.allCards],
      };
    }
    return pair;
  }

  const highCards = findHighCards(
    cards.map((card) => card.value),
    0x0,
  );
  return {
    handValue: 0x0,
    handCardsValue: [0x0, 0x0],
    remainingCardsValue: highCards,
    allCards: cards.filter((card) => highCards.includes(card.value)),
  };
}

function findFlush(cards: Array<Card>): HandStrengthReturn | null {
  const suits = cards.map((card) => card.suit);
  const suitCount = suits.reduce(
    (acc, suit) => {
      if (acc[suit]) {
        acc[suit] += 1;
      } else {
        acc[suit] = 1;
      }
      return acc;
    },
    {} as Record<CardSuit, number>,
  );
  const flushSuit = Object.entries(suitCount).find(([, count]) => count >= 5);
  if (!flushSuit) {
    return null;
  }
  const flushCards = cards.filter((card) => card.suit === flushSuit[0]);
  return {
    handValue: 0x5,
    handCardsValue: [0x0, 0x0],
    remainingCardsValue: flushCards.map((card) => card.value),
    allCards: flushCards,
  };
}

function findStraight(cards: Array<Card>): HandStrengthReturn | null {
  const sortedCards = cards.sort((a, b) => b.value - a.value);
  for (let i = 0; i < sortedCards.length - 4; i++) {
    const straight = sortedCards.slice(i, i + 5);
    if (straight.length < 5) {
      return null;
    }
    const isStraight = straight.every((card, index) => {
      if (index === 0) {
        return true;
      }
      return card.value === straight[index - 1].value - 1;
    });
    if (isStraight) {
      return {
        handValue: 0x4,
        handCardsValue: [0x0, 0x0],
        remainingCardsValue: straight.map((card) => card.value),
        allCards: straight,
      };
    }
  }
  return null;
}

function findQuads(cards: Array<Card>): HandStrengthReturn | null {
  const cardCount = groupCardsByValue(cards);
  const cardCountArray = Object.entries(cardCount);
  const quadKey = cardCountArray.find(([, value]) => {
    return value === 4;
  });
  if (quadKey) {
    const quad = parseInt(quadKey[0]) as CardValue;
    const remainingCards = cards
      .filter((card) => card.value !== quad)
      .map((card) => card.value);
    return {
      handValue: 0x7,
      handCardsValue: [quad, 0x0],
      remainingCardsValue: remainingCards,
      allCards: cards.filter(
        (card) => card.value === quad || remainingCards.includes(card.value),
      ),
    };
  }

  return null;
}

function findTrips(cards: Array<Card>): HandStrengthReturn | null {
  const cardsValueGrouped = groupCardsByValue(cards);
  const cardsValueArray = Object.entries(cardsValueGrouped);
  const tripsValueIndex = cardsValueArray.find(([, value]) => value === 3);
  if (tripsValueIndex) {
    const tripsValue = parseInt(tripsValueIndex[0]) as CardValue;
    const remainingCards = cards.filter((card) => card.value !== tripsValue);

    const allCards = cards.filter(
      (card) => card.value === tripsValue || remainingCards.includes(card),
    );

    return {
      handValue: 0x3,
      handCardsValue: [tripsValue, 0x0],
      remainingCardsValue: remainingCards.map((card) => card.value),
      allCards,
    };
  }
  return null;
}

function findPair(cards: Array<Card>): HandStrengthReturn | null {
  const cardsValueGrouped = groupCardsByValue(cards);
  const cardsValueArray = Object.entries(cardsValueGrouped).sort(
    (a, b) => parseInt(b[0]) - parseInt(a[0]),
  );
  const pairValueIndex = cardsValueArray.find(([, value]) => value === 2);
  if (pairValueIndex) {
    const pairValue = parseInt(pairValueIndex[0]) as CardValue;
    const remainingCards = cards.filter((card) => card.value !== pairValue);

    const allCards = cards.filter(
      (card) => card.value === pairValue || remainingCards.includes(card),
    );

    return {
      handValue: 0x1,
      handCardsValue: [pairValue, 0x0],
      remainingCardsValue: remainingCards.map((card) => card.value),
      allCards,
    };
  }

  return null;
}

function findHighCards(
  remainingCards: Array<CardValue>,
  handValue: HandValue,
): Array<CardValue> {
  const highCardCount = highCardsMapping[handValue];
  const result = remainingCards.slice(0, highCardCount);
  result.push(...(new Array(5 - highCardCount).fill(0x0) as Array<CardValue>));
  return result.sort((a, b) => b - a);
}
