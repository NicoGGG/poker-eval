import { Card } from "./hand";
import {
  groupCardsByValue,
  insertHexDigit,
  removeDuplicateValuesCards,
  shuffleArray,
} from "./utils";

describe("insertHexDigit", () => {
  it("should correctly insert a single digit", () => {
    const original = 0xa;
    const newDigit = 0x3;
    const result = insertHexDigit(original, newDigit);
    expect(result).toBe(0xa3);
  });

  it("should correctly insert a digit resulting in multiple digits", () => {
    const original = 0xa3;
    const newDigit = 0x4;
    const result = insertHexDigit(original, newDigit);
    expect(result).toBe(0xa34);
  });

  it("should correctly insert a digit into zero", () => {
    const original = 0x0;
    const newDigit = 0xb;
    const result = insertHexDigit(original, newDigit);
    expect(result).toBe(0xb);
  });

  it("should correctly insert a zero digit", () => {
    const original = 0x5;
    const newDigit = 0x0;
    const result = insertHexDigit(original, newDigit);
    expect(result).toBe(0x50);
  });

  it("should correctly handle insertion of the maximum hex digit", () => {
    const original = 0x7;
    const newDigit = 0xf;
    const result = insertHexDigit(original, newDigit);
    expect(result).toBe(0x7f);
  });

  it("should handle multiple insertions correctly", () => {
    let original = 0x1;
    original = insertHexDigit(original, 0x2);
    original = insertHexDigit(original, 0x3);
    const result = insertHexDigit(original, 0x4);
    expect(result).toBe(0x1234);
  });

  it("should handle insertion of hex digits sequentially", () => {
    let original = 0xa;
    original = insertHexDigit(original, 0xb);
    original = insertHexDigit(original, 0xc);
    const result = insertHexDigit(original, 0xd);
    expect(result).toBe(0xabcd);
  });
});

describe("shuffleArray", () => {
  test("should return an array of the same length", () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffledArr = shuffleArray(arr);
    expect(shuffledArr.length).toBe(arr.length);
  });

  test("should contain the same elements as the original array", () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffledArr = shuffleArray(arr);
    expect(shuffledArr.sort()).toEqual(arr.sort());
  });

  test("should not return the array in the same order", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const shuffledArr = shuffleArray(arr);
    // There's a very small chance this test could fail if the shuffled array ends up being the same as the original.
    expect(shuffledArr).not.toEqual(arr);
    const shuffledArr2 = shuffleArray(arr);
    expect(shuffledArr).not.toEqual(shuffledArr2);
  });

  test("should not mutate the original array", () => {
    const arr = [1, 2, 3, 4, 5];
    const arrCopy = [...arr];
    shuffleArray(arr);
    expect(arr).toEqual(arrCopy);
  });

  test("should handle empty arrays", () => {
    const arr: Array<any> = [];
    const shuffledArr = shuffleArray(arr);
    expect(shuffledArr).toEqual([]);
  });

  test("should handle arrays with one element", () => {
    const arr = [1];
    const shuffledArr = shuffleArray(arr);
    expect(shuffledArr).toEqual([1]);
  });
});

describe("removeDuplicateValuesCards", () => {
  test("should remove duplicate card values", () => {
    const cards: Card[] = [
      { suit: "H", value: 0xe },
      { suit: "D", value: 0xe },
      { suit: "C", value: 0xd },
      { suit: "S", value: 0xd },
      { suit: "H", value: 0xc },
    ];

    const result = removeDuplicateValuesCards(cards);

    expect(result).toEqual([
      { suit: "H", value: 0xe },
      { suit: "C", value: 0xd },
      { suit: "H", value: 0xc },
    ]);
  });

  test("should handle empty array", () => {
    const cards: Card[] = [];

    const result = removeDuplicateValuesCards(cards);

    expect(result).toEqual([]);
  });

  test("should handle array with no duplicates", () => {
    const cards: Card[] = [
      { suit: "H", value: 0xe },
      { suit: "D", value: 0xd },
      { suit: "C", value: 0xc },
    ];

    const result = removeDuplicateValuesCards(cards);

    expect(result).toEqual([
      { suit: "H", value: 0xe },
      { suit: "D", value: 0xd },
      { suit: "C", value: 0xc },
    ]);
  });

  test("should keep the first occurrence of each value", () => {
    const cards: Card[] = [
      { suit: "H", value: 0xe },
      { suit: "D", value: 0xd },
      { suit: "C", value: 0xe },
      { suit: "S", value: 0xc },
      { suit: "H", value: 0xd },
    ];

    const result = removeDuplicateValuesCards(cards);

    expect(result).toEqual([
      { suit: "H", value: 0xe },
      { suit: "D", value: 0xd },
      { suit: "S", value: 0xc },
    ]);
  });
});

describe("groupCardsByValue", () => {
  it("should group cards by their value and count them correctly", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x1 },
      { suit: "D", value: 0x2 },
      { suit: "C", value: 0x1 },
      { suit: "S", value: 0x3 },
      { suit: "H", value: 0x2 },
      { suit: "D", value: 0x2 },
    ];

    const result = groupCardsByValue(cards);
    expect(result).toEqual({
      "1": 2,
      "2": 3,
      "3": 1,
    });
  });

  it("should return an empty object for an empty array", () => {
    const cards: Array<Card> = [];

    const result = groupCardsByValue(cards);
    expect(result).toEqual({});
  });

  it("should handle cards with only one value", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x5 },
      { suit: "D", value: 0x5 },
      { suit: "C", value: 0x5 },
    ];

    const result = groupCardsByValue(cards);
    expect(result).toEqual({
      "5": 3,
    });
  });

  it("should handle a case with all unique values", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0x1 },
      { suit: "D", value: 0x2 },
      { suit: "C", value: 0x3 },
      { suit: "S", value: 0x4 },
    ];

    const result = groupCardsByValue(cards);
    expect(result).toEqual({
      "1": 1,
      "2": 1,
      "3": 1,
      "4": 1,
    });
  });

  it("should handle cards with the maximum value", () => {
    const cards: Array<Card> = [
      { suit: "H", value: 0xe },
      { suit: "D", value: 0xe },
      { suit: "C", value: 0xe },
      { suit: "S", value: 0xe },
    ];

    const result = groupCardsByValue(cards);
    expect(result).toEqual({
      "14": 4,
    });
  });
});
