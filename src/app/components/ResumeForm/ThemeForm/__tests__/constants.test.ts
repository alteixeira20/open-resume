import {
  clampNumericSettingDraft,
  normalizeThemeColorDraft,
} from "components/ResumeForm/ThemeForm/constants";

describe("theme settings safety helpers", () => {
  it("clamps unsafe numeric values while preserving valid in-range values", () => {
    expect(clampNumericSettingDraft("sectionSpacing", "-5")).toBe("0");
    expect(clampNumericSettingDraft("lineHeight", "999")).toBe("2.5");
    expect(clampNumericSettingDraft("companyRoleSpacing", "3.75")).toBe(
      "3.75"
    );
  });

  it("falls back to defaults for blank or invalid numeric input", () => {
    expect(clampNumericSettingDraft("topBarHeight", "")).toBe("10.5");
    expect(clampNumericSettingDraft("fontSize", "nope")).toBe("11");
  });

  it("accepts valid hex colors and rejects invalid theme colors", () => {
    expect(normalizeThemeColorDraft("#c25b14")).toBe("#c25b14");
    expect(normalizeThemeColorDraft("burnt-orange", "#2c1f19")).toBe(
      "#2c1f19"
    );
  });
});
