import { initialFeaturedSkills } from "lib/redux/resumeSlice";

describe("resumeSlice initial state", () => {
  it("creates unique featured skill objects", () => {
    const unique = new Set(initialFeaturedSkills);

    expect(unique.size).toBe(initialFeaturedSkills.length);
  });
});
