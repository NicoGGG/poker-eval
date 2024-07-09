import { insertHexDigit } from "./utils";

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