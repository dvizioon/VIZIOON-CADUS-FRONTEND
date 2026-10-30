import { describe, expect, test } from "bun:test";
import { moneyToWordsPt } from "./money-in-words";

describe("moneyToWordsPt", () => {
  test("converte 3500", () => {
    expect(moneyToWordsPt(3500)).toBe("Três mil e quinhentos reais");
  });

  test("converte 2800", () => {
    expect(moneyToWordsPt(2800)).toBe("Dois mil e oitocentos reais");
  });

  test("usa singular em 1", () => {
    expect(moneyToWordsPt(1)).toBe("Um real");
  });

  test("trata zero", () => {
    expect(moneyToWordsPt(0)).toBe("Zero reais");
  });
});
