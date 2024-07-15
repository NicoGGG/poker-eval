import { findBestHand, type Board, type PocketHand } from "./hand";

import { convertHand, generatePossibleBoards } from "./holdem";

type WinningHand = {
  handStrength?: number;
  indexes: Array<number>;
};
/**
 * The main function of the library. Takes an array of {PocketHand}
 * which represent the hands of each players, and a current {Board}
 * Will evaluate which hands win by returning an array of 0 and 1
 *
 * If the board is not 5 cards length (river), will simulate all possibilities of a 5 cards length
 * board using the remaining cards in the deck
 * If the board is 0 cards length (preflop), will simulate 10k possible random boards
 *
 * @param pocketHands - All the hands in play, one for each player. A hand is represented by several cards in the format "Ax"
 *
 * @param possibleBoard - An array of cards in the format "Ax". Represent the common cards on the board (for holdem and omaha)
 *
 * @returns An array of numbers. Each number is the number of win for the player of the same index in pocketHands
 */
function pokerEval(
  pocketHands: Array<PocketHand>,
  board: Board,
): Array<number> {
  const possibleBoards = generatePossibleBoards(pocketHands, board);
  // For each possible board, return a wins array with the win/lose of each player by index,
  // then reduce it by adding all values together per index
  const allWins = possibleBoards.map((possibleBoard) => {
    const handsStrength = pocketHands.map((hand) => {
      const cards = convertHand(hand, possibleBoard);
      return findBestHand(cards);
    });
    const winIndex = handsStrength.reduce(
      (acc: WinningHand, hand, index) => {
        if (!acc.handStrength || acc.handStrength < hand) {
          acc = {
            handStrength: hand,
            indexes: [index],
          };
        } else if (acc.handStrength == hand) {
          acc.indexes.push(index);
        }
        return acc;
      },
      { handStrength: undefined, indexes: [] } as WinningHand,
    );
    const wins = pocketHands.map((_, index) =>
      winIndex.indexes.includes(index) ? 1 : 0,
    );
    return wins;
  });
  return allWins.reduce((acc, value) => {
    if (!acc.length) {
      return value;
    } else {
      return acc.map((a, index) => {
        return a + value[index];
      });
    }
  }, [] as number[]);
}
export default pokerEval;
module.exports = pokerEval;
