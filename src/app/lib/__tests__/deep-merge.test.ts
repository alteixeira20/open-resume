import { deepMerge } from "lib/deep-merge";

describe("deepMerge", () => {
  it("merges nested objects without mutating the target", () => {
    const target = {
      name: "Jane",
      nested: { level: 1, value: "keep" },
    };
    const source = {
      active: true,
      nested: { value: "override", next: "add" },
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      name: "Jane",
      active: true,
      nested: { level: 1, value: "override", next: "add" },
    });
    expect(target).toEqual({
      name: "Jane",
      nested: { level: 1, value: "keep" },
    });
  });
});
