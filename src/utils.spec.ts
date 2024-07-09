import { insertHexDigit, shuffleArray } from "./utils";

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
