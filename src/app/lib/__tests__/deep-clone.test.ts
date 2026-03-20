import { deepClone } from "lib/deep-clone";

describe("deepClone", () => {
  it("creates a new deep-copied object", () => {
    const original = {
      name: "CVForge",
      nested: { value: 1 },
    };

    const cloned = deepClone(original);
    cloned.nested.value = 2;

    expect(cloned).toEqual({
      name: "CVForge",
      nested: { value: 2 },
    });
    expect(original.nested.value).toBe(1);
  });
});
