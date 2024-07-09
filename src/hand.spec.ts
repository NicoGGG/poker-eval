import {
  findBestHand,
  convertHand,
  Card,
  PocketHand,
  Board,
  HandStrengthHex,
} from "./hand";

describe("convertHand", () => {
  it("should convert a simple hand correctly", () => {
    const pocketHand: PocketHand = ["2H", "3D"];
    const board: Board = ["4C", "5S"];
    const result: Array<Card> = convertHand(pocketHand, board);
    expect(result).toEqual([
      { suit: "S", value: 0x5 },
      { suit: "C", value: 0x4 },
      { suit: "D", value: 0x3 },
      { suit: "H", value: 0x2 },
    ]);
  });

  it("should sort the cards by value", () => {
    const pocketHand: PocketHand = ["KH", "2D"];
    const board: Board = ["5C", "AS"];
    const result: Array<Card> = convertHand(pocketHand, board);
    expect(result).toEqual([
      { suit: "S", value: 0xe },
      { suit: "H", value: 0xd },
      { suit: "C", value: 0x5 },
      { suit: "D", value: 0x2 },
    ]);
  });

  it("should handle duplicate values correctly", () => {
    const pocketHand: PocketHand = ["3H", "3D"];
    const board: Board = ["3C", "3S"];
    const result: Array<Card> = convertHand(pocketHand, board);
    expect(result).toEqual([
      { suit: "S", value: 0x3 },
      { suit: "H", value: 0x3 },
      { suit: "D", value: 0x3 },
      { suit: "C", value: 0x3 },
    ]);
  });

  it("should throw an error for invalid suit", () => {
    const pocketHand: PocketHand = ["2Z"];
    const board: Board = ["3H"];
    expect(() => convertHand(pocketHand, board)).toThrow("Invalid suit: Z");
  });

  it("should throw an error for invalid value", () => {
    const pocketHand: PocketHand = ["ZH"];
    const board: Board = ["3H"];
    expect(() => convertHand(pocketHand, board)).toThrow("Invalid value: Z");
  });

  it("should handle empty input correctly", () => {
    const pocketHand: PocketHand = [];
    const board: Board = [];
    const result: Array<Card> = convertHand(pocketHand, board);
    expect(result).toEqual([]);
  });

  it("should handle mixed pocket hand and board", () => {
    const pocketHand: PocketHand = ["2H"];
    const board: Board = ["3D", "4C", "5S"];
    const result: Array<Card> = convertHand(pocketHand, board);
    expect(result).toEqual([
      { suit: "S", value: 0x5 },
      { suit: "C", value: 0x4 },
      { suit: "D", value: 0x3 },
      { suit: "H", value: 0x2 },
    ]);
  });

  it("should be case insensitive for card values", () => {
    const pocketHand: PocketHand = ["Ah"];
    const board: Board = ["Kd"];
    const result: Array<Card> = convertHand(pocketHand, board);
    expect(result).toEqual([
      { suit: "H", value: 0xe },
      { suit: "D", value: 0xd },
    ]);
  });

  it("should handle full deck", () => {
    const pocketHand: PocketHand = [
      "2H",
      "3D",
      "4C",
      "5S",
      "6H",
      "7D",
      "8C",
      "9S",
      "TH",
      "JD",
      "QC",
      "KS",
      "AH",
    ];
    const board: Board = [];
    const result: Array<Card> = convertHand(pocketHand, board);
    expect(result).toEqual([
      { suit: "H", value: 0xe },
      { suit: "S", value: 0xd },
      { suit: "C", value: 0xc },
      { suit: "D", value: 0xb },
      { suit: "H", value: 0xa },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0x8 },
      { suit: "D", value: 0x7 },
      { suit: "H", value: 0x6 },
      { suit: "S", value: 0x5 },
      { suit: "C", value: 0x4 },
      { suit: "D", value: 0x3 },
      { suit: "H", value: 0x2 },
    ]);
  });

  it("should handle edge case with lowest and highest values", () => {
    const pocketHand: PocketHand = ["2H"];
    const board: Board = ["AD"];
    const result: Array<Card> = convertHand(pocketHand, board);
    expect(result).toEqual([
      { suit: "D", value: 0xe },
      { suit: "H", value: 0x2 },
    ]);
  });
});

