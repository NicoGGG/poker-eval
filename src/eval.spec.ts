import pokerEval from "./main";

describe("pokerEval", () => {
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
