import { Board, Card, CardRaw, deck, PocketHand } from "./hand";
import { convertCard, shuffleArray } from "./utils";

/** Converts a hand and a board to an array of Card objects
 * This is specific to Texas Hold'em and work only for this game
 *
 * @param pocketHand - An array of strings representing cards held by a player
 * @param board - An array of strings representing the common cards of the board
 *
 * @returns An array of Card object, sorted by value descending
 *
 * @example
 * const pocketHand: PocketHand = ["2H"];
 * const board: Board = ["3D", "4C", "5S"];
 * const result: Array<Card> = convertHand(pocketHand, board);
 * console.log(result); // [{ suit: "S", value: 0x5 }, { suit: "C", value: 0x4 }, { suit: "D", value: 0x3 }, { suit: "H", value: 0x2 }]
 */
export function convertHand(pocketHand: PocketHand, board: Board): Array<Card> {
  return [...pocketHand, ...board]
    .map((card) => convertCard(card))
    .sort((a, b) => {
      if (!(b.value - a.value)) {
        return b.suit.localeCompare(a.suit);
      }
      return b.value - a.value;
    });
}

export function generatePossibleBoards(
  pocketHands: Array<PocketHand>,
  board: Board,
): Array<Board> {
  const allPocketCards = pocketHands.flat().map((card) => card.toUpperCase());
  const initialBoard = board.map((card) => card.toUpperCase());
  const remainingCards = deck.filter(
    (card) => !initialBoard.includes(card) && !allPocketCards.includes(card),
  );
  const possibleBoards: Array<Board> = [];
  if (initialBoard.length === 5) {
    possibleBoards.push(initialBoard);
    return possibleBoards;
  }
  if (!initialBoard.length) {
    for (let i = 0; i < 10000; i++) {
      let shuffledDeck = shuffleArray(remainingCards);
      let { newBoard } = generateBoard(initialBoard, shuffledDeck);
      possibleBoards.push(newBoard);
    }
  }
  if (initialBoard.length === 4) {
    remainingCards.forEach((card) => {
      possibleBoards.push([...initialBoard, card]);
    });
  }
  if (initialBoard.length === 3) {
    const remainingCardsCount = remainingCards.length;
    for (let i = 0; i < remainingCardsCount; i++) {
      const popedCard = remainingCards.pop();
      if (!popedCard) {
        throw new Error("Something went wrong. Deck should not be empty");
      }
      const subPossibleBoard = [...initialBoard, popedCard];
      remainingCards.forEach((card) => {
        possibleBoards.push([...subPossibleBoard, card]);
      });
    }
  }
  return possibleBoards;
}

type GenerateBoardReturn = {
  newBoard: Board;
};

function generateBoard(
  board: Board,
  deck: Array<CardRaw>,
): GenerateBoardReturn {
  const newBoard = board.slice();
  while (newBoard.length < 5) {
    let popedCard = deck.pop();
    if (!popedCard) {
      throw new Error("Something went wrong. Deck should not be empty");
    }
    newBoard.push(popedCard);
  }
  return {
    newBoard,
  };
}