describe("findBestHand", () => {
  it("should return the correct HandStrengthHex for a high card", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x2 },
      { suit: "D", value: 0x4 },
      { suit: "C", value: 0x6 },
      { suit: "S", value: 0x8 },
      { suit: "H", value: 0xa },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0x3 },
    ];
    const result: HandStrengthHex = findBestHand(cards);
    expect(result).toBe(0x000a9864);
  });

  it("should return the correct HandStrengthHex for one pair", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x2 },
      { suit: "D", value: 0x2 },
      { suit: "C", value: 0x6 },
      { suit: "S", value: 0x8 },
      { suit: "H", value: 0xa },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0x3 },
    ];
    const result: HandStrengthHex = findBestHand(cards);
    expect(result).toBe(0x120a9800);
  });

  it("should return the correct HandStrengthHex for one pair of Ace", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0xe },
      { suit: "D", value: 0xe },
      { suit: "C", value: 0x6 },
      { suit: "S", value: 0x8 },
      { suit: "H", value: 0xa },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0x3 },
    ];
    const result: HandStrengthHex = findBestHand(cards);
    expect(result).toBe(0x1e0a9800);
  });

  it("should return the correct HandStrengthHex for two pairs", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x2 },
      { suit: "D", value: 0x2 },
      { suit: "C", value: 0x6 },
      { suit: "S", value: 0x6 },
      { suit: "H", value: 0xa },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0x3 },
    ];
    const result: HandStrengthHex = findBestHand(cards);
    expect(result).toBe(0x262a0000);
  });

  it("should return the correct HandStrengthHex for three of a kind", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x2 },
      { suit: "D", value: 0x2 },
      { suit: "C", value: 0x2 },
      { suit: "S", value: 0x8 },
      { suit: "H", value: 0xa },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0x3 },
    ];
    const result: HandStrengthHex = findBestHand(cards);
    expect(result).toBe(0x320a9000);
  });

  it("should return the correct HandStrengthHex for a straight", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x2 },
      { suit: "D", value: 0x3 },
      { suit: "C", value: 0x4 },
      { suit: "S", value: 0x5 },
      { suit: "H", value: 0x6 },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0xa },
    ];
    const result: HandStrengthHex = findBestHand(cards);
    expect(result).toBe(0x40065432);
  });

  it("should return the correct HandStrengthHex for a straight with Ace Low", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x2 },
      { suit: "D", value: 0x3 },
      { suit: "C", value: 0x4 },
      { suit: "S", value: 0x5 },
      { suit: "H", value: 0x7 },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0xe },
    ];
    const result: HandStrengthHex = findBestHand(cards);
    expect(result).toBe(0x40054321);
  });

  it("should return the correct HandStrengthHex for a flush", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x2 },
      { suit: "H", value: 0x4 },
      { suit: "H", value: 0x6 },
      { suit: "H", value: 0x8 },
      { suit: "H", value: 0xa },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0x3 },
    ];
    const result: HandStrengthHex = findBestHand(cards);
    expect(result).toBe(0x500a8642);
  });

  it("should return the correct HandStrengthHex for a full house", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x2 },
      { suit: "D", value: 0x2 },
      { suit: "C", value: 0x2 },
      { suit: "S", value: 0xa },
      { suit: "H", value: 0xa },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0x3 },
    ];
    const result: HandStrengthHex = findBestHand(cards);
    expect(result).toBe(0x62a00000);
  });

  it("should return the correct HandStrengthHex for four of a kind", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x2 },
      { suit: "D", value: 0x2 },
      { suit: "C", value: 0x2 },
      { suit: "S", value: 0x2 },
      { suit: "H", value: 0xa },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0x3 },
    ];
    const result: HandStrengthHex = findBestHand(cards);
    expect(result).toBe(0x720a0000);
  });

  it("should return the correct HandStrengthHex for a straight flush", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x2 },
      { suit: "H", value: 0x3 },
      { suit: "H", value: 0x4 },
      { suit: "H", value: 0x5 },
      { suit: "H", value: 0x6 },
      { suit: "S", value: 0x9 },
      { suit: "C", value: 0xa },
    ];
    const result: HandStrengthHex = findBestHand(cards);
    expect(result).toBe(0x80065432);
  });
});
