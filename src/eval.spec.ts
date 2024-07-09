import { CardRaw } from "./hand";
import pokerEval from "./main";

describe("pokerEval with full board (river)", () => {
  test("2 players, 1 win", () => {
    const pocketHands = [
      ["As", "Ks"],
      ["2d", "3d"],
    ];
    const board = ["Ah", "Kh", "Qh", "Jh", "9s"];

    const result = pokerEval(pocketHands, board);
    expect(result).toEqual([1, 0]);
  });

  test("2 players, draw", () => {
    const pocketHands = [
      ["As", "Ks"],
      ["Ad", "Kd"],
    ];
    const board = ["Ah", "Kh", "Qh", "Jh", "Th"];

    const result = pokerEval(pocketHands, board);
    expect(result).toEqual([1, 1]);
  });

  test("3 players, 1 win", () => {
    const pocketHands = [
      ["As", "Ks"],
      ["2d", "3d"],
      ["5h", "6h"],
    ];
    const board = ["Ah", "Kh", "Qh", "Jh", "9s"];

    const result = pokerEval(pocketHands, board);
    expect(result).toEqual([0, 0, 1]);
  });

  test("3 players, 2 way draw, 1 lose", () => {
    const pocketHands = [
      ["As", "Ks"],
      ["Ad", "Kd"],
      ["2d", "3d"],
    ];
    const board = ["Ah", "Kh", "Qh", "Jh", "9s"];

    const result = pokerEval(pocketHands, board);
    expect(result).toEqual([1, 1, 0]);
  });

  test("3 players, 3 way draw", () => {
    const pocketHands = [
      ["As", "Ks"],
      ["Ad", "Kd"],
      ["Ac", "Kc"],
    ];
    const board = ["Ah", "Kh", "Qh", "Jh", "Th"];

    const result = pokerEval(pocketHands, board);
    expect(result).toEqual([1, 1, 1]);
  });
});

describe("pokerEval with partial board (turn)", () => {
  test("2 players, 95.45/4.55 win split: 42 wins to 2 ", () => {
    const pocketHands = [
      ["Ah", "Ks"],
      ["8d", "8s"],
    ];
    const board = ["As", "7d", "2h", "9h"];

    const result = pokerEval(pocketHands, board);
    expect(result).toEqual([42, 2]);
  });
});

describe("pokerEval with partial board (flop)", () => {
  test("2 players, 91.21/8.79 win split: 903 wins to 87 ", () => {
    const pocketHands = [
      ["Ah", "Ks"],
      ["8d", "8s"],
    ];
    const board = ["As", "7d", "2h"];

    const result = pokerEval(pocketHands, board);
    expect(result).toEqual([903, 87]);
  });
});

describe("pokerEval with no board (preflop)", () => {
  test("2 players, 46.41/53.98 win split: 4641 wins to 5398", () => {
    const pocketHands = [
      ["Ah", "Ks"],
      ["8d", "8s"],
    ];
    const board: Array<CardRaw> = [];

    const result = pokerEval(pocketHands, board);
    // Due to the flakiness of testing random results, we use a 5% error margin from what is theoretically expected
    // Very unlucky deck shuffles could make this test fail
    const errorMargin = 0.05;
    const expectedResults = [4641, 5398];
    const minWinsPlayer1 = expectedResults[0] * (1 - errorMargin);
    const maxWinsPlayer1 = expectedResults[0] * (1 + errorMargin);
    const minWinsPlayer2 = expectedResults[1] * (1 - errorMargin);
    const maxWinsPlayer2 = expectedResults[1] * (1 + errorMargin);

    expect(result[0]).toBeGreaterThanOrEqual(minWinsPlayer1);
    expect(result[0]).toBeLessThanOrEqual(maxWinsPlayer1);
    expect(result[1]).toBeGreaterThanOrEqual(minWinsPlayer2);
    expect(result[1]).toBeLessThanOrEqual(maxWinsPlayer2);
  });
});
