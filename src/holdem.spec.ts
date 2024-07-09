import { Board } from "./hand";
import { generatePossibleBoards } from "./holdem";

describe("generatePossibleBoards", () => {
  it("should return initial board when board length is 5 (river)", () => {
    const pocketHands = [
      ["As", "Ks"],
      ["2d", "3d"],
    ];
    const board = ["Ah", "Kh", "Qh", "Jh", "Th"];
    const possibleBoards = generatePossibleBoards(pocketHands, board);
    expect(possibleBoards.length).toBe(1);
    expect(possibleBoards[0]).toEqual(board.map((card) => card.toUpperCase()));
  });

  it("should generate possible boards when board length is 4 (turn)", () => {
    const pocketHands = [
      ["As", "Ks"],
      ["2d", "3d"],
    ];
    const board = ["Ah", "Kh", "Qh", "Jh"];
    const possibleBoards = generatePossibleBoards(pocketHands, board);
    expect(possibleBoards.length).toBe(
      44,
    );
    possibleBoards.forEach((newBoard) => {
      expect(newBoard.length).toBe(5);
      expect(newBoard.slice(0, 4)).toEqual(
        board.map((card) => card.toUpperCase()),
      );
    });
  });

  it("should generate all possible boards when board length is 3 (flop)", () => {
    const pocketHands = [
      ["As", "Ks"],
      ["2d", "3d"],
    ];
    const board = ["Ah", "Kh", "Qh"];
    const possibleBoards = generatePossibleBoards(pocketHands, board);
    expect(possibleBoards.length).toBe(
      990, // 44 * 45 / 2
    );
  });

  it("should generate 10k possible boards when board length is 0 (preflop)", () => {
    const pocketHands = [
      ["As", "Ks"],
      ["2d", "3d"],
    ];
    const board: Board = [];
    const possibleBoards = generatePossibleBoards(pocketHands, board);
    expect(possibleBoards.length).toBe(10000);
  });
});
