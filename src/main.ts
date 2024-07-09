import {
  convertHand,
  findBestHand,
  HandStrengthHex,
  type Board,
  type PocketHand,
} from "./hand";

type WinningHand = {
  handStrenght?: HandStrengthHex;
  indexes: Array<number>;
};
/**
 * The main function of the library. Takes an array of {PocketHand}
 * which represent the hand of each players, and a current {Board}
 * Will evaluate which hand wins by returning an array of 0 and 1
 * If the board is not 5 cards length, will simulate all possibilities of a 5 cards length
 * board using the remaining cards in the deck
 * If the board is 0 cards length (preflop), will simulate 10k possible random boards
 *
 * @param pocketHands - All the hands in play, one for each player. A hand is represented by several cards in the format "Ax"
 *
 * @param board - An array of cards in the format "Ax". Represent the common cards on the board (for holdem and omaha)
 *
 * @returns An array of numbers. Each number is the number of win for the player of the same index in pocketHands
 */
function pokerEval(
  pocketHands: Array<PocketHand>,
  board: Board,
): Array<number> {
  const handsStrenght = pocketHands.map((hand) => {
    const cards = convertHand(hand, board);
    return findBestHand(cards);
  });
  const winIndex = handsStrenght.reduce(
    (acc: WinningHand, hand, index) => {
      if (!acc.handStrenght || acc.handStrenght < hand) {
        acc = {
          handStrenght: hand,
          indexes: [index],
        };
      } else if (acc.handStrenght == hand) {
        acc.indexes.push(index);
      }
      return acc;
    },
    { handStrenght: undefined, indexes: [] } as WinningHand,
  );
  const wins = pocketHands.map((_, index) =>
    winIndex.indexes.includes(index) ? 1 : 0,
  );
  return wins;
}
export default pokerEval;
